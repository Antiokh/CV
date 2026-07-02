// ==UserScript==
// @name         HH.ru Hide Rejections
// @namespace    https://needlebit.dev/
// @version      0.1.0
// @description  Hide HH.ru rejection noise in chats/lists, with a toggle to show it again. Optionally opens unread rejection threads to let HH mark them read.
// @match        https://hh.ru/*
// @match        https://*.hh.ru/*
// @match        https://chatik.hh.ru/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  const PANEL_ID = "hh-rejection-filter-panel";
  const STYLE_ID = "hh-rejection-filter-style";
  const HIDDEN_ATTR = "data-hh-rejection-filter-hidden";
  const REFUSAL_ATTR = "data-hh-rejection-filter-refusal";
  const STORAGE_SHOW = "hh-rejection-filter-show";
  const STORAGE_AUTOREAD = "hh-rejection-filter-autoread";
  const STORAGE_LAST_AUTOREAD = "hh-rejection-filter-last-autoread";

  const REFUSAL_PATTERNS = [
    /\bотказ(?:али|ано|а|)\b/i,
    /работодатель отказал/i,
    /отказ по отклику/i,
    /отклик отклон/i,
    /не готов[ыа]? (?:пригласить|рассмотреть|продолжить)/i,
    /не сможем (?:пригласить|продолжить|предложить)/i,
    /не можем (?:пригласить|рассмотреть|предложить)/i,
    /к сожалению[, ]+(?:мы )?(?:не|сейчас не)/i,
    /мы внимательно ознакомились/i,
    /вакансия (?:закрыта|уже закрыта)/i,
    /позиция (?:закрыта|уже закрыта)/i,
    /на данную вакансию выбран другой кандидат/i,
    /выбран другой кандидат/i,
    /не соответствует требованиям/i,
    /не подош[её]л/i,
    /unfortunately/i,
    /declin(?:ed|e)/i,
    /rejection/i,
    /rejected/i,
  ];

  const REFUSAL_STATUS_PATTERNS = [
    /^отказ$/i,
    /^отказано$/i,
    /^отклон[её]н$/i,
    /^не подош[её]л$/i,
    /^rejection$/i,
    /^rejected$/i,
    /^declined$/i,
  ];

  const INVITATION_PATTERNS = [
    /\bприглаш(?:ение|аем|ают|ены|ен|ена|у)\b/i,
    /работодатель пригласил/i,
    /пригласить вас/i,
    /готов[ыа]? пригласить/i,
    /собеседован/i,
    /интервью/i,
    /interview/i,
    /invitation/i,
    /invite/i,
  ];

  const NEGATIVE_INVITATION_PATTERNS = [
    /(?:не|ни) (?:можем|может|готов[ыа]?|сможем|не можем|не готовы?) (?:пригласить|рассмотреть|предложить)/i,
    /к сожалению[, ]+(?:мы )?(?:не|сейчас не) (?:можем|сможем|готовы?) (?:пригласить|рассмотреть|предложить)/i,
  ];

  if (location.hostname === "chatik.hh.ru") {
    startChatikFilter();
    return;
  }

  const CARD_SELECTORS = [
    "article",
    "li",
    "tr",
    "section",
    "[role='button']",
    "[role='listitem']",
    "[data-qa='vacancy-serp__vacancy']",
    "[data-qa='applicant-negotiation-item']",
    "[data-qa='negotiations-item']",
    "a[href*='negotiation']",
    "a[href*='chat']",
    "a[href*='vacancy']",
    "[data-qa*='negotiation']",
    "[data-qa*='chat']",
    "[data-qa*='conversation']",
    "[data-qa*='response']",
    "[data-qa*='vacancy']",
    "[class*='negotiation']",
    "[class*='chat']",
    "[class*='conversation']",
    "[class*='message']",
    "[class*='response']",
  ].join(",");

  const NEGOTIATION_DISCARD_SELECTOR = [
    "[data-qa~='negotiations-item-discard']",
    "[data-qa~='negotiations-item-rejection']",
    "[data-qa~='negotiations-item-refusal']",
    "[data-qa~='negotiations-item-decline']",
    "[data-qa~='negotiations-item-declined']",
    "[data-qa~='negotiations-item-discarded']",
  ].join(",");

  const READ_MARKERS = [
    /непрочитан/i,
    /unread/i,
    /новое/i,
  ];

  let showRefusals = localStorage.getItem(STORAGE_SHOW) === "1";
  let autoRead = localStorage.getItem(STORAGE_AUTOREAD) === "1";
  let scheduled = 0;
  let stats = { found: 0, hidden: 0, exact: 0, red: 0, readAttempts: 0 };

  const css = `
    [${HIDDEN_ATTR}="true"] {
      display: none !important;
    }

    #${PANEL_ID} {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      width: 286px;
      max-width: calc(100vw - 32px);
      background: #111820;
      color: #f3f6f9;
      border: 1px solid #334657;
      border-radius: 8px;
      box-shadow: 0 14px 36px rgba(0, 0, 0, .32);
      font: 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 10px;
    }

    #${PANEL_ID} * {
      box-sizing: border-box;
    }

    #${PANEL_ID} .hhrf-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-weight: 750;
      margin-bottom: 8px;
    }

    #${PANEL_ID} .hhrf-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      color: #dce8f2;
      cursor: pointer;
      user-select: none;
    }

    #${PANEL_ID} input {
      width: 16px;
      height: 16px;
      accent-color: #d6001c;
    }

    #${PANEL_ID} button {
      border: 1px solid #4a6177;
      background: #1a2a38;
      color: #eef6ff;
      border-radius: 6px;
      padding: 5px 8px;
      cursor: pointer;
      font-weight: 700;
    }

    #${PANEL_ID} button:hover {
      background: #243747;
    }

    #${PANEL_ID}.collapsed .hhrf-body {
      display: none;
    }

    #${PANEL_ID}.collapsed {
      width: auto;
    }

    #${PANEL_ID} .hhrf-status {
      min-height: 18px;
      color: #adc0d0;
      margin-top: 6px;
    }

    [${REFUSAL_ATTR}="true"] {
      outline: 1px dashed rgba(214, 0, 28, .45) !important;
      outline-offset: -1px !important;
    }
  `;

  function startChatikFilter() {
    const chatikHiddenAttr = "data-hh-chatik-rejection-hidden";
    const chatikCss = `
      [${chatikHiddenAttr}="true"] {
        display: none !important;
      }

      [data-qa*="rejection"],
      [data-qa*="discard"],
      [class*="rejection"],
      [class*="discard"] {
        --hh-rejection-filter-detected: 1;
      }
    `;

    function addChatikStyle() {
      if (document.getElementById(STYLE_ID)) return;
      if (typeof GM_addStyle === "function") {
        const style = GM_addStyle(chatikCss);
        if (style) style.id = STYLE_ID;
        return;
      }
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = chatikCss;
      document.head.appendChild(style);
    }

    function isChatikRedBadge(node) {
      if (!(node instanceof Element)) return false;
      const text = normalizeText(getDirectText(node) || node.textContent);
      if (text.length < 3 || text.length > 48) return false;
      if (/^\d+$/.test(text) || /^\d{1,2}:\d{2}$/.test(text)) return false;
      if (hasPattern(text, INVITATION_PATTERNS)) return false;
      if (hasPattern(text, REFUSAL_STATUS_PATTERNS)) return true;

      const rect = node.getBoundingClientRect();
      if (rect.width < 18 || rect.width > 260 || rect.height < 10 || rect.height > 56) return false;

      return isRedColor(window.getComputedStyle(node).color);
    }

    function findChatikRow(node) {
      let current = node.parentElement;
      const candidates = [];
      for (let depth = 0; current && depth < 10; depth += 1) {
        const rect = current.getBoundingClientRect();
        const text = normalizeText(current.textContent);
        if (
          !current.matches("html, body") &&
          rect.width >= 220 &&
          rect.height >= 44 &&
          rect.height <= 180 &&
          text.length >= 12 &&
          text.length <= 800
        ) {
          candidates.push(current);
        }
        current = current.parentElement;
      }

      return candidates
        .sort((a, b) => {
          const aScore = (a.matches("[role='button'], li, [role='listitem']") ? 10 : 0) - a.getBoundingClientRect().height / 100;
          const bScore = (b.matches("[role='button'], li, [role='listitem']") ? 10 : 0) - b.getBoundingClientRect().height / 100;
          return bScore - aScore;
        })[0] || null;
    }

    function scanChatik() {
      const rows = new Set();
      const nodes = document.querySelectorAll("span, div, p, [data-qa], [class]");
      for (const node of nodes) {
        if (!isChatikRedBadge(node)) continue;
        const row = findChatikRow(node);
        if (row) rows.add(row);
      }

      for (const row of document.querySelectorAll(`[${chatikHiddenAttr}]`)) {
        if (!rows.has(row)) row.removeAttribute(chatikHiddenAttr);
      }
      for (const row of rows) {
        row.setAttribute(chatikHiddenAttr, "true");
      }
    }

    function start() {
      if (!document.body) {
        window.setTimeout(start, 100);
        return;
      }
      addChatikStyle();
      scanChatik();
      const observer = new MutationObserver(() => window.setTimeout(scanChatik, 100));
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    start();
  }

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    if (typeof GM_addStyle === "function") {
      const style = GM_addStyle(css);
      if (style) style.id = STYLE_ID;
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function normalizeText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function hasPattern(text, patterns) {
    return patterns.some((pattern) => pattern.test(text));
  }

  function parseRgb(color) {
    const match = String(color || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return null;
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
    };
  }

  function isRedColor(color) {
    const rgb = parseRgb(color);
    if (!rgb) return false;
    return rgb.r >= 180 && rgb.g <= 105 && rgb.b <= 115 && rgb.r > rgb.g * 1.7 && rgb.r > rgb.b * 1.7;
  }

  function isBlueColor(color) {
    const rgb = parseRgb(color);
    if (!rgb) return false;
    return rgb.b >= 170 && rgb.r <= 90 && rgb.g >= 80 && rgb.g <= 180 && rgb.b > rgb.r * 2;
  }

  function getDirectText(node) {
    return Array.from(node.childNodes)
      .filter((child) => child.nodeType === Node.TEXT_NODE)
      .map((child) => child.nodeValue)
      .join(" ");
  }

  function isRefusalText(text) {
    const normalized = normalizeText(text);
    if (hasPattern(normalized, REFUSAL_STATUS_PATTERNS)) return true;
    if (normalized.length < 12) return false;
    if (!hasPattern(normalized, REFUSAL_PATTERNS)) return false;
    if (hasPattern(normalized, INVITATION_PATTERNS) && !hasPattern(normalized, NEGATIVE_INVITATION_PATTERNS)) return false;
    return true;
  }

  function isPanelNode(node) {
    return node instanceof Element && (node.id === PANEL_ID || Boolean(node.closest(`#${PANEL_ID}`)));
  }

  function isControlNode(node) {
    return node instanceof Element && Boolean(node.closest("button, [role='tab'], nav, header, form"));
  }

  function isPageControlNode(node) {
    return node instanceof Element && Boolean(node.closest("button, [role='tab'], nav, header, form"));
  }

  function isRedStatusBadge(node) {
    if (!(node instanceof Element) || isPanelNode(node) || isPageControlNode(node)) return false;
    if (node.children.length > 2) return false;

    const rect = node.getBoundingClientRect();
    if (rect.width < 18 || rect.width > 240 || rect.height < 10 || rect.height > 48) return false;

    const style = window.getComputedStyle(node);
    const redColor = isRedColor(style.color);
    const redBackground = isRedColor(style.backgroundColor);
    const redBorder = isRedColor(style.borderTopColor) || isRedColor(style.borderColor);
    if (!redColor && !redBackground && !redBorder) return false;

    const text = normalizeText(getDirectText(node) || node.textContent);
    if (text.length < 1 || text.length > 42) return false;
    if (/^\d+$/.test(text) || /^\d{1,2}:\d{2}$/.test(text)) return false;

    return true;
  }

  function isReasonableCard(node) {
    if (!(node instanceof Element) || isPanelNode(node)) return false;
    const rect = node.getBoundingClientRect();
    const text = normalizeText(node.textContent);
    if (text.length < 12 || text.length > 4500) return false;
    if (rect.width < 180 || rect.height < 48) return false;
    if (node.matches("html, body, main, #HH-React-Root")) return false;
    if (node.closest(`#${PANEL_ID}`)) return false;
    return true;
  }

  function cardScore(node) {
    let score = 0;
    const qa = node.getAttribute("data-qa") || "";
    const className = String(node.className || "");
    const rect = node.getBoundingClientRect();
    const text = normalizeText(node.textContent);

    if (node.matches("[data-qa='vacancy-serp__vacancy'], [data-qa='negotiations-item'], article, li, tr")) score += 8;
    if (node.matches("[role='button'], [role='listitem']")) score += 8;
    if (node.matches("[data-qa='negotiations-list'] [data-qa='negotiations-item']")) score += 16;
    if (node.closest("[data-qa='negotiations-list']")) score += 8;
    if (/vacancy|negotiation|response|chat/i.test(qa)) score += 5;
    if (/vacancy|negotiation|response|chat|card|item/i.test(className)) score += 3;
    if (node.querySelector("a[href*='vacancy'], a[href*='negotiation'], a[href*='chat']")) score += 4;
    if (rect.width >= Math.min(520, window.innerWidth * 0.55)) score += 3;
    if (rect.height >= 72) score += 2;
    if (text.length > 80) score += 2;
    if (text.length > 900) score -= 2;
    return score;
  }

  function findCardFromTextNode(node, allowClickableSource = false) {
    const source = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    if (!(source instanceof Element)) return null;
    if (!allowClickableSource && isControlNode(source)) return null;

    const candidates = [];
    const directNegotiation = source.closest("[data-qa='negotiations-item'], [data-qa*='negotiation'][role='button'], [data-qa*='negotiation']");
    if (directNegotiation && isReasonableCard(directNegotiation)) {
      candidates.push(directNegotiation);
    }

    let current = source;
    for (let depth = 0; current && depth < 12; depth += 1) {
      if (current.matches(CARD_SELECTORS) && isReasonableCard(current)) {
        candidates.push(current);
      }
      current = current.parentElement;
    }

    if (candidates.length) {
      return candidates.sort((a, b) => cardScore(b) - cardScore(a))[0];
    }

    current = source;
    for (let depth = 0; current && depth < 8; depth += 1) {
      if (isReasonableCard(current)) candidates.push(current);
      current = current.parentElement;
    }

    return candidates.sort((a, b) => cardScore(b) - cardScore(a))[0] || null;
  }

  function getTextNodes(root) {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.trim().length < 5) return NodeFilter.FILTER_REJECT;
        if (isPanelNode(node.parentElement)) return NodeFilter.FILTER_REJECT;
        if (
          isControlNode(node.parentElement) &&
          !node.parentElement.closest("[data-qa='negotiations-list'], [data-qa='negotiations-item'], [data-qa*='negotiation']")
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function getRedStatusNodes(root) {
    const nodes = [];
    const selector = [
      "span",
      "div",
      "p",
      "[class*='status']",
      "[class*='Status']",
      "[data-qa*='status']",
      "[data-qa*='state']",
    ].join(",");

    for (const node of root.querySelectorAll(selector)) {
      if (isRedStatusBadge(node)) nodes.push(node);
    }

    return nodes;
  }

  function getNegotiationDiscardCards() {
    const list = document.querySelector("[data-qa='negotiations-list']");
    if (!list) return [];

    const cards = [];
    for (const status of list.querySelectorAll(NEGOTIATION_DISCARD_SELECTOR)) {
      const card = status.closest("[data-qa='negotiations-item']") || status.closest("li");
      if (card && isReasonableCard(card)) cards.push(card);
    }

    for (const item of list.querySelectorAll("[data-qa='negotiations-item'], li, [role='button'], [role='listitem']")) {
      if (!isReasonableCard(item)) continue;
      if (isRefusalText(item.textContent)) cards.push(item);
    }

    return cards;
  }

  function markHidden(card, hidden) {
    if (hidden) {
      card.setAttribute(HIDDEN_ATTR, "true");
    } else {
      card.removeAttribute(HIDDEN_ATTR);
    }
  }

  function scan() {
    const cards = new Set();
    stats.exact = 0;
    stats.red = 0;

    for (const card of getNegotiationDiscardCards()) {
      cards.add(card);
      stats.exact += 1;
    }

    for (const textNode of getTextNodes(document.body)) {
      if (!isRefusalText(textNode.nodeValue)) continue;
      const card = findCardFromTextNode(textNode);
      if (card) cards.add(card);
    }

    for (const statusNode of getRedStatusNodes(document.body)) {
      const card = findCardFromTextNode(statusNode, true);
      if (card) {
        cards.add(card);
        stats.red += 1;
      }
    }

    stats.found = 0;
    stats.hidden = 0;

    document.querySelectorAll(`[${REFUSAL_ATTR}]`).forEach((node) => {
      if (!cards.has(node)) {
        node.removeAttribute(REFUSAL_ATTR);
        node.removeAttribute(HIDDEN_ATTR);
      }
    });

    for (const card of cards) {
      card.setAttribute(REFUSAL_ATTR, "true");
      markHidden(card, !showRefusals);
      stats.found += 1;
      if (!showRefusals) stats.hidden += 1;
    }

    updatePanel();
    maybeAutoRead(cards);
  }

  function scheduleScan(delay = 250) {
    window.clearTimeout(scheduled);
    scheduled = window.setTimeout(scan, delay);
  }

  function isNegotiationsPage() {
    return /\/applicant\/(?:negotiations|chat|negotiation)/i.test(location.pathname)
      || /\/negotiations/i.test(location.pathname)
      || /\/chat/i.test(location.pathname);
  }

  function looksUnread(card) {
    const label = normalizeText([
      card.textContent,
      card.getAttribute("aria-label"),
      card.className,
      Array.from(card.querySelectorAll("[aria-label], [title], [class], [data-qa]"))
        .slice(0, 20)
        .map((node) => [
          node.getAttribute("aria-label"),
          node.getAttribute("title"),
          node.getAttribute("class"),
          node.getAttribute("data-qa"),
        ].filter(Boolean).join(" ")).join(" "),
    ].join(" "));
    return READ_MARKERS.some((pattern) => pattern.test(label)) || hasUnreadCountBadge(card);
  }

  function hasUnreadCountBadge(card) {
    for (const node of card.querySelectorAll("span, div, [data-qa='badge']")) {
      const text = normalizeText(node.textContent);
      if (!/^\d{1,2}$/.test(text)) continue;

      const rect = node.getBoundingClientRect();
      if (rect.width < 14 || rect.width > 36 || rect.height < 14 || rect.height > 36) continue;

      const style = window.getComputedStyle(node);
      if (isBlueColor(style.backgroundColor) || isBlueColor(style.color)) return true;
    }

    return false;
  }

  function findOpenTarget(card) {
    if (card.matches("a[href]")) return card;
    return card.querySelector("a[href*='negotiation'], a[href*='chat'], [role='button'], a[href]");
  }

  function recentlyAutoRead(href) {
    const raw = sessionStorage.getItem(STORAGE_LAST_AUTOREAD);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      return data.href === href && Date.now() - data.time < 45000;
    } catch {
      return false;
    }
  }

  function rememberAutoRead(href) {
    sessionStorage.setItem(STORAGE_LAST_AUTOREAD, JSON.stringify({ href, time: Date.now() }));
  }

  function maybeAutoRead(cards) {
    if (!autoRead || showRefusals || !isNegotiationsPage()) return;

    for (const card of cards) {
      if (!looksUnread(card)) continue;
      const target = findOpenTarget(card);
      const href = target?.href || target?.getAttribute("data-hh-rejection-filter-click-id") || normalizeText(card.textContent).slice(0, 120);
      if (!target || !href || recentlyAutoRead(href)) continue;

      rememberAutoRead(href);
      stats.readAttempts += 1;
      updatePanel("Открываю непрочитанный отказ, чтобы HH пометил его прочитанным...");
      window.setTimeout(() => {
        if (target.href) {
          location.href = target.href;
        } else {
          target.click();
        }
      }, 350);
      return;
    }
  }

  function updatePanel(message = "") {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const showInput = panel.querySelector("[data-role='show-refusals']");
    const autoInput = panel.querySelector("[data-role='auto-read']");
    const status = panel.querySelector(".hhrf-status");
    if (showInput) showInput.checked = showRefusals;
    if (autoInput) autoInput.checked = autoRead;
    if (status) {
      status.textContent = message || `Отказов: ${stats.found}. Скрыто: ${stats.hidden}. Точно HH: ${stats.exact}. Красные: ${stats.red}. Прочитано: ${stats.readAttempts}.`;
    }
  }

  function buildPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="hhrf-title">
        <span>HH refusal filter</span>
        <button type="button" data-action="toggle">_</button>
      </div>
      <div class="hhrf-body">
        <label class="hhrf-toggle">
          <input type="checkbox" data-role="show-refusals">
          <span>Показывать отказы</span>
        </label>
        <label class="hhrf-toggle">
          <input type="checkbox" data-role="auto-read">
          <span>Автопрочитывать отказы</span>
        </label>
        <button type="button" data-action="scan">Пересканировать</button>
        <div class="hhrf-status"></div>
      </div>
    `;
    document.body.appendChild(panel);

    panel.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      if (button.dataset.action === "toggle") panel.classList.toggle("collapsed");
      if (button.dataset.action === "scan") scan();
    });

    panel.addEventListener("change", (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) return;
      if (input.dataset.role === "show-refusals") {
        showRefusals = input.checked;
        localStorage.setItem(STORAGE_SHOW, showRefusals ? "1" : "0");
      }
      if (input.dataset.role === "auto-read") {
        autoRead = input.checked;
        localStorage.setItem(STORAGE_AUTOREAD, autoRead ? "1" : "0");
      }
      scan();
    });
  }

  function observe() {
    const observer = new MutationObserver(() => scheduleScan());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    window.setInterval(() => {
      scheduleScan();
    }, 2500);

    let lastUrl = location.href;
    window.setInterval(() => {
      if (lastUrl === location.href) return;
      lastUrl = location.href;
      scheduleScan(500);
    }, 700);
  }

  function start() {
    if (!document.body) {
      window.setTimeout(start, 100);
      return;
    }
    addStyle();
    buildPanel();
    observe();
    window.setTimeout(scan, 500);
    window.setTimeout(scan, 1500);
    window.setTimeout(scan, 3500);
  }

  start();

  window.__hhRejectionFilterTest = {
    scan,
    isRefusalText,
    findCardFromTextNode,
    getNegotiationDiscardCards,
  };
})();
