#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const RULES_PATH = path.join(__dirname, 'hh_targeting_rules.json');
const SALES_PATH = path.join(__dirname, 'hh_sales_profile.json');
const PROMPT_PATH = path.join(__dirname, 'hh_cover_letter_prompt.md');
const KNOWN_RESUME_HASHES = [
  '5647f713ff099c6a830039ed1f634543613270',
  'ffb82f55ff09ef68920039ed1f617a55384446',
  'd78cc1c2ff09b485510039ed1f345339387a52',
  '8e7822fbff0bbd83ca0039ed1f517935593554',
  'a61c842cff099af07b0039ed1f3170777a6579',
  '8923dd0eff0075bc690039ed1f736563726574',
  '6a9d4b40ff09c37a6c0039ed1f354d384d3634',
  '0da5d09cff095be04e0039ed1f6a6c50705844',
  '5bc4323cff071925eb0039ed1f674f794d6158',
  '8619e5f7ff0bbd7faa0039ed1f63706e745766'
];
const RESUME_HASH_BY_TITLE = {
  'Fractional CTO / Interim CTO': '5647f713ff099c6a830039ed1f634543613270',
  'Fractional CTO / Interim CTO / Технический руководитель': 'ffb82f55ff09ef68920039ed1f617a55384446',
  'Digital Transformation Lead / IT Transformation Manager': 'd78cc1c2ff09b485510039ed1f345339387a52',
  'Руководитель цифровой трансформации / IT Transformation Lead': '8e7822fbff0bbd83ca0039ed1f517935593554',
  'Technical Product Lead / Product Owner': 'a61c842cff099af07b0039ed1f3170777a6579',
  'Технический Product Lead / Product Owner': '8923dd0eff0075bc690039ed1f736563726574',
  'Systems Architect / Solutions Architect': '6a9d4b40ff09c37a6c0039ed1f354d384d3634',
  'Системный архитектор / Solution Architect': '0da5d09cff095be04e0039ed1f6a6c50705844',
  'Head of Engineering / Engineering Manager': '5bc4323cff071925eb0039ed1f674f794d6158',
  'Руководитель разработки / Engineering Manager': '8619e5f7ff0bbd7faa0039ed1f63706e745766'
};

function parseArgs(argv) {
  const args = {
    mode: 'dry-run',
    max: 10,
    cdp: 'http://127.0.0.1:9223',
    generate: 'stub',
    submit: false,
    startUrl: 'https://hh.ru/applicant/resumes',
    currentVacancy: false,
    applyAll: false,
    allowResumeMismatch: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--mode') { args.mode = next; i += 1; }
    else if (arg === '--max') { args.max = Number(next); i += 1; }
    else if (arg === '--cdp') { args.cdp = next; i += 1; }
    else if (arg === '--generate') { args.generate = next; i += 1; }
    else if (arg === '--start-url') { args.startUrl = next; i += 1; }
    else if (arg === '--submit') args.submit = true;
    else if (arg === '--current-vacancy') args.currentVacancy = true;
    else if (arg === '--apply-all') args.applyAll = true;
    else if (arg === '--allow-resume-mismatch') args.allowResumeMismatch = true;
    else if (arg === '--help') args.help = true;
  }
  return args;
}

