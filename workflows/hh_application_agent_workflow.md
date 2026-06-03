# HH Application Agent Workflow

This workflow is for agents that apply to vacancies on hh.ru for Anton Nazarov.

The goal is not bulk applications. The goal is careful matching: choose suitable vacancies, select the right HH resume, write a truthful cover letter, apply, and verify the result.

## Start Prompt

Use this prompt when starting a fresh HH application session:

```text
You are an HH application agent for Anton Nazarov.

Your job is to choose suitable hh.ru vacancies, select the right resume, write a truthful vacancy-specific cover letter, apply, and verify that the application was delivered.

Do not mass-apply. Do not optimize for volume. Apply only when the vacancy has a real match with Anton's experience and target strategy.

Primary target roles:
- CTO / Technical Director
- Head of Engineering / Engineering Manager
- Head of IT / IT Department Lead
- Technical Product Lead / Product Owner
- Product Delivery / Delivery Lead, especially B2B/B2G
- Digital Transformation Lead / IT Transformation Manager
- Systems Architect / Solutions Architect

Good vacancy signals:
- management of IT, engineering, delivery, product, or technical teams
- tech roadmap, technical vision, architecture ownership
- CRM/ERP, internal systems, portals, integrations, automation
- data-heavy systems, AI/data platforms, analytics, applied ML
- delivery predictability, engineering metrics, Agile/Scrum processes
- B2B/B2G customers, complex stakeholders, requirements alignment
- documentation, roles/accesses/reporting, operational process design
- reliability, SRE, monitoring, observability, platform stability
- bridge between business, product, engineering, and operations

Usually skip:
- narrow backend/frontend/devops roles without management or architecture scope
- junior/middle roles
- pure support/helpdesk/admin roles
- pure sales roles without IT/product ownership
- low salary roles that are far below Anton's strategy
- roles that require deep narrow domain expertise Anton does not have, unless the main hiring need is leadership/architecture/delivery and the domain gap can be handled honestly

Source-of-truth experience:
- 18 years in IT.
- IT leadership and technical management.
- KC ZIL: led the IT team; improved support, infrastructure, accesses, documentation, processes, and work with internal stakeholders.
- Directorate of Moscow Cultural Centers: worked with IT leaders across 100+ institutions; developed an industry information system with reporting, roles, accesses, support, and change implementation.
- NeedleBit: ERP/CRM, portals, integrations, automation, and data-heavy internal business systems.
- Strong zones: technical leadership, architecture, engineering processes, CRM/ERP, integrations, automation, applied data/AI, delivery, business communication, complex stakeholders, documentation, change management.

Rules:
- Match the cover letter language to the vacancy language.
- Use hard skills as supporting evidence in managerial roles, not as the headline.
- Do not invent metrics, technologies, outcomes, domains, or responsibilities.
- If the vacancy has a weak-match domain, do not mention weakness by default; only address it when it materially reduces hiring risk and can be framed as a truthful strength-focus tradeoff.
- If HH asks employer questions and the answer is not known, stop and ask the user.
- After submitting, verify the status on the vacancy page: "Вы откликнулись", "You applied", or "Резюме доставлено".
```

## Recommended Vacancy Discovery Flow

When starting a new HH session, prefer this route:

1. Open the authorized resumes page:
   - `https://hh.ru/applicant/resumes?hhtmFrom=vacancy&hhtmFromLabel=header`
2. Review the list of resumes and the number of suitable vacancies shown under each resume.
3. Use that count as a prioritization signal, not as the only decision rule.
4. Open a resume with a meaningful count and inspect the matching vacancies it surfaces.
5. For each candidate vacancy, extract the canonical vacancy fields and evaluate `apply / skip / uncertain`.
6. Apply only to vacancies that are a real fit for Anton's current target strategy.

Decision rules for the count:

- Higher count can indicate stronger current market fit, but it can also reflect broad matching, so always inspect the vacancy itself.
- A low count does not automatically mean `skip` if the vacancy is strategically strong.
- If several resumes are plausible, compare vacancy fit and expected cover-letter narrative before choosing.
- Do not mass-apply from the resume list without opening and reviewing the vacancy itself.

## Resume Choice Rule

When multiple resumes are plausible, choose the one that best matches the vacancy's dominant scope:

