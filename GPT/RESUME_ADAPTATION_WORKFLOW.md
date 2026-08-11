# Resume Adaptation Workflow

Use this workflow for master resumes, tailored resumes, HH/Greenhouse/ATS profiles, cover letters, and recruiter-facing summaries.

The goal is not to hide that AI helped with drafting. The goal is to preserve Anton's real voice, factual density, and uneven lived-in specificity while still matching ATS/recruiter language.

## Core Rule

Maximize fit signal without lying, flattening the story, or making the text sound like a polished generic AI resume.

Every adapted resume must keep three things in balance:

- factual truth from the profile and source files;
- ATS/recruiter keywords from the vacancy or platform;
- human texture: specific situations, imperfect but real phrasing, varied rhythm, and first-hand context.

## Standard Workflow

1. Identify the target
- platform: HH, Greenhouse, LinkedIn, Upwork, direct recruiter, email, PDF;
- language: Russian, English, or Serbian;
- role mode: managerial/executive, technical delivery, hybrid, freelance/client;
- hard constraints: length, one-profile limitation, required sections, keyword needs.

2. Extract role and ATS signal
- title, seniority, responsibilities, repeated words;
- required technologies, management practices, industries, delivery expectations;
- hidden hiring logic: rescue, implementation, ownership, team leadership, architecture, hands-on delivery, stakeholder work.

3. Score fit and apply the automatic-CV gate
- assign an explicit fit score from 0% to 100%;
- if fit is strictly above 60%, immediately generate a tailored CV for the position, even when the initial request was only to analyze the vacancy;
- do not wait for a separate request or confirmation unless essential personal data is missing;
- if fit is 60% or below, provide the analysis and risks without automatically generating a CV unless the user asks for one.

4. Select evidence, not biography
- choose the strongest 3-7 proof points;
- move relevant roles and bullets up in emphasis;
- keep true but distracting material lower or shorter;
- do not invent metrics, team size, authority, industries, or titles.
- when the vacancy does not explicitly request project work or clearly describe project-delivery responsibilities, do not make projects the main proof category and do not add a dedicated `Selected Projects` / `AI Projects` section;
- in that case, lead with relevant employment experience, responsibilities, and outcomes; use project facts only as concise supporting evidence inside the appropriate experience entry;
- emphasize a project section only when the vacancy itself makes project work materially relevant.

5. Draft in the target language
- mirror vacancy vocabulary where truthful;
- keep stack keywords visible for ATS;
- use direct wording and practical proof;
- avoid corporate filler, motivational fluff, and perfect symmetrical lists.

6. Humanize before detector checks
- rewrite summary as a lived career trajectory, not a balanced executive paragraph;
- make competency sections sound like "what I actually take on";
- tie technology stacks to project situations rather than pure taxonomies;
- vary bullet length and sentence shape;
- include concrete friction: old systems, Excel/email/chat workarounds, broken access rules, migration pain, adoption issues, debugging loops;
- keep one or two slightly plain, workmanlike sentences if they are true.

7. Run detector checks when available
- split the resume by sections;
- record detector, URL, date, block name, score, label, and rate-limit failures;
- treat scores as screening signals only, not truth;
- preserve old versions and raw detector results.

8. Tune high-risk blocks without losing facts
- if Summary/Profile scores high, add first-person context, career sequence, and real project conditions;
- if Core Skills/Competencies score high, replace abstract list items with "what I usually do" phrasing;
- if Technical Stack scores high, keep ATS keywords but embed them in project-context paragraphs;
- if Languages or Education score high on a short list, treat it as likely detector artifact and optionally rewrite as one natural sentence;
- do not remove important ATS keywords only to satisfy a detector.

9. Preserve versions
- never delete the previous version;
- create dated versions for major rewrites;
- keep raw detector JSON and a readable report;
- note which scores are confirmed and which were blocked by 403/429/rate limits.

## Job Application Tracking

For every vacancy, CV, cover letter, or hiring-stage task, use Google Sheet `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`), tab `Jobs`, as the source of truth.