function help() {
  console.log(`Usage:
  node workflows/hh_apply_worker.js --mode dry-run --max 20
  node workflows/hh_apply_worker.js --mode live --generate openai --submit --max 5
  node workflows/hh_apply_worker.js --mode live --generate openai --submit --apply-all --max 5

Modes:
  dry-run  extract/classify/log only; never submit
  live     can open response forms; submits only with --submit

Generation:
  stub     deterministic placeholder cover letter
  openai   call OpenAI Responses API using OPENAI_API_KEY and HH_COVER_MODEL/OPENAI_MODEL

Flags:
  --apply-all  treat every not-yet-applied vacancy as an apply candidate unless there is a hard blocker
  --allow-resume-mismatch  submit even if HH form keeps a different resume than the worker expected

This worker uses native Chrome DevTools Protocol over ws://127.0.0.1:9223.
`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function norm(value) {
  return String(value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function compact(value, max = 2400) {
  const text = norm(value);
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function includesAny(text, items) {
  const lower = text.toLowerCase();
  return items.find((item) => lower.includes(String(item).toLowerCase())) || '';
}

class CdpPage {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.ws = null;
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg);
      }
    });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP WebSocket open timeout')), 10000);
      this.ws.addEventListener('open', () => {
        clearTimeout(timer);
        resolve();
      });
      this.ws.addEventListener('error', (event) => {
        clearTimeout(timer);
        reject(new Error(`CDP WebSocket error: ${event.message || 'unknown'}`));
      });
    });
    await this.send('Runtime.enable');
    await this.send('Page.enable');
  }

  async send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    const payload = JSON.stringify({ id, method, params });
    const promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timeout`));
      }, 20000);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        }
      });
    });
    this.ws.send(payload);
    return promise;
  }

  async eval(expression) {
    const msg = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (msg.result.exceptionDetails) {
      throw new Error(JSON.stringify(msg.result.exceptionDetails));
    }
    return msg.result.result.value;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await sleep(1800);
  }

  async clickAt(x, y) {
    await this.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      clickCount: 1
    });
    await this.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount: 1
    });
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function findCdpWs(cdpBase) {
  const tabs = await (await fetch(`${cdpBase.replace(/\/$/, '')}/json/list`)).json();
  const list = Array.isArray(tabs) ? tabs : [tabs];
  const page = list.find((tab) => tab.type === 'page' && String(tab.url || '').includes('hh.ru')) ||
    list.find((tab) => tab.type === 'page') ||
    list.find((tab) => tab.webSocketDebuggerUrl);
  if (!page?.webSocketDebuggerUrl) throw new Error(`No CDP page target found at ${cdpBase}`);
  return page.webSocketDebuggerUrl;
}

function jsString(value) {
  return JSON.stringify(String(value));
}

async function extractVacancy(page) {
  return page.eval(`(() => {
    const norm = (v) => (v || '').replace(/\\u00a0/g, ' ').replace(/\\s+/g, ' ').trim();
    const text = (selector) => norm(document.querySelector(selector)?.textContent || '');
    return {
      title: text('[data-qa="vacancy-title"]'),
      company: text('[data-qa="vacancy-company-name"]'),
      salary: text('[data-qa="vacancy-salary"]'),
      experience: text('[data-qa="vacancy-experience"]'),
      employment: text('[data-qa="common-employment-text"]'),
      schedule: text('[data-qa="work-schedule-by-days-text"]'),
      workHours: text('[data-qa="working-hours-text"]'),
      workplace: text('[data-qa="work-place-text"]'),
      skills: [...document.querySelectorAll('[data-qa="skills-element"]')].map((e) => norm(e.textContent)).filter(Boolean),
      description: norm(document.querySelector('[data-qa="vacancy-description"]')?.innerText || ''),
      url: location.href
    };
  })()`);
}

async function getApplicationStatus(page) {
  return page.eval(`(() => {
    const body = document.body.innerText || '';
    if (/Вы\\s*откликнулись/i.test(body)) return 'Вы откликнулись';
    if (/You applied/i.test(body)) return 'You applied';
    if (/Резюме\\s*доставлено/i.test(body)) return 'Резюме доставлено';
    return '';
  })()`);
}

async function collectVacancyLinks(page, limit) {
  return page.eval(`(() => {
    const seen = new Set();
    return [...document.querySelectorAll('a[href*="/vacancy/"]')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const href = element.href || '';
        const text = (element.innerText || element.textContent || '').replace(/\\s+/g, ' ').trim();
        return { href, text, visible: rect.width > 0 && rect.height > 0 };
      })
      .filter((item) => /\\/vacancy\\/\\d+/.test(item.href) && item.visible && item.href && item.text && !seen.has(item.href) && seen.add(item.href))
      .slice(0, ${Number(limit)});
  })()`);
}

async function ensureVacancyListView(page) {
  const listHref = await page.eval(`(() => {
    if (!location.href.includes('/search/vacancy/map')) return '';
    const fromButton = document.querySelector('[data-qa="vacancy-map-close"]')?.href || '';
    if (fromButton) return fromButton;
    const url = new URL(location.href);
    const resume = url.searchParams.get('resume') || '';
    const next = new URL('/search/vacancy', location.origin);
    next.searchParams.set('ored_clusters', 'true');
    if (resume) next.searchParams.set('resume', resume);
    next.searchParams.set('hhtmFrom', 'vacancy_search_map');
    return next.href;
  })()`);
  if (listHref) {
    console.log('[worker] switching map to list view');
    await page.navigate(listHref);
  }
}

async function waitForVacancyListLinks(page, limit) {
  let links = [];
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await ensureVacancyListView(page);
    await sleep(1000);
    links = await collectVacancyLinks(page, limit);
    const url = await page.eval('location.href');
    if (links.length) {
      console.log(`[worker] found ${links.length} vacancy links`);
      return links;
    }
    if (attempt === 3 || attempt === 7) {
      console.log(`[worker] waiting for vacancy list links; current url: ${url}`);
    }
  }
  return links;
}

async function collectRecommendationLinks(page, limit = 10) {
  return page.eval(`(() => {
    const seen = new Set();
    return [...document.querySelectorAll('a[href*="/search/vacancy"][href*="resume="]')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const href = element.href || '';
        const text = (element.innerText || element.textContent || '').replace(/\\s+/g, ' ').trim();
        const qa = element.getAttribute('data-qa') || '';
        return { href, text, qa, visible: rect.width > 0 && rect.height > 0 };
      })
      .filter((item) =>
        item.visible &&
        item.href &&
        /resume=/.test(item.href) &&
        (/ваканс/i.test(item.text) || /recommendations/i.test(item.qa)) &&
        !seen.has(item.href) &&
        seen.add(item.href)
      )
      .slice(0, ${Number(limit)});
  })()`);
}

async function fallbackRecommendationLinks(limit = 10) {
  return KNOWN_RESUME_HASHES.slice(0, limit).map((hash) => ({
    href: `https://hh.ru/search/vacancy?ored_clusters=true&resume=${hash}&hhtmFrom=resume_list`,
    text: `fallback resume ${hash.slice(0, 8)}`,
    qa: 'fallback-resume-recommendation',
    visible: true
  }));
}