- multi-team engineering leadership -> `Head of Engineering / Engineering Manager`
- product + delivery + stakeholder coordination -> `Technical Product Lead / Product Owner`
- architecture / systems / integrations / modernization -> `Systems Architect / Solutions Architect`
- broader organizational transformation -> `Digital Transformation Lead / IT Transformation Lead`
- general senior technical leadership or founder-like ownership -> `Fractional CTO / Interim CTO`

Do not choose a resume only because it has a higher salary target or a broader title.
Choose the resume that makes the vacancy story feel most natural and credible.

## Required Context

Before making applications, read or keep available:

- [Application Agent Guide](./application_agent_guide.md)
- [Application Workflow](./application_workflow.md)
- [Job Targeting Guide](./job_targeting_guide.md)
- [Evidence Map Guide](./evidence_map_guide.md)
- [HH dark copy userscript](./sctipts/hh_dark_copy.user.js)

Use the userscript extractor fields as the canonical vacancy input:

- `title`
- `company`
- `url`
- `salary`
- `experience`
- `employment`
- `schedule`
- `workHours`
- `workplace`
- `location`
- `applicantLocation`
- `skills`
- `description`

## Orchestrator Loop

Do not start from the currently open vacancy as if it is the whole task. The current vacancy may already be applied. That is not a blocker.

The default HH workflow is:

1. Open the HH resume/profile list.
2. Inspect resume cards.
3. Find a resume whose card shows a non-zero count of suitable/recommended vacancies.
4. Open that resume's suitable/recommended vacancy list.
5. Process vacancies in that list one by one.
6. For each vacancy:
   - extract vacancy fields;
   - check whether it is already applied;
   - classify as `apply`, `skip`, or `uncertain`;
   - if `apply`, open the response form, select the correct resume, write cover letter, submit, verify status;
   - log the result to SQLite with `workflows/hh_application_tracker.py`;
   - if already applied or `skip`, continue to the next vacancy;
   - if `uncertain`, log it, then stop and ask the user.
7. When the list has no more apply-worthy vacancies, return to the resume list.
8. Continue with the next resume that has a non-zero suitable-vacancy count.
9. Stop only when all such resume queues are exhausted or a stop condition occurs.

When applying, keep a short log entry in `applications/_tracking/` or a company-specific folder with:

- date
- vacancy title
- company
- vacancy URL
- selected resume
- decision (`apply`, `skip`, `uncertain`)
- cover letter text
- status after submit
- notes about fit or risk

Important: if the page says `Вы откликнулись`, `You applied`, or `Резюме доставлено`, mark that vacancy as done and continue the orchestrator loop. Do not freeze and do not ask the user what to do unless the user explicitly asked to re-apply with another resume.

### Resume Queue Entry Points

Start from:

```text
https://hh.ru/applicant/resumes
```

or from the header menu item for resumes/profile if the URL changes.

HH markup changes, so inspect visible resume cards rather than relying on one permanent selector. For each card, look for:

- resume title;
- suitable/recommended vacancy count;
- link/button that opens the suitable vacancy list for that resume.

Known resume titles:

- `Fractional CTO / Interim CTO`
- `Fractional CTO / Interim CTO / Технический руководитель`
- `Digital Transformation Lead / IT Transformation Manager`
- `Руководитель цифровой трансформации / IT Transformation Lead`
- `Technical Product Lead / Product Owner`
- `Технический Product Lead / Product Owner`
- `Systems Architect / Solutions Architect`
- `Системный архитектор / Solution Architect`
- `Head of Engineering / Engineering Manager`
- `Руководитель разработки / Engineering Manager`

Skip resume cards with zero/no suitable vacancies. Open the list for cards with non-zero suitable vacancies.

## Vacancy Decision

For each candidate vacancy, classify it as one of:

- `apply` - strong or strategically useful match
- `skip` - poor match, too narrow, too junior, too low, or misleading
- `uncertain` - could work, but requires user review

Apply only to `apply` vacancies. For `uncertain`, prepare a short note and wait for the user.

Good `apply` examples:

- CTO for AI/data platform with roadmap, architecture, delivery, reliability, engineering culture
- CTO for product platform with ML, analytics, integrations, DevOps, QA, team leadership
- Product Delivery Manager for B2B/B2G product with customers, roadmap, backlog, processes, budget, documentation

Risky examples:

- Web3/payment gateway CTO if the vacancy requires deep crypto/payments expertise rather than general architecture and leadership
- AdTech/CPA role if it requires real traffic-arbitrage domain expertise
- Director of development with a salary far below target strategy

## Resume Selection

Prefer Russian resume for Russian vacancies and English resume for English vacancies.

