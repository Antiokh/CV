---
name: work-application-manager
description: Manage Anton Nazarov's employment vacancy analysis, tailored CV creation, humanized cover letters, Google Drive application folders, WorkInterviews tracker state, Activity Log history, LinkedIn referral suggestions, interviews, rejections and offers. Do not use for freelance/client/agency opportunities.
---

# Work Application Manager

Confirm CV mode through `MODE_ROUTER.md`. For candidate-side employment work use this skill; for buyer/vendor/client delivery use `freelance-agency-manager` instead.

## Mandatory operational references

For every WorkInterviews / application-status / vacancy-ingestion workflow, load these current references before acting:

1. `references/tracker-storage-v5.md` — **single canonical vacancy storage, agent-write, salary and UI-routing contract**.
2. `references/activity-log.md` — canonical append-only correspondence/process history.
3. `references/job-search-discovery.md` when finding new vacancies.
4. `MIGRATION.md` only for old-chat archival migration.

Before the first tracker/Drive write, also read the live hidden `Agent Instructions` tab in WorkInterviews. A newer explicit user instruction wins; update the live instructions when the user changes the operating contract.

Do not restate or override the tracker-storage contract from this file. In particular, do not treat `Jobs` as writable, do not route vacancy rows by API, and do not write literal salary values into computed F/AF fields.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).
Drive root: `WorkApplications` (`1wQMbnH4CODaARJSY221H06oCFJV2ukAK`).

## Vacancy workflow

1. Resolve/deduplicate the vacancy through aggregate `Jobs` according to `tracker-storage-v5.md`.
2. For a genuinely new vacancy, create the canonical vacancy row only through the permitted Queue workflow.
3. Capture every evidence-backed field available from the vacancy source: company, position, location/work model, Vacancy URL, Apply URL, Posted date, Date found, recruiter/process information, substantive text and fit context.
4. Create/update `WorkApplications/<Company>/<PositionTitle>/Position.md` whenever substantive vacancy text is recoverable. The full vacancy body belongs there, not in the Sheet.
5. Verify Position.md by Drive readback and store its URL in `Vacancy file` on the writable Queue row.
6. Keep `Vacancy snapshot` to a compact identifying paragraph and `Notes` to concise fit/gap/process context.
7. Assign one evidence-based numeric Fit % from 0 to 100.
8. If displayed fit is strictly above 60%, create the tailored application pack unless Anton explicitly declines. Completion is still governed by Queue Z and the current storage contract.
9. If the vacancy does not explicitly request project work or project-delivery responsibilities, do not make a Selected Projects / AI Projects section the positioning center; lead with relevant employment evidence.

## Drive application structure

Every tracked vacancy with substantive source text should have:

`WorkApplications/<Company>/<PositionTitle>/Position.md`

A generated application pack contains exactly these four canonical artifacts in the same folder:

- `Position.md`
- `Anton_Nazarov<PositionTitle>.md` — tailored CV source
- `Anton_Nazarov_<PositionTitle>.docx` — final Word CV
- `Anton_Nazarov<PositionTitle>.txt` — final humanized cover letter

Normalize spaces/unsafe punctuation inside the filename placeholder `PositionTitle` to underscores while preserving the underscore pattern above.

Keep CV Markdown and DOCX synchronized. Prefer updating existing artifacts to creating ambiguous duplicates. Verify every claimed file by Drive readback.

### Sharing

Every WorkApplications artifact intended to be referenced from the tracker or shared externally must be readable by anyone with the link, as reader, without sign-in or a user-specific grant. Verify permission before calling a URL shareable. If the available integration cannot set/verify that permission, record a blocker rather than claiming success.

## Tracker data quality

The current schema, helper columns, writable surfaces, structured salary store and Queue completeness gate are defined only in `tracker-storage-v5.md` and live `Agent Instructions`.

General data-quality rules:

- preserve immutable Row ID;
- use fresh Row ID resolution immediately before writes;
- update only intended cells;
- preserve non-empty concurrent data;
- never create a duplicate because an existing vacancy moved to another lifecycle partition;
- native Fit % is numeric 0..1;
- Posted date / Date found are native Sheet dates when populated;
- Vacancy URL is the source/presentation page; Apply URL is the actual submission destination;
- decode LinkedIn `safety/go` external URLs rather than storing the wrapper;
- do not invent dates, contacts, stages, submission, salary expectation or file existence;
- do not use the Sheet as long-form document storage.

## Salary research

