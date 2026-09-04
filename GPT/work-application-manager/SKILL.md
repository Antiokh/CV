---
name: work-application-manager
description: Manage Anton Nazarov's employment vacancy analysis, tailored CV creation, humanized cover letters, Google Drive application folders, WorkInterviews tracker state, Activity Log history, LinkedIn referral suggestions, interviews, rejections and offers. Do not use for freelance/client/agency opportunities.
---

# Work Application Manager

Confirm CV mode through `MODE_ROUTER.md`. For candidate-side employment work use this skill; for buyer/vendor/client delivery use `freelance-agency-manager` instead.

## Mandatory operational references

For every substantive vacancy analysis, tailored CV, cover letter, recruiter/application answer, or motivation field, load:

1. `references/application-positioning-v1.md` — canonical pain-first content strategy: hiring problem -> strongest verified proof -> risk-filter coverage.

For every WorkInterviews / application-status / vacancy-ingestion workflow, also load the current modular contracts before acting:

2. `references/tracker-storage-v5.md` — canonical vacancy ownership, Queue-only agent write boundary, lifecycle routing and integrity rules.
3. `references/salary-normalization-v6.md` — canonical salary research, structured Salary Data, monthly normalization and completion gates.
4. `references/cv-markdown-v2.md` — canonical Markdown-first CV source, Queue-only generated presentation and on-demand derivative semantics.
5. `references/activity-log.md` — canonical append-only correspondence/process history.
6. `references/job-search-discovery.md` when finding new vacancies.
7. `MIGRATION.md` only for old-chat archival migration.

For a cover letter additionally load `references/cover-letter-evidence-first.md` plus the matching cached humanizer.

Before the first tracker/Drive write, also read the live hidden `Agent Instructions` tab in WorkInterviews. A newer explicit user instruction wins; update the live instructions when the user changes the operating contract.

Do not restate or override the modular storage/salary/artifact contracts from this skill. In particular: `Jobs` is not writable; agents do not route rows by API; F/AF are computed salary fields; tailored CV Markdown is canonical; agents write only its verified source URL into Queue `CV`; the bound UI helper renders `DOCX PDF`; DOCX/PDF are optional unless a concrete submission requires them.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).
Drive root: `WorkApplications` (`1wQMbnH4CODaARJSY221H06oCFJV2ukAK`).

## Vacancy workflow

1. Resolve/deduplicate through aggregate `Jobs` according to `tracker-storage-v5.md`.
2. Create a genuinely new vacancy only through the permitted Queue workflow.
3. Capture every evidence-backed field available from the source: company, position, location/work model, Vacancy URL, Apply URL, Posted date, Date found, recruiter/process information, substantive text and fit context.
4. Create/update `WorkApplications/<Company>/<PositionTitle>/Position.md` whenever substantive vacancy text is recoverable. The full vacancy body belongs there, not in the Sheet.
5. Verify Position.md by Drive readback and store its URL in `Vacancy file` on the writable Queue row.
6. Build the internal Pain Map from `application-positioning-v1.md` before substantive fit narration or application writing: identify 1-3 evidence-backed hiring pains, desired changed state, hard filters, and strongest verified proof cases.
7. Keep `Vacancy snapshot` compact and `Notes` concise. Notes may preserve material positioning risks/gaps, but do not dump the full Pain Map into the Sheet.
8. Assign one evidence-based numeric Fit %. Fit should reflect actual requirement/problem coverage, not generic seniority or confidence.
9. Research and normalize salary according to `salary-normalization-v6.md`; do not promote a Queue vacancy to Reviewed/CV ready while the salary gate is unresolved.
10. If displayed fit is strictly above 60%, create the tailored application pack unless Anton explicitly declines. Artifact semantics come from `cv-markdown-v2.md`: verify/share the Markdown source, then write that canonical source URL directly to Queue `CV`. Do not construct Markdown Drive export links or rich-text runs.
11. If the vacancy does not materially request project work, do not make Selected Projects / AI Projects the positioning center; lead with relevant employment evidence and business outcomes.

## Application positioning

All candidate-side application content follows `references/application-positioning-v1.md`.

The core sequence is:

1. read the vacancy as a compressed description of a business/operational/product/technical problem;
2. infer only pains supported by the vacancy/context, distinguishing explicit pain from a strongly implied hypothesis;
3. identify the changed state the employer wants;
4. treat requirements and nice-to-haves primarily as hiring-risk filters, not as the automatic prose structure;
5. select normally two or three strongest verified proof cases from canonical evidence;
6. present Anton as someone who recognizes and has solved the same or structurally similar problem;
7. run a requirement-coverage audit after the narrative is coherent.