- Before the first tracker or Drive write, read the hidden tab `Agent Instructions`; when a newer explicit user instruction changes the workflow, update that tab as well.
- Upsert one row per vacancy by `Vacancy URL` and normalized `Company + Position`; never create a new row for a later stage of the same vacancy.
- Use the live A:S schema: `Company`, `Referral`, `Position`, `Archetype`, `Location`, `Vacancy URL`, `Apply URL`, `Posted date`, `Date found`, `Date applied`, `Fit %`, `Stage`, `Last contact`, `Next action`, `CV`, `Cover Letter`, `Vacancy snapshot`, `Notes`, `Vacancy text`.
- On initial analysis, extract and write every known application metadata value before discarding job-board UI. Keep Vacancy URL as the source page and Apply URL as the actual submission destination.
- Decode the `url` parameter of LinkedIn `safety/go` links and store the validated direct HTTP(S) destination with its own query parameters. Do not store the wrapper, infer an ATS, invent a careers URL, or fill Apply URL for Easy Apply without a distinct destination.
- Keep Posted date and Date found independent. Convert precise relative publication labels only with a known reference date; leave coarse values blank and preserve useful original wording in Notes.
- For old-chat migration, prefer original pasted evidence and the historical chat date. Do not browse the current vacancy to reconstruct historical Apply URL or Posted date unless explicitly requested.
- If no CV exists yet, use `Stage = Reviewed`.
- Save enough information to survive deletion of the source page: identifying summary in `Vacancy snapshot`, fit/gap context in `Notes`, and full text in `Vacancy text` when available.
- Use `YYYY-MM-DD` in `Europe/Belgrade`. Preserve populated cells and leave unknown values blank.
- After the `.docx` passes visual QA, use the My Drive root folder `WorkApplications` (folder ID `1wQMbnH4CODaARJSY221H06oCFJV2ukAK`) and find or create `WorkApplications/<Company>/<PositionTitle>/`.
- Store exactly four artifacts in the position folder: `Position.md` for company, position, Vacancy URL, Apply URL when known, Posted date when known, Date found, application process/contact context, and full text; `Anton_Nazarov<PositionTitle>.md` for the CV source; `Anton_Nazarov_<PositionTitle>.docx` for the final Word CV; and `Anton_Nazarov<PositionTitle>.txt` for the plain-text cover letter.
- Before saving TXT, apply `WorkApplications/_skills/humanizer-ru/SKILL.md` for Russian or `WorkApplications/_skills/humanizer-en/SKILL.md` for English in embedded/file mode; store only final humanized text.
- Prefer updating existing artifacts for revisions, verify all four by Drive readback, write the DOCX URL to `CV`, write the TXT URL to `Cover Letter`, set `Stage = CV ready` if not submitted, and set the concrete `Next action`.
- Creating or uploading a CV does not mean the application was submitted.
- Set `Stage = Applied` only from the user's report or an explicit company/ATS receipt confirming this application was submitted. Fill `Date applied` only when the actual submission date is directly evidenced.
- Continue updating the same row through recruiter screen, interview, technical interview, final, offer, rejection, withdrawal, ghosting, or closure.
- Never invent application date, fit, stage, salary, contact, submission, or CV-file existence.
- Do not call the application pack complete until DOCX visual QA, all four Drive uploads/readbacks, and the Sheet readback succeed. If an integration is unavailable, report the blocker.
- The user authorizes read-only Gmail checks for company, recruiter, and ATS messages tied to an existing vacancy. Search narrowly, inspect the matched message/thread, and update the same Sheet row only from explicit evidence. An acknowledgement may confirm `Applied`, but generic review language is not recruiter movement. Never infer a later stage from alerts, marketing, reminders, talent-pool mail, or silence. Update `Last contact`, `Next action`, and a concise sender/subject/date provenance note; do not copy unnecessary sensitive content. Do not send, draft, label, archive, delete, or otherwise modify mail unless separately requested.
- Do not use Notion unless the user explicitly re-enables it later.

## Patterns That Worked

For Russian HH master resume, these changes reduced `aitextdetector.ai` scores:

- `Профессиональный профиль`: 75% Likely AI -> 25% Human Written
- `Ключевые компетенции`: 75% Likely AI -> 25% Human Written
- `Технический стек`: 85% AI Generated -> 25% Human Written
- `Языки`: 95% AI Generated -> 10% Human Written

The effective pattern was not "make it casual". It was:

- more specific career sequence;
- less symmetrical taxonomy;
- more first-hand project context;
- technology keywords tied to actual use;
- short factual blocks rewritten as practical sentences.

Example direction:

Bad / detector-risky:

- "Backend and data: PostgreSQL, Supabase, SQL, RLS, Edge Functions..."

Better:

- "In recent projects I usually worked with Supabase, PostgreSQL, SQL, RLS, Edge Functions and WeWeb as one chain: data model, roles, interface, webhook, document or notification, then support and fixes after real users touched it."

Bad / detector-risky:

- "Technical leadership, systems architecture, delivery ownership."

Better:

- "I usually take responsibility for turning a messy process into a working system: roles, statuses, routes, data, access rules, rollout, and the first uncomfortable weeks of user adoption."

## Detector Interpretation Rules

Do not panic over individual scores.

Common false-positive cases:

- very short factual lists, especially languages;
- dense technology sections;
- education and course lists;
- headings and contact blocks.

Higher risk usually comes from:

- polished executive summary style;
- abstract nouns such as delivery, governance, transformation, implementation, architecture;
- repeated bullet rhythm;
- symmetrical skill taxonomies;
- generic verbs: designed, built, managed, integrated, led, improved.

When tuning, fix the text quality first. Detector score is secondary.

## Output Requirements

For each serious resume adaptation, produce or update:

- final resume file;
- preserved dated version;
- detector raw results if checks were run;
- short detector report with scores by block;
- notes about rate limits or unavailable services;
- source/profile updates if new factual details appeared.

For every generated or materially revised Word CV, the `.docx` is not final until it passes this visual QA gate:

1. render the DOCX to page images, directly or through PDF;
2. inspect every page at 100% zoom;
3. check every manual page break, section break, and page transition for unintended blank pages or excessive empty space immediately after a break;
4. check line spacing and paragraph spacing across body text, headings, dates, and bullets for consistent rendering, with no accidental double spacing, stretched lines, cramped blocks, clipping, or irregular gaps;
5. check clean bullet wrapping, headings kept with following content, balanced page endings, and a restrained, strict, professional appearance;
6. fix any defect, re-render, and inspect all pages again;
7. deliver and call the DOCX final only after the latest render passes. If rendering is unavailable, state the blocker and do not claim visual QA passed.

Do not claim a detector was run if it was not.
Do not claim a block is safe if the endpoint returned 403/429.
Do not remove facts from the source profile to make a detector happy.
