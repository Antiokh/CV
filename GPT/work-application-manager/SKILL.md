---
name: work-application-manager
description: Manage Anton Nazarov's employment vacancy analysis, automatic tailored CV creation, humanized cover letters, Google Drive application folders, WorkInterviews tracker updates, LinkedIn connection imports, and referral suggestions. Use for candidate-side jobs, resumes, applications, recruiters, LinkedIn Connections.csv refreshes, interviews, rejections, offers, and other hiring-stage tasks. Do not use for freelance projects, client proposals, RFPs, Upwork delivery leads, or agency partnerships.
---

# Work Application Manager

Confirm that `MODE_ROUTER.md` selects CV mode. If the buyer is procuring a project, consulting engagement, or agency delivery rather than hiring Anton as a candidate, stop this workflow and use `freelance-agency-manager`.

Use Google Sheet `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`), tab `Jobs`, as the job-search lifecycle/index source of truth. Before writes, read its hidden tab `Agent Instructions`.

Use Drive root folder `WorkApplications` (`1wQMbnH4CODaARJSY221H06oCFJV2ukAK`). The canonical full vacancy body lives in Drive `Position.md`, not in the Sheet.

## Vacancy workflow

1. Upsert one `Jobs` row by Vacancy URL and normalized Company + Position; use a verified Apply URL as supporting identity evidence. After creation, use the immutable `Row ID` UUID as its durable identity.
2. Record all known vacancy fields, including salary fields, Referral, Recruiter, Apply URL, and Posted date. Leave unknown values blank.
3. Find or create `WorkApplications/<Company>/<PositionTitle>/` and create/update `Position.md` for every tracked vacancy when substantive vacancy text is available.
4. Verify `Position.md` through Drive readback, then write its Drive URL to the Sheet column `Vacancy file`.
5. Keep `Vacancy snapshot` as a concise identifying one-paragraph summary and `Notes` as concise fit/gap/process context. Do not duplicate the full vacancy body in either field.
6. Assign an evidence-based fit score from 0% to 100%.
7. If fit is strictly above 60%, immediately create the remaining application-pack artifacts unless the user explicitly declines.
8. If the vacancy does not explicitly request project work or clearly describe project-delivery responsibilities, omit a dedicated project section and lead with employment experience, responsibilities, and outcomes.

## Required Drive structure

Every tracked vacancy with recoverable substantive source text should have:

```text
WorkApplications/<Company>/<PositionTitle>/Position.md
```

A complete generated application pack contains exactly these four artifacts in the same folder:

```text
Position.md
Anton_Nazarov<PositionTitle>.md
Anton_Nazarov_<PositionTitle>.docx
Anton_Nazarov<PositionTitle>.txt
```

A vacancy that has been reviewed but does not yet require a CV may legitimately have only `Position.md`; do not fabricate the other three artifacts merely to fill the folder.

Replace `<Company>` and `<PositionTitle>` with recognizable sanitized names. In filenames, normalize spaces and unsafe punctuation inside `PositionTitle` to underscores while preserving the exact underscore pattern shown above.

Artifact roles:

- `Position.md`: canonical vacancy source: company, position, location, Vacancy URL, Apply URL when available, Posted date when available, Date found, application process/contact context, and full substantive vacancy text.
- `Anton_Nazarov<PositionTitle>.md`: tailored CV source in Markdown.
- `Anton_Nazarov_<PositionTitle>.docx`: final tailored Word CV generated from the Markdown source.
- `Anton_Nazarov<PositionTitle>.txt`: humanized cover letter as UTF-8 plain text only.

Keep the CV Markdown and DOCX synchronized. Prefer updating existing files over creating duplicates. Verify every file that is claimed to exist through Drive readback.

### Drive sharing rule

Every file created or materially updated under `WorkApplications` and intended to be referenced from the tracker or shared externally must be readable by anyone who has its link, without sign-in or an explicit per-user grant.

- After every upload or material update, set the file permission to `reader` for `anyone with the link`.
- This applies to `Position.md`, CV Markdown, DOCX, cover-letter TXT, and any other externally referenced application artifact. It does not require making folders searchable or discoverable.
- Verify the resulting permission through Drive metadata/readback before storing or presenting the URL as a shareable link.
- A Drive URL is not considered externally shareable merely because the authenticated account can open it.
- If the available Drive integration cannot create or verify `anyone with the link` read access, record this as a workflow blocker and do not claim that the link is publicly readable. Do not silently substitute company-domain sharing or a user-specific permission.