For product and managerial roles, use `RESUME_FRACTIONAL_CTO.md` as the preferred starting business-evidence layer. Preserve strong proof around revenue, operating cost, throughput, continuity, dependency, adoption, risk and management control where relevant. Do not replace this with generic `strategic / technical / collaborative / experienced` self-description.

External company/market research should influence application copy only when it materially clarifies the hiring problem, context, or positioning. Do not turn normal covers/application answers into citation-heavy research notes, company praise, funding/growth commentary, or generic success language.

## Drive application structure

Every tracked vacancy with substantive source text should have:

`WorkApplications/<Company>/<PositionTitle>/Position.md`

A normal persistent generated pack is Markdown-first and contains:

- `Position.md` — canonical vacancy source;
- `Anton_Nazarov<PositionTitle>.md` — canonical tailored CV;
- `Anton_Nazarov<PositionTitle>.txt` — final humanized cover letter when required.

A `.docx` or `.pdf` is an optional derived export produced through `markdown-drive` only when Anton or the concrete application channel needs it. Do not independently author or maintain Word/PDF as a second canonical CV source. If Markdown and a derivative differ, Markdown wins and the derivative must be regenerated.

Normalize spaces/unsafe punctuation inside `PositionTitle` consistently. Verify every claimed persistent artifact by Drive readback.

### Sharing

Every WorkApplications artifact intended to be referenced from the tracker or shared externally must be readable by anyone with the link as reader, without sign-in or a user-specific grant. Verify permission before calling a URL shareable. If the integration cannot set/verify that permission, record a blocker instead of claiming success.

## Tracker data quality

Current writable surfaces, Stage ownership, helper columns and Queue integrity are defined by `tracker-storage-v5.md` and live Agent Instructions.

General rules:

- preserve immutable Row ID;
- freshly resolve Row ID immediately before every vacancy-row write;
- update only intended cells;
- preserve concurrent non-empty data;
- never recreate a vacancy because it moved lifecycle partition;
- Fit % is native numeric 0..1;
- Posted date / Date found are native Sheet dates when populated;
- Vacancy URL is source page; Apply URL is submission destination;
- decode LinkedIn `safety/go` external URLs rather than storing wrappers;
- Queue `CV` receives only the verified canonical Markdown source URL from agents;
- Active / Low fit / Closed `CV` is never agent-rewritten; lifecycle copy preserves the already-rendered Queue links;
- never invent dates, contacts, stages, submission, salary expectation or file existence;
- do not use the Sheet as long-form document storage.

## Salary research

`Salary expectation` is user-only and may be populated only from Anton's explicit current confirmed expectation.

All market-salary research, source hierarchy, evidence threshold, NET/GROSS semantics, monthly conversion, static FX, structured `Salary Data`, F-note provenance and completion readback are defined exclusively by `salary-normalization-v6.md`.

Key safety consequence: vacancy F (`Estimated salary (EUR/month)`) and AF (`Salary midpoint EUR/month`) are formulas. Never write literal values into them. Never use older free-text F / annual-EUR AF instructions.

## Recruiter contacts and LinkedIn referrals

Store verified recruiter/sourcer/hiring-manager names in `Recruiter`; keep `Referral` separate as introduction/outreach context.

Use a people chip only for a uniquely verified email. With a verified LinkedIn URL but no verified email, store the exact linked name; otherwise plain text. Never synthesize contact identity.

`LinkedIn Connections` is a private snapshot. For every genuinely new vacancy before recommending application action, conservatively match Company Key and evidence-backed aliases. Suggest at most three useful contacts: Recruiting/HR, likely functional leader/hiring manager, then role-relevant employee. Treat them as snapshot-based candidates, not confirmed current employees/referrals. Do not populate Referral or change Stage until Anton confirms outreach/introduction.

For a newer Connections.csv, follow `references/linkedin-connections-import.md`; never commit the private export.

## Tailored CV

Canonical tailored CV authoring/storage follows `cv-markdown-v2.md`.

Content strategy must also follow `application-positioning-v1.md` plus `CV_EVIDENCE_FIRST_RULES.md` and `RESUME_ADAPTATION_WORKFLOW.md` when relevant.