async function getVisibleResponseHref(page) {
  return page.eval(`(() => {
    const selectors = [
      '[data-qa="vacancy-response-link-top"]',
      '[data-qa="vacancy-serp__vacancy_response"]'
    ];
    for (const selector of selectors) {
      const matches = [...document.querySelectorAll(selector)].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.textContent || '',
          href: element.href || '',
          visible: rect.width > 0 && rect.height > 0
        };
      });
      const match = matches.find((item) => item.visible && item.href && /Отклик|Respond|Apply/i.test(item.text));
      if (match) return match.href;
    }
    return '';
  })()`);
}

async function selectResume(page, expectedText) {
  let opened;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    opened = await page.eval(`(() => {
    const norm = (v) => (v || '').replace(/\\s+/g, ' ').trim();
    const expected = ${jsString(expectedText)};
    const title = document.querySelector('[data-qa="resume-title"]');
    const current = norm(title?.innerText || title?.textContent || '');
    if (current.includes(expected)) return { before: current, final: current, expected, ok: true, changed: false };
    const card = title?.closest('[role="button"]') || title?.closest('[tabindex]') || title?.closest('[data-qa="cell"]') || title?.parentElement;
    card?.scrollIntoView({ block: 'center' });
    const rect = card?.getBoundingClientRect();
    card?.click();
    return { before: current, final: current, expected, ok: false, changed: false, x: rect ? rect.x + rect.width / 2 : 0, y: rect ? rect.y + rect.height / 2 : 0 };
  })()`);
    if (opened.ok) return opened;
    if (!opened.x || !opened.y) return opened;

    await sleep(1000 + attempt * 600);

    const hasOption = await page.eval(`(() => [...document.querySelectorAll('[data-qa^="magritte-select-option-"], [role="option"]')].some((element) => element.getAttribute('role') === 'option' || /^magritte-select-option-[0-9a-f]/i.test(element.getAttribute('data-qa') || '')))()`);
    if (hasOption) break;
  }

  const option = await page.eval(`(() => {
      const expected = ${jsString(expectedText)};
      const expectedHash = ${jsString(RESUME_HASH_BY_TITLE[expectedText] || '')};
      const norm = (v) => (v || '').replace(/\\s+/g, ' ').trim();
      const options = [...document.querySelectorAll('[data-qa^="magritte-select-option-"], [role="option"]')]
        .filter((element) => element.getAttribute('role') === 'option' || /^magritte-select-option-[0-9a-f]/i.test(element.getAttribute('data-qa') || ''));
      const option = expectedHash
        ? document.querySelector('[data-qa="magritte-select-option-' + expectedHash + '"]')
        : options.find((element) => norm(element.innerText || element.textContent).includes(expected));
      option?.scrollIntoView({ block: 'center' });
      const rect = option?.getBoundingClientRect();
      option?.click();
      return { found: !!option, x: rect ? rect.x + rect.width / 2 : 0, y: rect ? rect.y + rect.height / 2 : 0, text: norm(option?.innerText || option?.textContent || '') };
    })()`);
  await sleep(900);

  const final = await page.eval(`(() => {
    const norm = (v) => (v || '').replace(/\\s+/g, ' ').trim();
    const title = document.querySelector('[data-qa="resume-title"]');
    return norm(title?.innerText || title?.textContent || '');
  })()`);
  return {
    before: opened.before,
    final,
    expected: expectedText,
    ok: final.includes(expectedText),
    changed: opened.before !== final,
    clickedOption: option.found,
    optionText: option.text
  };
}

