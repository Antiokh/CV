---
name: work-application-manager
description: Manage Anton Nazarov's employment vacancy analysis, automatic tailored CV creation, humanized cover letters, Google Drive application folders, and WorkInterviews tracker updates. Use for candidate-side jobs, resumes, applications, recruiters, interviews, rejections, offers, and other hiring-stage tasks. Do not use for freelance projects, client proposals, RFPs, Upwork delivery leads, or agency partnerships.
---

# Work Application Manager

Confirm that `MODE_ROUTER.md` selects CV mode. If the buyer is procuring a project, consulting engagement, or agency delivery rather than hiring Anton as a candidate, stop this workflow and use `freelance-agency-manager`.

Use Google Sheet `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`), tab `Jobs`, as the job-search source of truth. Before writes, read its hidden tab `Agent Instructions`.

Use Drive root folder `WorkApplications` (`1wQMbnH4CODaARJSY221H06oCFJV2ukAK`).

## Vacancy workflow

1. Upsert one `Jobs` row by Vacancy URL and normalized Company + Position; use a verified Apply URL as supporting identity evidence.
2. Record all known vacancy fields, including Referral, Apply URL, and Posted date. Leave unknown values blank.
3. Preserve the source in `Vacancy snapshot`, `Notes`, and `Vacancy text` so the role remains identifiable if the page disappears.
4. Assign an evidence-based fit score from 0% to 100%.
5. If fit is strictly above 60%, immediately create the complete application pack unless the user explicitly declines.
6. If the vacancy does not explicitly request project work or clearly describe project-delivery responsibilities, omit a dedicated project section and lead with employment experience, responsibilities, and outcomes.

## Required Drive structure

For every generated application pack, find or create:

```text
WorkApplications/<Company>/<PositionTitle>/
```

Store exactly these four artifacts in that folder:

```text
Position.md
Anton_Nazarov<PositionTitle>.md
Anton_Nazarov_<PositionTitle>.docx
Anton_Nazarov<PositionTitle>.txt
```

Replace `<Company>` and `<PositionTitle>` with recognizable sanitized names. In filenames, normalize spaces and unsafe punctuation inside `PositionTitle` to underscores while preserving the exact underscore pattern shown above.

Artifact roles:

- `Position.md`: company, position, location, Vacancy URL, Apply URL when available, Posted date when available, Date found, application process/contact context, and full vacancy text.
- `Anton_Nazarov<PositionTitle>.md`: tailored CV source in Markdown.
- `Anton_Nazarov_<PositionTitle>.docx`: final tailored Word CV generated from the Markdown source.
- `Anton_Nazarov<PositionTitle>.txt`: humanized cover letter as UTF-8 plain text only.

Keep the CV Markdown and DOCX synchronized. Prefer updating existing files over creating duplicates. Verify the folder and all four files through Drive readback.

## Vacancy source and dates

Treat `Vacancy URL` as the page where the vacancy was found and `Apply URL` as the actual submission destination. Preserve both.

- During ingestion, extract company, position, location/work model, Vacancy URL, Apply URL, Posted date, Date found, full substantive text, application/selection process, and recruiter/contact/referral details before discarding job-board UI.
- For a LinkedIn `https://www.linkedin.com/safety/go/?url=...` link, parse the `url` query parameter, URL-decode it, validate that it is an absolute HTTP(S) URL, and store the direct external ATS/company URL. Never store the LinkedIn wrapper as canonical Apply URL.
- Preserve the external destination's query parameters. Do not infer an ATS or construct a careers URL from the company name.
- For LinkedIn Easy Apply without a distinct useful destination, keep Vacancy URL and leave Apply URL blank.
- Store Posted date only from explicit evidence. Convert precise relative labels such as `3 days ago` only when the reference date is known; use `YYYY-MM-DD`.
- Do not create false precision for `30+ days ago`, `several weeks ago`, `1 year ago`, or similar coarse labels. Leave Posted date blank and preserve useful original wording in Notes.
- Date found is when Anton/ChatGPT first encountered or added the vacancy. Never substitute Posted date for Date found.

When migrating an old chat, prefer its historical pasted evidence. Use the historical chat date as the reference for precise relative dates. Do not browse the current vacancy to reconstruct historical Apply URL or Posted date unless the user explicitly requests it.

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

Use the live `Jobs` headers A:S in this order: `Company`, `Referral`, `Position`, `Archetype`, `Location`, `Vacancy URL`, `Apply URL`, `Posted date`, `Date found`, `Date applied`, `Fit %`, `Stage`, `Last contact`, `Next action`, `CV`, `Cover Letter`, `Vacancy snapshot`, `Notes`, `Vacancy text`.

- Before CV creation: `Stage = Reviewed`.
- After all four files are uploaded and verified: write the DOCX URL to `CV`, the TXT URL to `Cover Letter`, and set `Stage = CV ready` if no submission was reported.
- CV creation or upload is not proof of application.
- Set `Stage = Applied` only from the user's report or an explicit company/ATS receipt confirming that this application was submitted. Fill `Date applied` only when the actual submission date is directly evidenced.
- Continue updating the same row through recruiter screen, interview, technical interview, final, offer, rejection, withdrawal, ghosting, or closure.

Never invent fit, dates, stage, salary, contacts, submission, or file existence. Do not call the pack complete until DOCX visual QA, all four Drive upload/readbacks, and tracker readback succeed.

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