- Draft and fact-check Markdown directly.
- Build Profile, Role Fit, bullet selection, and experience depth around the vacancy Pain Map while preserving chronology.
- Role Fit should connect major hiring pains/risks to proof, not paraphrase the vacancy into competency bullets.
- Preserve the strongest relevant business-result evidence from the master CV; do not dilute it into adjectives about Anton.
- Verify the stored Markdown and required public sharing.
- Write only the verified source URL into Queue `CV`.
- Never URL-encode the source for tracker UI, construct Markdown Drive tracker links, or author multiple rich-text runs.
- The bound Queue presentation helper renders `DOCX PDF`; because API writes do not fire Apps Script, raw source may remain visible until the next sheet open/manual sync.
- Markdown QA is mandatory.
- DOCX/PDF are exported through `markdown-drive` only on demand / when the actual application needs them.
- If a derivative is exported for final use, render and visually inspect that derivative before delivery/submission.
- A later Markdown revision makes earlier derivatives stale.

## Humanized cover letter

Write in the vacancy language.

Before drafting, apply `application-positioning-v1.md`; before finalizing, apply `cover-letter-evidence-first.md` and load the matching cached humanizer:

- RU: `WorkApplications/_skills/humanizer-ru/SKILL.md`
- EN: `WorkApplications/_skills/humanizer-en/SKILL.md`

If the required cached skill is unavailable, report the blocker instead of silently substituting another humanizer.

Store only final letter text in TXT: no Markdown heading, subject, JSON or explanation unless explicitly requested.

The cover must be a compact hiring-problem -> verified-proof argument. Normally use 2-3 strong cases plus compact filter closure. Requirements are a QA checklist, not a mandatory bullet-by-bullet prose skeleton. Nice-to-have evidence leads only when it is the strongest proof of the employer's core problem.

Never invent motivation, authority, metrics, team size or domain exposure. Avoid generic candidate-centered filler and company-praise/research prose that does not strengthen solution fit.

## Application questions / motivation fields

For substantive prompts such as `Why this company?`, `What interests you?`, `Why are you a fit?`, or `Tell us about relevant experience`, apply the same pain-first compression:

**their problem -> matching verified proof -> why that makes the work relevant.**

Do not default to generic motivation, biography, or company praise merely because the wording asks `why`.

## Lifecycle evidence

Creating a CV/artifact is not application-submission evidence.

- Agent vacancy Stage writes are governed by `tracker-storage-v5.md` and stay within Queue persistent stages.
- `Applied` requires Anton's report or explicit company/ATS evidence that this specific application was submitted.
- `Assessment`, recruiter screen, interview, technical interview, final, offer and terminal states require direct evidence/user instruction.
- Agents never emulate human UI routing through API.
- Post-application process evidence can be durably preserved in Activity Log even when the protected vacancy row cannot be agent-mutated.

## Gmail status evidence

Gmail access for this workflow is read-only unless Anton separately requests a mail write.

For relevant messages:

1. resolve the vacancy using multi-signal matching from `activity-log.md`; same sender/subject/thread is not required;
2. append every strongly matched substantive message to Activity Log before deciding Stage implications, using stable `gmail:<message-id>` Source key;
3. preserve evidence-backed From/To/Cc and concise summary/match basis;
4. treat an explicit receipt as submission evidence only when it confirms this application;
5. classify Assessment / Recruiter screen / Interview / Technical interview / Final / Offer / Rejected only when explicit;
6. generic review text, alerts, marketing, reminders, talent-pool mail and silence do not advance Stage;
7. if the vacancy is outside Queue, do not mutate Active/Low fit/Closed/Jobs to reflect mail; Activity Log is the durable history and UI routing owns physical Stage transitions.

Do not copy unnecessary sensitive email body text into the tracker. Do not send, reply, draft, label, archive or delete mail unless separately requested.

## Completion

Do not call a vacancy/application pack complete until all applicable current gates pass:

- pain-first positioning / requirement-coverage QA for substantive application artifacts;
- canonical Markdown artifacts/readbacks and required share permissions;
- Queue `CV` contains the verified source URL or its derived `DOCX PDF` presentation;
- salary-normalization-v6 completion state;
- tracker readback / Queue Z where applicable;
- cover-letter humanizer/readback where required;
- DOCX/PDF export + visual QA only when that concrete derivative is actually required or requested.

Do not use Notion unless Anton explicitly re-enables it.
