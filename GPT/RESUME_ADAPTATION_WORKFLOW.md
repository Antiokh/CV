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

3. Select evidence, not biography
- choose the strongest 3-7 proof points;
- move relevant roles and bullets up in emphasis;
- keep true but distracting material lower or shorter;
- do not invent metrics, team size, authority, industries, or titles.

4. Draft in the target language
- mirror vacancy vocabulary where truthful;
- keep stack keywords visible for ATS;
- use direct wording and practical proof;
- avoid corporate filler, motivational fluff, and perfect symmetrical lists.

5. Humanize before detector checks
- rewrite summary as a lived career trajectory, not a balanced executive paragraph;
- make competency sections sound like "what I actually take on";
- tie technology stacks to project situations rather than pure taxonomies;
- vary bullet length and sentence shape;
- include concrete friction: old systems, Excel/email/chat workarounds, broken access rules, migration pain, adoption issues, debugging loops;
- keep one or two slightly plain, workmanlike sentences if they are true.

6. Run detector checks when available
- split the resume by sections;
- record detector, URL, date, block name, score, label, and rate-limit failures;
- treat scores as screening signals only, not truth;
- preserve old versions and raw detector results.

7. Tune high-risk blocks without losing facts
- if Summary/Profile scores high, add first-person context, career sequence, and real project conditions;
- if Core Skills/Competencies score high, replace abstract list items with "what I usually do" phrasing;
- if Technical Stack scores high, keep ATS keywords but embed them in project-context paragraphs;
- if Languages or Education score high on a short list, treat it as likely detector artifact and optionally rewrite as one natural sentence;
- do not remove important ATS keywords only to satisfy a detector.

8. Preserve versions
- never delete the previous version;
- create dated versions for major rewrites;
- keep raw detector JSON and a readable report;
- note which scores are confirmed and which were blocked by 403/429/rate limits.

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

Do not claim a detector was run if it was not.
Do not claim a block is safe if the endpoint returned 403/429.
Do not remove facts from the source profile to make a detector happy.