Use these role mappings:

- CTO / Technical Director / Head of IT -> `Fractional CTO / Interim CTO / Технический руководитель`
- Head of Engineering / Engineering Manager / Director of Development -> `Руководитель разработки / Engineering Manager`
- Product Delivery / Product Lead / Product Owner / B2G delivery -> `Технический Product Lead / Product Owner`
- Digital Transformation / process automation / IT transformation -> `Руководитель цифровой трансформации / IT Transformation Lead`
- Systems Architect / Solution Architect -> `Системный архитектор / Solution Architect`

If salary matters and two resumes both fit, prefer the resume whose expected compensation is closer to the vacancy range.

## Cover Letter Pattern

Use 4-5 short paragraphs:

1. Greeting and specific reason the vacancy is interesting.
2. Relevant experience, using 2-4 grounded examples.
3. Direct match to the employer's current problem.
4. Honest handling of weak-match areas, if needed.
5. Closing question about the employer's current constraints or priorities.

Do not write generic enthusiasm. Do not list a stack for its own sake. Do not over-explain the whole biography.

### CTO / AI-Data Example Shape

```text
Здравствуйте!

Заинтересовала CTO-вакансия: в описании хорошо сходятся AI/data-платформа, архитектурное vision, управляемый delivery, надежность/SRE и развитие engineering-команды без хаотичного роста штата.

У меня 18 лет в IT, включая руководство IT-функцией, архитектуру внутренних систем и доведение сложных платформ до эксплуатации...

Сильнее всего я полезен там, где нужно связать бизнес-цели, архитектуру, процессы разработки и эксплуатационную надежность...

Буду рад обсудить, какие ограничения сейчас сильнее всего мешают платформе масштабироваться: архитектура, delivery-процессы, надежность или структура команды.
```

### Product Delivery / B2G Example Shape

```text
Здравствуйте!

Заинтересовала вакансия Product Delivery Manager: в ней есть контур, где важны связь заказчика, продукта, команды разработки, бюджета, документации и понятной дорожной карты.

У меня 18 лет в IT и сильный опыт на стыке управления, цифровых продуктов и сложных заказчиков...

Для вашей задачи особенно релевантны B2G-коммуникация, перевод потребностей заказчика в backlog/roadmap, приоритизация, контроль поставки, документация и управление командной работой...

Буду рад обсудить, какие сейчас самые сложные места в delivery: согласование с заказчиками, приоритизация бэклога, прогнозируемость сроков, отчетность или масштабирование процессов внутри команды.
```

## Playwright / Browser Procedure

Work in the already authorized browser. Do not open a fresh unauthenticated browser unless the user explicitly asks.

### 1. Connect To Existing Browser

If Chrome or Edge is running with remote debugging, use CDP:

```js
const { chromium } = require('playwright');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
let page = context.pages().find((p) => p.url().includes('hh.ru'));
```

If `page` is missing, inspect:

```text
GET http://127.0.0.1:9223/json/list
```

Choose a `type: "page"` target whose `url` contains `hh.ru`.

HH may navigate after submit. If Playwright/CDP reports that the target navigated, closed, or detached, reacquire:

```js
page = context.pages().find((p) => p.url().includes('hh.ru'));
```

### 2. Extract Vacancy Fields

Use the same selectors as `hh_dark_copy.user.js`:

```js
function norm(value) {
  return (value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

async function text(page, selector) {
  return norm(await page.locator(selector).first().textContent().catch(() => ''));
}

async function extractVacancy(page) {
  return {
    title: await text(page, '[data-qa="vacancy-title"]'),
    company: await text(page, '[data-qa="vacancy-company-name"]'),
    salary: await text(page, '[data-qa="vacancy-salary"]'),
    experience: await text(page, '[data-qa="vacancy-experience"]'),
    employment: await text(page, '[data-qa="common-employment-text"]'),
    schedule: await text(page, '[data-qa="work-schedule-by-days-text"]'),
    workHours: await text(page, '[data-qa="working-hours-text"]'),
    workplace: await text(page, '[data-qa="work-place-text"]'),
    skills: (await page.locator('[data-qa="skills-element"]').allTextContents()).map(norm).filter(Boolean),
    description: norm(await page.locator('[data-qa="vacancy-description"]').innerText().catch(() => '')),
    url: page.url(),
  };
}
```

If the page is not a vacancy page, first open a vacancy from recommendations or search results.

### 3. Check Existing Status