## Tracker storage and compact layout

Use the live visible `Jobs` headers A:V in this order:

`Company`, `Position`, `Fit %`, `Stage`, `Salary expectation`, `Estimated salary range`, `Referral`, `Recruiter`, `Apply URL`, `CV`, `Cover`, `Vacancy file`, `Archetype`, `Location`, `Vacancy URL`, `Posted date`, `Date found`, `Date applied`, `Last contact`, `Next action`, `Vacancy snapshot`, `Notes`.

Hidden column W is `Row ID`: an immutable UUID v4 assigned exactly once. Never change or reuse it. Never treat a row number, cached index, timestamp, Company, or Position as durable identity.

Storage rules:

- Inspect every visible `A:V` column during ingestion and analysis, and populate every evidence-backed applicable field. Before completion, audit `A:V` again. Leave a value blank only when genuinely unknown or inapplicable; record material research blockers and sources checked in `Notes`.
- Store `Fit %` as one native numeric percentage from 0% through 100%, displayed as a whole percent. Through the Sheets API write a fractional number (`0.68` displays as `68%`). Never store a range, approximation mark, percent sign as text, label, or prose. Evaluate the automatic-CV gate against displayed `>60%`, equivalent to numeric `>0.60`.
- For a historical numeric fit range, write its rounded whole-percent arithmetic midpoint and preserve the original wording in `Notes` (`65-70` becomes numeric `68%` / API value `0.68`). Preserve word-only assessments in `Notes` and leave `Fit %` blank unless numeric evidence exists.
- `Vacancy file` contains the verified Drive URL of that vacancy's `Position.md`. Never store the full vacancy body in the Sheet.
- `Vacancy snapshot` is for quick identification only: one compact paragraph, no copied job description, no multiline lists.
- `Notes` is for concise fit/gap/process/provenance context only: one compact paragraph where practical; do not paste correspondence or vacancy text.
- Preserve `CLIP` wrapping for `Vacancy snapshot`, `Notes`, and `Vacancy file`; these columns must not force row-height expansion.
- Keep tracker rows compact (normally one-line height, about 21-24 px). Do not auto-resize row height from long `Vacancy snapshot`, `Notes`, or link content. If a write/import changes these cells to `WRAP` or expands the row, restore `CLIP` and compact row height.
- Do not use the Sheet as document storage. Drive files hold long-form source and artifacts; the Sheet holds structured state, concise summaries, and links.

## Concurrency-safe tracker writes

Multiple chats may write concurrently. Protect every write:

1. Immediately before writing, repeat the vacancy lookup by Vacancy URL and normalized Company + Position, then read the current target row A:W including Row ID. Discard cached row numbers.
2. For a new vacancy, run the final duplicate check, generate a UUID v4, and use one `spreadsheets.batchUpdate` call that inserts one row at the freshly determined boundary, copies safe format/validation from an exemplar, and writes the complete new record including Row ID. Never write into a merely blank assumed row and never separate insertion from initial values.
3. For an existing vacancy, search/re-resolve the UUID's current row and update only intended cells. Never rewrite the complete row; preserve values another chat added.
4. Immediately read back A:W, verify the same UUID and every written value, and search once more by vacancy keys and UUID.
5. If the UUID moved, re-resolve it. If a value conflicts, another row appeared, or duplicates exist, do not overwrite, delete, or merge automatically. Preserve all data, stop, and report the conflict for reconciliation.

## Recruiter contacts

- Store known recruiter, sourcer, hiring-manager, and referral-contact names in `Recruiter`. Keep `Referral` as separate source/introduction context even when it names the same person.
- Use a native people chip only when a verified email uniquely identifies the person. Read it back and verify `chipRuns[].chip.personProperties.email`.
- When a verified LinkedIn profile exists without a verified email, store the person's exact name as clickable text linked to that URL. LinkedIn URLs are not accepted by the Sheets API as rich-link chips.
- When only the name is known, store plain text. Never synthesize an email, guess a profile, or represent an ambiguous identity as a chip.
- Use recruiter name plus company/domain for authorized Gmail searches and the verified URL for direct LinkedIn lookup.

## LinkedIn referral suggestions