async function fillCoverLetter(page, coverLetter) {
  return page.eval(`(() => {
    const value = ${jsString(coverLetter)};
    const toggle = document.querySelector('[data-qa="vacancy-response-letter-toggle"]');
    toggle?.click();
    const fill = () => {
      const el = document.querySelector('[data-qa="vacancy-response-popup-form-letter-input"]');
      if (!el) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
    return new Promise((resolve) => setTimeout(() => resolve(fill()), 500));
  })()`);
}

async function getVisibleFormFields(page) {
  return page.eval(`(() => [...document.querySelectorAll('textarea,input,select')]
    .filter((element) => !['hidden', 'submit', 'button'].includes(element.type))
    .map((element) => ({
      tag: element.tagName,
      type: element.type || '',
      name: element.name || '',
      qa: element.getAttribute('data-qa') || '',
      placeholder: element.placeholder || '',
      value: element.value || ''
    })))()`);
}

async function fillEmployerQuestions(page, coverLetter, language) {
  const fallbackAnswer = language === 'en'
    ? 'Yes. My relevant experience is strongest in technical leadership, architecture, delivery, automation, integrations, and stakeholder work around practical business systems.'
    : 'Да. Мой релевантный опыт сильнее всего связан с техническим лидерством, архитектурой, delivery, автоматизацией, интеграциями и работой со стейкхолдерами вокруг практичных бизнес-систем.';

  return page.eval(`(() => {
    const fallback = ${jsString(fallbackAnswer)};
    const cover = ${jsString(coverLetter)};
    const knownStack = [
      'docker', 'javascript', 'typescript', 'python', 'node', 'postgresql', 'sql', 'supabase', 'xano',
      'weweb', 'bubble', 'n8n', 'make', 'api', 'rest', 'telegram', 'openai', 'linux', 'nginx',
      'agile', 'scrum', 'kanban', 'crm', 'erp', 'b2b', 'b2g', 'domino', 'lotus', 'xpages'
    ];
    const isVisible = (element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const norm = (value) => (value || '').replace(/\\s+/g, ' ').trim();
    const contextText = (element) => {
      const aria = element.getAttribute('aria-labelledby');
      const fromAria = aria ? aria.split(/\\s+/).map((id) => document.getElementById(id)?.innerText || '').join(' ') : '';
      const label = element.closest('label')?.innerText || '';
      const parent = element.closest('[data-qa], fieldset, section, div')?.innerText || '';
      return norm([fromAria, label, parent].filter(Boolean).join(' ')).slice(0, 1200);
    };
    const answerFor = (question) => {
      const q = question.toLowerCase();
      if (/сопровод|cover|мотивац|почему|why|расскажите о себе|about yourself/.test(q)) return cover;
      if (/зарплат|salary|compensation|ожидан/.test(q)) return '';
      if (/гражданств|разрешение|виза|visa|relocat|релокац|переезд/.test(q)) return '';
      if (/англий|english/.test(q)) return 'Английский подтвержден сертификацией на hh; рабочий уровень для переписки, документации и коммуникации.';
      if (/docker/.test(q)) return 'Да, есть практический опыт с Docker и docker compose в контексте развертывания и поддержки прикладных систем.';
      if (/api|интеграц|integration/.test(q)) return 'Да, есть сильный практический опыт API-интеграций, REST API, связки внутренних систем, CRM/ERP, порталов и автоматизаций.';
      if (/crm|erp|портал|portal|автоматизац|automation/.test(q)) return 'Да, есть опыт проектирования и внедрения CRM/ERP, порталов, интеграций, отчетности и автоматизации бизнес-процессов.';
      if (/руковод|lead|team|команд|management|менедж/.test(q)) return 'Да, есть опыт технического лидерства, управления IT/разработкой, координации delivery, работы со стейкхолдерами и структурирования процессов.';
      if (/архитект|architect|system design|solution/.test(q)) return 'Да, есть опыт системной и solution-архитектуры: интеграции, роли и доступы, reporting, legacy modernization, backend/data-модели и внедрение систем в эксплуатацию.';
      if (/b2b|b2g|заказчик|stakeholder|стейкхолдер/.test(q)) return 'Да, есть опыт B2B/B2G-коммуникации, согласования требований, документации, внедрения изменений и работы со сложными стейкхолдерами.';
      if (/опыт|experience|есть ли|имеете ли/.test(q)) return fallback;
      return '';
    };
    const isSafePositive = (text) => {
      const q = text.toLowerCase();
      if (/зарплат|salary|гражданств|виза|visa|relocat|переезд|готовы работать бесплатно|без оплаты/.test(q)) return false;
      if (/соглас|agree|accept|подтверж|consent/.test(q)) return true;
      if (/готов|ready|да|yes/.test(q) && !/нет|no/.test(q)) return true;
      if (/опыт|experience|имеете|есть ли/.test(q)) {
        return knownStack.some((token) => q.includes(token)) || /руковод|команд|архитект|crm|erp|api|интеграц|автоматизац|b2b|b2g/.test(q);
      }
      return false;
    };
    const setInput = (element, value) => {
      const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const filled = [];
    const blockers = [];

    for (const element of [...document.querySelectorAll('textarea,input')]) {
      if (!isVisible(element)) continue;
      const qa = element.getAttribute('data-qa') || '';
      const type = element.type || '';
      if (qa === 'vacancy-response-popup-form-letter-input') continue;
      if (qa.includes('resume')) continue;
      if (['hidden', 'submit', 'button', 'file'].includes(type)) continue;

      if (element instanceof HTMLTextAreaElement && !element.value.trim()) {
        const questionText = contextText(element);
        const answer = answerFor(questionText);
        if (!answer) {
          blockers.push({ qa, type: 'textarea', question: questionText.slice(0, 500) });
          continue;
        }
        setInput(element, answer);
        filled.push({ qa, type: 'textarea', question: questionText.slice(0, 240), answer: answer.slice(0, 160) });
        continue;
      }

      if (element instanceof HTMLInputElement && ['text', 'search', 'email', 'tel', 'url', 'number'].includes(type) && !element.value.trim()) {
        const questionText = contextText(element);
        const answer = answerFor(questionText);
        if (!answer) {
          blockers.push({ qa, type, question: questionText.slice(0, 500) });
          continue;
        }
        setInput(element, answer);
        filled.push({ qa, type, question: questionText.slice(0, 240), answer: answer.slice(0, 160) });
        continue;
      }
    }

    const radioGroups = new Set();
    for (const element of [...document.querySelectorAll('input[type="radio"]')]) {
      if (!isVisible(element)) continue;
      if (!element.name || radioGroups.has(element.name)) continue;
      radioGroups.add(element.name);
      const group = [...document.querySelectorAll('input[type="radio"][name="' + CSS.escape(element.name) + '"]')].filter(isVisible);
      if (group.some((item) => item.checked)) continue;
      const groupText = norm(group.map((item) => contextText(item)).join(' '));
      const positive = group.find((item) => isSafePositive(item.value || item.closest('label')?.innerText || item.parentElement?.innerText || groupText));
      const chosen = positive;
      if (!chosen) {
        blockers.push({ qa: element.getAttribute('data-qa') || '', type: 'radio', question: groupText.slice(0, 500) });
        continue;
      }
      chosen.click();
      filled.push({ qa: chosen.getAttribute('data-qa') || '', type: 'radio', question: groupText.slice(0, 240), answer: chosen.value || norm(chosen.closest('label')?.innerText || '').slice(0, 120) });
    }

    for (const element of [...document.querySelectorAll('input[type="checkbox"]')]) {
      if (!isVisible(element)) continue;
      const labelText = (element.value || element.closest('label')?.innerText || element.parentElement?.innerText || '').toLowerCase();
      const questionText = contextText(element);
      const safePositive = isSafePositive([labelText, questionText].join(' '));
      if (!element.checked && safePositive) {
        element.click();
        filled.push({ qa: element.getAttribute('data-qa') || '', type: 'checkbox', question: questionText.slice(0, 240), answer: 'checked' });
      } else if (!element.checked && /обяз|required|\\*/i.test(questionText)) {
        blockers.push({ qa: element.getAttribute('data-qa') || '', type: 'checkbox', question: questionText.slice(0, 500) });
      }
    }

    return { filled, blockers };
  })()`);
}

