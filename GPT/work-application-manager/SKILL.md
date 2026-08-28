---
name: work-application-manager
description: Manage Anton Nazarov's employment vacancy analysis, tailored CV creation, humanized cover letters, Google Drive application folders, WorkInterviews tracker state, Activity Log history, LinkedIn referral suggestions, interviews, rejections and offers. Do not use for freelance/client/agency opportunities.
---

# Work Application Manager

Confirm CV mode through `MODE_ROUTER.md`. For candidate-side employment work use this skill; for buyer/vendor/client delivery use `freelance-agency-manager` instead.

## Mandatory operational references

For every WorkInterviews / application-status / vacancy-ingestion workflow, load the current modular contracts before acting:

1. `references/tracker-storage-v5.md` — canonical vacancy ownership, Queue-only agent write boundary, lifecycle routing and integrity rules.
2. `references/salary-normalization-v6.md` — canonical salary research, structured Salary Data, monthly normalization and completion gates.
3. `references/cv-markdown-v1.md` — canonical Markdown-first CV artifact/storage contract and on-demand DOCX semantics.
4. `references/activity-log.md` — canonical append-only correspondence/process history.
5. `references/job-search-discovery.md` when finding new vacancies.
6. `MIGRATION.md` only for old-chat archival migration.

Before the first tracker/Drive write, also read the live hidden `Agent Instructions` tab in WorkInterviews. A newer explicit user instruction wins; update the live instructions when the user changes the operating contract.

Do not restate or override these modular contracts from this skill. In particular: `Jobs` is not writable; agents do not route rows by API; F/AF are computed salary fields; tailored CV Markdown is canonical and DOCX is optional unless a concrete submission requires it.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).
Drive root: `WorkApplications` (`1wQMbnH4CODaARJSY221H06oCFJV2ukAK`).

## Vacancy workflow

1. Resolve/deduplicate through aggregate `Jobs` according to `tracker-storage-v5.md`.
2. Create a genuinely new vacancy only through the permitted Queue workflow.
3. Capture every evidence-backed field available from the source: company, position, location/work model, Vacancy URL, Apply URL, Posted date, Date found, recruiter/process information, substantive text and fit context.
4. Create/update `WorkApplications/<Company>/<PositionTitle>/Position.md` whenever substantive vacancy text is recoverable. The full vacancy body belongs there, not in the Sheet.
5. Verify Position.md by Drive readback and store its URL in `Vacancy file` on the writable Queue row.
6. Keep `Vacancy snapshot` compact and `Notes` concise.
7. Assign one evidence-based numeric Fit %.
8. Research and normalize salary according to `salary-normalization-v6.md`; do not promote a Queue vacancy to Reviewed/CV ready while the salary gate is unresolved.
9. If displayed fit is strictly above 60%, create the tailored application pack unless Anton explicitly declines. Artifact semantics come from `cv-markdown-v1.md`.
10. If the vacancy does not materially request project work, do not make Selected Projects / AI Projects the positioning center; lead with relevant employment evidence.

## Drive application structure

Every tracked vacancy with substantive source text should have:

`WorkApplications/<Company>/<PositionTitle>/Position.md`

A normal persistent generated pack is Markdown-first and contains:

- `Position.md` — canonical vacancy source;
- `Anton_Nazarov<PositionTitle>.md` — canonical tailored CV;
- `Anton_Nazarov<PositionTitle>.txt` — final humanized cover letter when required.

A `.docx` is an optional derived export, normally named `Anton_Nazarov_<PositionTitle>.docx`, produced through `markdown-drive` only when Anton or the concrete application channel needs Word. Do not independently author or maintain Word as a second canonical CV source. If Markdown and DOCX differ, Markdown wins and Word must be regenerated.

Normalize spaces/unsafe punctuation inside `PositionTitle` consistently. Verify every claimed persistent artifact by Drive readback.

Tracker `CV` points to the verified canonical Markdown Drive URL by default. A missing DOCX does not block `CV ready`.

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

Canonical tailored CV authoring/storage follows `cv-markdown-v1.md`.

- Draft and fact-check Markdown directly.
- Tracker `CV` points to Markdown.
- Markdown QA is mandatory.
- DOCX is exported through `markdown-drive` only on demand / when the actual application needs Word.
- If a DOCX is exported for final use, render and visually inspect that derivative before delivery/submission.
- A later Markdown revision makes earlier DOCX exports stale.

For resume content/ATS/human voice also apply `CV_EVIDENCE_FIRST_RULES.md` and `RESUME_ADAPTATION_WORKFLOW.md` when relevant.

## Humanized cover letter

Write in the vacancy language. Before finalizing load the matching cached skill:

- RU: `WorkApplications/_skills/humanizer-ru/SKILL.md`
- EN: `WorkApplications/_skills/humanizer-en/SKILL.md`

If the required cached skill is unavailable, report the blocker instead of silently substituting another humanizer.

Store only final letter text in TXT: no Markdown heading, subject, JSON or explanation unless explicitly requested. Use direct role-specific prose, supported proof and concrete situations; never invent motivation, authority, metrics, team size or domain exposure.

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

- canonical Markdown artifacts/readbacks and required share permissions;
- salary-normalization-v6 completion state;
- tracker readback / Queue Z where applicable;
- cover-letter humanizer/readback where required;
- DOCX export + visual QA only when a concrete Word derivative is actually required or requested.

Do not use Notion unless Anton explicitly re-enables it.