- Treat the hidden `LinkedIn Connections` tab as an authorized private export snapshot with A:J fields: First Name, Last Name, LinkedIn URL, Email Address, Company, Position, Connected On, Company Key, Contact Type, Exported On.
- For every new vacancy and before recommending an application action, normalize the employer conservatively, search bounded Company Key column H, and read A:J only for returned rows. Check only evidence-backed parent/subsidiary/former-name/common-brand aliases and reject loose substring false positives.
- Suggest no more than three useful contacts, prioritizing current-company Recruiting/HR, a likely functional hiring manager or leader, then a role-relevant employee. A relevant function contact may outrank generic HR; connection recency is only a tie-breaker.
- Include exact export-listed name, company, position, LinkedIn URL, Connected On, snapshot date from Exported On, and one short ranking reason. Explicitly label results as snapshot-based candidates and never claim current employment without fresh evidence.
- Never populate `Referral`, change `Stage`, or claim contact/referral based only on the export. Write Referral only after Anton confirms planned/completed outreach or an introduction. Do not copy connection emails into Jobs, Notes, or chat unless Anton explicitly needs an address for outreach.
- On a newer full Connections.csv, do not parse or normalize it in model context. From the repository root, run `GPT/work-application-manager/scripts/import-linkedin-connections.ps1`, read only its small manifest for validation, and follow `GPT/work-application-manager/references/linkedin-connections-import.md`. Replace the snapshot as one dataset, retain A:J and hidden state, clear stale surplus rows, update Exported On, and verify source count, first/last rows, key coverage, and representative matches.

## Salary fields

- Populate `Salary expectation` only from Anton's explicit, current, confirmed expectation or a reliable previously confirmed record. Never infer it from the vacancy or market estimate.
- For every new vacancy and every material re-analysis, always research `Estimated salary range`. For Serbia, check Infostud first; if insufficient, continue with current Serbian listings and reputable internet sources. For all other locations, check Glassdoor first, then employer/job-posting disclosures and reputable internet salary sources.
- Match geography, seniority, work model, and contract type. State currency, amount or range, gross/net, and period in both fields; include employment type when material.
- Record salary source URL(s), research date, and material caveats concisely in `Notes`. If no defensible estimate is found, leave `Estimated salary range` blank but record the sources checked and why evidence was insufficient. Treat crowdsourced values as estimates and never copy `Salary expectation` into `Estimated salary range` or vice versa.

## Vacancy source and dates

Treat `Vacancy URL` as the page where the vacancy was found and `Apply URL` as the actual submission destination. Preserve both.

- During ingestion, extract company, position, location/work model, Vacancy URL, Apply URL, Posted date, Date found, full substantive text, application/selection process, and recruiter/contact/referral details before discarding job-board UI.
- Save the substantive vacancy text to `Position.md` before reducing it to the tracker snapshot/notes.
- For a LinkedIn `https://www.linkedin.com/safety/go/?url=...` link, parse the `url` query parameter, URL-decode it, validate that it is an absolute HTTP(S) URL, and store the direct external ATS/company URL. Never store the LinkedIn wrapper as canonical Apply URL.
- Preserve the external destination's query parameters. Do not infer an ATS or construct a careers URL from the company name.
- For LinkedIn Easy Apply / auto-apply without a distinct useful destination, set `Apply URL = Vacancy URL`.
- Store Posted date only from explicit evidence. Convert precise relative labels such as `3 days ago` only when the reference date is known; use `YYYY-MM-DD`.
- Do not create false precision for `30+ days ago`, `several weeks ago`, `1 year ago`, or similar coarse labels. Leave Posted date blank and preserve useful original wording in Notes.
- Date found is when Anton/ChatGPT first encountered or added the vacancy. Never substitute Posted date for Date found.

When migrating an old chat, prefer its historical pasted evidence. Use the historical chat date as the reference for precise relative dates. Do not browse the current vacancy to reconstruct historical Apply URL or Posted date unless the user explicitly requests it. If the old Sheet row contains a full vacancy body, move/preserve that body in `Position.md`, verify the file, replace the Sheet body with the verified `Position.md` URL in `Vacancy file`, and keep only concise snapshot/notes in the Sheet.

## Humanized cover letter

Write the cover letter in the vacancy language. Before finalizing it, load the matching cached Drive skill:

- Russian: `WorkApplications/_skills/humanizer-ru/SKILL.md` (Drive file ID `1294QxcBLTgwztnxTtUeXgwLmJJtHhSqB`), sourced from `Antiokh/humanizer--ru`.
- English: `WorkApplications/_skills/humanizer-en/SKILL.md` (Drive file ID `11DpPBxbv1BtL6vWagiIsLjDz57r8vfzS`), sourced from `blader/humanizer`.

Use the humanizer in embedded/file mode: run its audit and revision internally, then save only the final letter text. If the matching cached skill is unavailable, report the blocker instead of silently replacing it with an improvised humanizer.

Output only the letter text: no Markdown, heading, subject line, notes, JSON, contact block, or explanation.

Apply this humanizer pass:

1. Open with a direct role-specific reason for writing, not a generic enthusiasm formula.
2. Use two or three truthful proof points selected for the vacancy; connect them in prose instead of a list.
3. Include at least one concrete work situation, constraint, or outcome supported by source files.
4. Vary sentence length and structure. Remove repetitive openings, parallel three-part constructions, inflated adjectives, and abstract corporate filler.
5. Prefer plain verbs and natural recruiter-facing language. Keep ATS terms only where they fit naturally.
6. Do not invent metrics, authority, team size, industry exposure, motivation, or personal affinity with the company.
7. End with a simple next-step sentence. Avoid ceremonial or overly polished closing language.
8. Read the final text as spoken prose and revise anything that sounds templated, translated, or AI-generated.

Keep it concise and platform-appropriate. Do not include contact details unless explicitly requested.

## DOCX gate

Render the DOCX to page images and inspect every page at 100% zoom. Check:

- blank pages or excessive empty space after page or section breaks;
- consistent line and paragraph spacing;
- bullet wrapping, clipping, overlap, and irregular gaps;
- headings kept with following content;
- strict, balanced, professional page endings.

Fix defects, rerender, and inspect again. Never claim visual QA passed when rendering was unavailable.

## Tracker lifecycle

- Before CV creation: `Stage = Reviewed`.
- After all required application-pack files are uploaded, publicly shareable by link, and verified: write the DOCX URL to `CV`, the TXT URL to `Cover`, and set `Stage = CV ready` if no submission was reported.
- CV creation or upload is not proof of application.
- Set `Stage = Applied` only from the user's report or an explicit company/ATS receipt confirming that this application was submitted. Fill `Date applied` only when the actual submission date is directly evidenced.
- Continue updating the same row through recruiter screen, interview, technical interview, final, offer, rejection, withdrawal, ghosting, or closure.

Never invent fit, dates, stage, `Salary expectation`, contacts, submission, or file existence. Populate `Estimated salary range` only as a sourced market estimate. Do not call a complete application pack complete until DOCX visual QA, all required Drive upload/readbacks, public-link permission verification, and tracker readback succeed.

## Gmail status evidence

The user authorizes read-only Gmail checks for messages from a company, recruiter, or ATS that may change the status of an existing vacancy. Search narrowly using the known company, position, recruiter/domain, ATS sender, application URL, or application identifier. Read shortlisted messages and the surrounding thread when context affects classification.

- Match the message to an existing `Jobs` row with strong evidence. Do not create or update a row from a loose company-name match alone.
- Treat an ATS acknowledgement only as evidence of `Applied` when it explicitly confirms receipt/submission of this application. It is not recruiter movement.
- Set `Recruiter screen`, `Interview`, `Technical interview`, `Final`, `Offer`, or `Rejected` only when the message explicitly supports that stage.
- Do not infer progress from marketing mail, job alerts, generic talent-pool messages, automatic reminders, silence, or phrases such as “we will review your application.”
- Do not regress a later stage. If evidence is ambiguous or conflicts with the tracker, preserve the current stage and report the ambiguity.
- For a substantive matched message, update `Last contact` from the message date and set an evidence-based `Next action`. Fill `Date applied` only when the actual submission date is directly confirmed.
- Add only a concise provenance note such as sender, subject, and date. Do not copy unnecessary personal or sensitive email content into the Sheet.
- Gmail permission is read-only for this workflow. Do not send, reply, draft, label, archive, delete, or otherwise modify mail unless the user separately asks for that action.

Do not use Notion for this workflow unless the user explicitly re-enables it later.