async function clickSubmit(page) {
  return page.eval(`(() => {
    const button = document.querySelector('[data-qa="vacancy-response-submit-popup"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
}

function detectLanguage(vacancy, rules) {
  const text = `${vacancy.title} ${vacancy.description}`.toLowerCase();
  const ruHits = rules.language.ru_markers.filter((marker) => text.includes(marker)).length;
  const enHits = rules.language.en_markers.filter((marker) => text.includes(marker)).length;
  return ruHits >= enHits ? 'ru' : 'en';
}

function chooseAngle(vacancy, rules) {
  const text = `${vacancy.title} ${vacancy.skills?.join(' ') || ''} ${vacancy.description}`.toLowerCase();
  let best = { key: 'cto', score: 0 };
  for (const [key, keywords] of Object.entries(rules.angle_keywords)) {
    const score = keywords.reduce((sum, keyword) => sum + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > best.score) best = { key, score };
  }
  return best.key;
}

function chooseResume(angle, language, sales) {
  const data = sales.angles[angle] || sales.angles.cto;
  return language === 'en' ? data.resume_en : data.resume_ru;
}

function classifyVacancy(vacancy, rules) {
  const text = `${vacancy.title} ${vacancy.company} ${vacancy.skills?.join(' ') || ''} ${vacancy.description}`.toLowerCase();
  const skipHit = includesAny(text, rules.decisions.skip_if_any);
  if (skipHit) return { decision: 'skip', reason: `Skip keyword: ${skipHit}` };
  const applyHit = includesAny(text, rules.decisions.apply_if_any);
  const goodHit = includesAny(text, rules.decisions.good_signals);
  if (applyHit || goodHit) {
    return { decision: 'apply', reason: applyHit ? `Target role keyword: ${applyHit}` : `Good signal: ${goodHit}` };
  }
  const deferHit = includesAny(text, rules.decisions.defer_if_any);
  if (deferHit) return { decision: 'defer', reason: `Needs domain review: ${deferHit}` };
  return { decision: 'defer', reason: 'No strong target signal in deterministic rules' };
}

function cleanString(value) {
  let result = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= 0xD800 && code <= 0xDFFF) continue;
    result += value[i];
  }
  return result;
}

function deepClean(value) {
  if (typeof value === 'string') return cleanString(value);
  if (Array.isArray(value)) return value.map(deepClean);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, deepClean(item)]));
  }
  return value;
}

function logEvent(payload) {
  const cleaned = deepClean(payload);
  const child = spawnSync('python', ['workflows/hh_application_tracker.py', 'log', '--json', '-'], {
    cwd: ROOT,
    input: JSON.stringify(cleaned),
    encoding: 'utf8'
  });
  if (child.status !== 0) throw new Error(`tracker failed: ${child.stderr || child.stdout}`);
  return norm(child.stdout);
}

function buildCoverInput(vacancy, selectedResume, angle, language, sales) {
  const angleData = sales.angles[angle] || sales.angles.cto;
  return {
    vacancy: { ...vacancy, description: compact(vacancy.description) },
    selected_resume: selectedResume,
    language,
    sales_angle: angleData.label,
    evidence: [...sales.global_rules.default_strengths, ...angleData.evidence].slice(0, 10),
    current_core_stack: sales.global_rules.current_core_stack
  };
}

function stubCoverLetter(input) {
  if (input.language === 'en') {
    return `Hello!\n\nI am interested in the ${input.vacancy.title} role because it combines technical leadership, architecture, delivery, and practical business outcomes.\n\nMy background includes 18 years in IT across development, systems architecture, IT operations, and technical leadership. In recent projects I have built ERP/CRM systems, portals, integrations, reporting, automation workflows, and data-heavy internal tools.\n\nFor this role, I would be most useful where business goals, architecture, delivery process, and operational reliability need to be connected into one manageable system.\n\nI would be glad to discuss which constraint is most important for you right now: roadmap, architecture, delivery predictability, team/process structure, or operational reliability.`;
  }
  return `Здравствуйте!\n\nЗаинтересовала вакансия ${input.vacancy.title}: в ней вижу контур, где важны техническое лидерство, архитектура, delivery и практический результат для бизнеса.\n\nУ меня 18 лет в IT на стыке разработки, системной архитектуры, IT-операций и технического управления. В последних проектах я собирал ERP/CRM, порталы, интеграции, отчетность, автоматизации и data-heavy внутренние системы.\n\nДля такой роли я особенно полезен там, где нужно связать бизнес-цели, архитектуру, процесс поставки и эксплуатационную надежность в управляемую систему.\n\nБуду рад обсудить, какое ограничение сейчас для вас самое важное: roadmap, архитектура, предсказуемость delivery, структура команды/процессов или надежность эксплуатации.`;
}

async function generateCoverLetter(input, mode) {
  if (mode !== 'openai') return stubCoverLetter(input);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is required for --generate openai');
  const model = process.env.HH_COVER_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const prompt = fs.readFileSync(PROMPT_PATH, 'utf8');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      input: [
        { role: 'system', content: prompt },
        { role: 'user', content: JSON.stringify(input, null, 2) }
      ],
      text: { format: { type: 'json_object' } }
    })
  });
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  const raw = data.output_text || data.output?.flatMap((item) => item.content || []).map((part) => part.text || '').join('') || '';
  return norm(JSON.parse(raw).cover_letter);
}

async function processVacancy(page, vacancyUrl, args, rules, sales, stats) {
  await page.navigate(vacancyUrl);
  await sleep(1500);
  const vacancy = await extractVacancy(page);
  if (!vacancy.title || !vacancy.url.includes('/vacancy/')) {
    console.log(`[invalid-vacancy] ${vacancyUrl} -> ${vacancy.url}`);
    return;
  }

  const existingStatus = await getApplicationStatus(page);
  if (existingStatus) {
    logEvent({ decision: 'already_applied', decision_reason: 'HH page already shows application status', status: existingStatus, vacancy });
    stats.already_applied += 1;
    console.log(`[already] ${vacancy.title} / ${vacancy.company}`);
    return;
  }

  const classification = classifyVacancy(vacancy, rules);
  if (args.applyAll && classification.decision !== 'apply') {
    classification.decision = 'apply';
    classification.reason = `Apply-all override; original decision was ${classification.reason}`;
  }
  const language = detectLanguage(vacancy, rules);
  const angle = chooseAngle(vacancy, rules);
  const selectedResume = chooseResume(angle, language, sales);
  const coverInput = buildCoverInput(vacancy, selectedResume, angle, language, sales);

  if (classification.decision !== 'apply') {
    logEvent({ decision: classification.decision, decision_reason: classification.reason, selected_resume: selectedResume, vacancy });
    stats[classification.decision] += 1;
    console.log(`[${classification.decision}] ${vacancy.title} / ${vacancy.company} | ${classification.reason}`);
    return;
  }

  const coverLetter = await generateCoverLetter(coverInput, args.generate);
  if (args.mode !== 'live') {
    logEvent({
      decision: 'defer',
      decision_reason: `Dry-run apply candidate: ${classification.reason}`,
      selected_resume: selectedResume,
      cover_letter: coverLetter,
      vacancy
    });
    stats.defer += 1;
    console.log(`[dry-apply] ${vacancy.title} / ${vacancy.company} -> ${selectedResume}`);
    return;
  }

  const responseHref = await getVisibleResponseHref(page);
  if (!responseHref) {
    logEvent({ decision: 'failed', decision_reason: 'No visible HH response link found', selected_resume: selectedResume, cover_letter: coverLetter, vacancy });
    stats.failed += 1;
    console.log(`[failed] no response link: ${vacancy.title}`);
    return;
  }

  await page.navigate(responseHref);
  await sleep(2200);
  const resumeSelection = await selectResume(page, selectedResume);
  const actualSelectedResume = resumeSelection.final || selectedResume;
  if (!resumeSelection.ok) {
    console.log(`[worker] resume selector warning: expected "${selectedResume}", actual "${actualSelectedResume}", optionFound=${!!resumeSelection.clickedOption}, option="${resumeSelection.optionText || ''}"`);
    if (!args.allowResumeMismatch) {
      logEvent({
        decision: 'defer',
        decision_reason: `Resume mismatch: expected "${selectedResume}", actual "${actualSelectedResume}"`,
        selected_resume: actualSelectedResume,
        cover_letter: coverLetter,
        vacancy
      });
      stats.defer += 1;
      console.log(`[defer] ${vacancy.title} / ${vacancy.company} | resume mismatch`);
      return;
    }
  }
  await sleep(700);
  await fillCoverLetter(page, coverLetter);
  const questionResult = await fillEmployerQuestions(page, coverLetter, language);
  const filledQuestions = questionResult.filled || [];
  const questionBlockers = questionResult.blockers || [];
  if (filledQuestions.length) {
    console.log(`[worker] filled employer questions: ${filledQuestions.length}`);
  }
  if (questionBlockers.length) {
    logEvent({
      decision: 'defer',
      decision_reason: `Employer questions need specific answers: ${questionBlockers.length}`,
      selected_resume: actualSelectedResume,
      cover_letter: coverLetter,
      employer_questions: questionBlockers,
      vacancy
    });
    stats.defer += 1;
    console.log(`[defer] ${vacancy.title} / ${vacancy.company} | employer questions need specific answers: ${questionBlockers.length}`);
    return;
  }
  if (!args.submit) {
    logEvent({
      decision: 'defer',
      decision_reason: 'Live mode without --submit; form prepared but not sent',
      selected_resume: actualSelectedResume,
      cover_letter: coverLetter,
      employer_questions: filledQuestions,
      vacancy
    });
    stats.defer += 1;
    console.log(`[prepared] ${vacancy.title} / ${vacancy.company} -> ${selectedResume}`);
    return;
  }

  await clickSubmit(page);
  await sleep(3000);
  const status = await getApplicationStatus(page);
  logEvent({
    decision: status ? 'applied' : 'failed',
    decision_reason: status ? classification.reason : 'Submit clicked but status was not confirmed',
    selected_resume: actualSelectedResume,
    cover_letter: coverLetter,
    employer_questions: filledQuestions,
    status,
    vacancy
  });
  stats[status ? 'applied' : 'failed'] += 1;
  console.log(`[${status ? 'applied' : 'failed'}] ${vacancy.title} / ${vacancy.company} | ${status || 'no status'}`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) return help();
  if (!['dry-run', 'live'].includes(args.mode)) throw new Error('--mode must be dry-run or live');
  if (!['stub', 'openai'].includes(args.generate)) throw new Error('--generate must be stub or openai');

  spawnSync('python', ['workflows/hh_application_tracker.py', 'init'], { cwd: ROOT, stdio: 'inherit' });
  const rules = readJson(RULES_PATH);
  const sales = readJson(SALES_PATH);
  const wsUrl = await findCdpWs(args.cdp);
  console.log(`[worker] connecting to ${wsUrl}`);
  const page = new CdpPage(wsUrl);
  await page.connect();

  const stats = { applied: 0, already_applied: 0, skip: 0, defer: 0, failed: 0 };
  try {
    if (args.currentVacancy) {
      const currentUrl = await page.eval('location.href');
      await processVacancy(page, currentUrl, args, rules, sales, stats);
    } else {
      console.log(`[worker] opening ${args.startUrl}`);
      await page.navigate(args.startUrl);
      let links = await collectVacancyLinks(page, args.max);
      if (links.length) {
        for (const item of links) {
          await processVacancy(page, item.href, args, rules, sales, stats);
          if (Object.values(stats).reduce((a, b) => a + b, 0) >= args.max) break;
        }
      } else {
        const recommendationLinks = await collectRecommendationLinks(page, 10);
        if (!recommendationLinks.length) console.log('[worker] no visible recommendation links; using known resume-hash fallback');
        const queue = recommendationLinks.length ? recommendationLinks : await fallbackRecommendationLinks(10);
        for (const recommendation of queue) {
          const total = Object.values(stats).reduce((a, b) => a + b, 0);
          if (total >= args.max) break;
          console.log(`[worker] opening recommendations: ${recommendation.text}`);
          await page.navigate(recommendation.href);
          await sleep(2500);
          links = await waitForVacancyListLinks(page, args.max - total);
          for (const item of links) {
            await processVacancy(page, item.href, args, rules, sales, stats);
            if (Object.values(stats).reduce((a, b) => a + b, 0) >= args.max) break;
          }
        }
      }
    }
  } finally {
    await page.close();
  }

  console.log(JSON.stringify({ done: true, stats }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ done: false, error: error.message }, null, 2));
  process.exit(1);
});