Before applying, check whether the application was already sent:

```js
async function getApplicationStatus(page) {
  const body = await page.locator('body').innerText().catch(() => '');

  if (/Вы\s*откликнулись/i.test(body)) return 'Вы откликнулись';
  if (/You applied/i.test(body)) return 'You applied';
  if (/Резюме\s*доставлено/i.test(body)) return 'Резюме доставлено';

  return '';
}
```

If status is non-empty, do not apply again unless the user explicitly asked to use another resume.

### 4. Open Response Form

HH often renders multiple response buttons with the same `data-qa`. Do not blindly click `.first()`.

For the main vacancy page, look for:

```text
[data-qa="vacancy-response-link-top"]
```

For recommendation/search cards, look for:

```text
[data-qa="vacancy-serp__vacancy_response"]
```

Prefer a visible element with a direct `href`:

```js
async function getVisibleResponseHref(page) {
  const selectors = [
    '[data-qa="vacancy-response-link-top"]',
    '[data-qa="vacancy-serp__vacancy_response"]',
  ];

  for (const selector of selectors) {
    const matches = await page.locator(selector).evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.textContent || '',
          href: element.href || '',
          visible: rect.width > 0 && rect.height > 0,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      })
    );

    const match = matches.find((item) =>
      item.visible &&
      item.href &&
      /Отклик|Respond|Apply/i.test(item.text)
    );

    if (match) return match.href;
  }

  return '';
}
```

Then open:

```js
const responseHref = await getVisibleResponseHref(page);
if (!responseHref) throw new Error('No visible HH response link found');

await page.goto(responseHref);
await page.waitForLoadState('domcontentloaded');
```

The form URL usually contains:

```text
/applicant/vacancy_response
```

### 5. Select Resume

On the response form:

- current resume title: `[data-qa="resume-title"]`
- current resume detail/salary: `[data-qa="resume-detail"]`
- resume options: `[data-qa^="magritte-select-option-"]`

Open the resume selector by clicking the closest HH cell:

```js
async function selectResume(page, expectedText) {
  const current = norm(await page.locator('[data-qa="resume-title"]').innerText().catch(() => ''));
  if (current.includes(expectedText)) return current;

  await page
    .locator('[data-qa="resume-title"]')
    .locator('xpath=ancestor::*[@data-qa="cell"][1]')
    .click();

  await page.waitForTimeout(500);

  await page
    .locator('[data-qa^="magritte-select-option-"]')
    .filter({ hasText: expectedText })
    .first()
    .click();

  await page.waitForTimeout(500);

  return norm(await page.locator('[data-qa="resume-title"]').innerText());
}
```

Known useful resume texts:

- `Fractional CTO / Interim CTO / Технический руководитель`
- `Руководитель разработки / Engineering Manager`
- `Технический Product Lead / Product Owner`
- `Руководитель цифровой трансформации / IT Transformation Lead`
- `Системный архитектор / Solution Architect`

### 6. Add Cover Letter

Open the cover letter field:

```js
await page.locator('[data-qa="vacancy-response-letter-toggle"]').click();
await page.waitForTimeout(500);
```

The textarea is usually:

```text
[data-qa="vacancy-response-popup-form-letter-input"]
```

First try normal Playwright fill:

```js
await page.locator('[data-qa="vacancy-response-popup-form-letter-input"]').fill(coverLetter);
```

If HH/React/Magritte does not register the value, use a native setter and dispatch `input` / `change`:

```js
async function fillTextareaReactSafe(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setter.call(element, nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}
```

### 7. Employer Questions

Some forms show a warning:

```text
To apply, you must answer a few questions from the employer
```

or the Russian equivalent.

Inspect visible fields:

```js
async function getVisibleFormFields(page) {
  return page.locator('textarea,input,select').evaluateAll((elements) =>
    elements
      .filter((element) => !['hidden', 'submit', 'button'].includes(element.type))
      .map((element) => ({
        tag: element.tagName,
        type: element.type || '',
        name: element.name || '',
        qa: element.getAttribute('data-qa') || '',
        placeholder: element.placeholder || '',
        value: element.value || '',
      }))
  );
}
```

If a question requires unknown user data, stop and ask the user. Do not invent answers.

### 8. Submit And Verify

Submit:

```js
await page.locator('[data-qa="vacancy-response-submit-popup"]').click();
await page.waitForTimeout(3000);
```

HH usually navigates back to the vacancy page. Reacquire the HH page if needed:

```js
page = context.pages().find((p) => p.url().includes('hh.ru')) || page;
```

Verify:

```js
const status = await getApplicationStatus(page);
if (!status) throw new Error('Application status was not confirmed after submit');
```

### 9. Minimal End-To-End Skeleton

```js
const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
let page = context.pages().find((p) => p.url().includes('hh.ru'));

const vacancy = await extractVacancy(page);
const existingStatus = await getApplicationStatus(page);
if (existingStatus) return { status: existingStatus, vacancy };

// Decide apply / skip / uncertain before continuing.

const responseHref = await getVisibleResponseHref(page);
await page.goto(responseHref);
await page.waitForLoadState('domcontentloaded');

await selectResume(page, 'Технический Product Lead / Product Owner');

await page.locator('[data-qa="vacancy-response-letter-toggle"]').click();
await fillTextareaReactSafe(
  page,
  '[data-qa="vacancy-response-popup-form-letter-input"]',
  coverLetter
);

const fields = await getVisibleFormFields(page);
// Stop if fields include unknown employer questions.

await page.locator('[data-qa="vacancy-response-submit-popup"]').click();
await page.waitForTimeout(3000);

page = context.pages().find((p) => p.url().includes('hh.ru')) || page;
const status = await getApplicationStatus(page);
return { status, vacancy };
```

## HH Technical Notes

HH is not a static form. Treat it as a dynamic React application:

- Multiple elements may share the same `data-qa`.
- Some matching buttons are hidden or have zero size.
- Search/recommendation cards have their own response selector.
- The response form lives on `/applicant/vacancy_response`.
- Resume selection is a Magritte select list, not a normal HTML `<select>`.
- The cover letter textarea may need native setter events.
- Submit often navigates back to the vacancy page.
- CDP/Playwright may need to reacquire the HH page after submit.

Do not blindly click the first selector match.

Safer options:

- use the response link `href` from a visible application button
- or choose an element with non-zero `getBoundingClientRect().width` and `height`
- or filter to visible buttons inside the current viewport

After submit, HH often navigates back to the vacancy page. CDP/Playwright may report that the target navigated or the inspected target closed. Reconnect to the current page and verify status.

Verification strings:

- `Вы откликнулись`
- `You applied`
- `Резюме доставлено`

## Stop Conditions

Stop and ask the user when:

- the vacancy is strategically interesting but domain fit is unclear
- HH asks a question requiring information not present in the repo
- salary or seniority is ambiguous and could hurt strategy
- the form selects a resume that cannot be changed and is clearly wrong
- the cover letter would require inventing facts to sound convincing

## Logging

Every evaluated HH vacancy should be logged to the private SQLite tracker, including skips and already-applied vacancies. This is required because salary statistics are needed to validate whether the current resume compensation expectations are too high for the Russian HH market.

Tracker:

```text
workflows/hh_application_tracker.py
applications/_tracking/hh_applications.sqlite
```

Initialize:

```powershell
python workflows/hh_application_tracker.py init
```

Log an event after each vacancy decision:

```powershell
@'
{
  "decision": "applied",
  "decision_reason": "Strong Product Delivery/B2G match",
  "selected_resume": "Технический Product Lead / Product Owner",
  "cover_letter": "Здравствуйте!...",
  "status": "Вы откликнулись",
  "source_resume_list_title": "Технический Product Lead / Product Owner",
  "source_suitable_count": 12,
  "vacancy": {
    "title": "Product Delivery Manager (B2G)",
    "company": "FIX",
    "salary": "",
    "experience": "более 6 лет",
    "employment": "Полная занятость",
    "schedule": "5/2",
    "workHours": "8",
    "workplace": "удаленно",
    "skills": ["Деловая коммуникация", "Управление бэклогом"],
    "description": "...",
    "url": "https://hh.ru/vacancy/133804143"
  }
}
'@ | python workflows/hh_application_tracker.py log --json -
```

Use these `decision` values:

- `applied` - application sent and verified;
- `already_applied` - vacancy was already applied before this pass;
- `skip` - reviewed and intentionally skipped;
- `uncertain` - stopped for user review;
- `failed` - attempted but blocked by technical issue.

Stats:

```powershell
python workflows/hh_application_tracker.py stats
```

For each application or evaluated vacancy, store:

- date
- vacancy title
- company
- vacancy URL
- salary raw text and parsed salary range
- selected resume
- selected resume expected compensation
- cover letter text
- status after submit
- notes about fit or risk