`Salary expectation` is user-only: populate it only from Anton's explicit current confirmed expectation.

For new vacancies and material re-analysis, research an `Estimated salary` using the source order required by live Agent Instructions (Serbia: Infostud first; elsewhere: Glassdoor first, then employer disclosures/current reputable market evidence).

The **storage and normalization mechanics are exclusively defined by `tracker-storage-v5.md`**:

- structured canonical inputs live in hidden `Salary Data` keyed by Row ID;
- values are normalized to monthly source-currency min/max plus a static EUR FX rate;
- vacancy F (`Estimated salary (EUR/month)`) and AF (`Salary midpoint EUR/month`) are formulas and must never receive literal agent writes;
- salary provenance goes in the native note on F;
- Queue completion for high-fit rows requires Salary Data normalization status `OK`.

Do not copy older free-text F / annual-EUR AF rules from historical docs.

## Recruiter contacts and LinkedIn referrals

Store verified recruiter/sourcer/hiring-manager names in `Recruiter`; keep `Referral` as separate introduction/outreach context.

Use a people chip only for a uniquely verified email. With a verified LinkedIn URL but no verified email, store the exact linked name; otherwise plain text. Never synthesize email/profile identity.

`LinkedIn Connections` is a private snapshot. For every genuinely new vacancy and before recommending application action, conservatively match Company Key and evidence-backed aliases. Suggest at most three useful contacts: Recruiting/HR, likely functional leader/hiring manager, then role-relevant employee. Treat them as snapshot-based candidates, not confirmed current employees or referrals. Do not populate Referral or change Stage until Anton confirms outreach/introduction.

For a new Connections.csv, follow `references/linkedin-connections-import.md`; do not commit the private export.

## Humanized cover letter

Write the cover letter in the vacancy language. Before finalizing, load the matching cached skill:

- RU: `WorkApplications/_skills/humanizer-ru/SKILL.md`
- EN: `WorkApplications/_skills/humanizer-en/SKILL.md`

If the required cached skill is unavailable, report the blocker instead of silently substituting another humanizer.

Store only the final letter text in TXT: no Markdown heading, subject line, explanation, JSON or contact block unless explicitly requested.

Use direct role-specific prose, two or three truthful proof points, at least one concrete supported work situation/result, varied sentence shape and a simple closing. Do not invent motivation, authority, metrics, team size or domain exposure.

## DOCX gate

For every generated or materially revised Word CV:

1. render the DOCX to page images, directly or via PDF;
2. inspect every page at 100%;
3. check blank/excessive-space pages, breaks, line/paragraph spacing, bullet wrapping, clipping, overlap, headings and page endings;
4. fix defects and rerender;
5. never claim visual QA passed when rendering was unavailable.

## Lifecycle evidence

Creating a CV or uploading files is not evidence of application submission.

- Queue pre-application stages are controlled by the current storage contract.
- `Applied` requires Anton's report or explicit company/ATS evidence that this specific application was submitted.
- `Assessment`, recruiter screen, interview, technical interview, final, offer and terminal states require direct evidence/user instruction.
- Agents do not emulate human UI routing through API.
- A post-application process event can be fully preserved in Activity Log even when the protected vacancy row cannot be updated by an agent.

## Gmail status evidence

Gmail access for this workflow is read-only unless Anton separately requests a mail write.

For relevant messages:

1. resolve the vacancy using multi-signal matching from `activity-log.md`; do not require the same sender, subject or Gmail thread as the outbound application;
2. before deciding Stage implications, append every strongly matched substantive message to Activity Log using stable Source key `gmail:<message-id>`;
3. preserve actual From/To/Cc evidence and concise summary/match basis;
4. treat an explicit receipt as submission evidence only when it confirms this application;
5. classify Assessment / recruiter screen / Interview / Technical interview / Final / Offer / Rejected only when the message explicitly supports it;
6. generic review text, alerts, marketing, reminders, talent-pool mail and silence do not advance Stage;
7. if the vacancy row is outside Queue, do not mutate Active/Low fit/Closed/Jobs merely to reflect the email; Activity Log is the durable process history.

Do not copy unnecessary sensitive email body text into the tracker. Do not send, reply, draft, label, archive or delete mail unless separately requested.

## Completion

Do not call an application pack or Queue write complete until all applicable gates have passed: Drive readbacks, required share permissions, DOCX visual QA, tracker readback and Queue Z `OK` where required.

Do not use Notion for this workflow unless Anton explicitly re-enables it.
