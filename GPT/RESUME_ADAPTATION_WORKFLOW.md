# Resume Adaptation Workflow

Use this file for **resume writing, ATS alignment, human voice and document QA**. It is not an application-tracker specification.

All WorkInterviews storage, Stage, salary, Activity Log, Gmail-status and concurrency mechanics belong exclusively to `work-application-manager/SKILL.md`, `work-application-manager/references/tracker-storage-v5.md`, `work-application-manager/references/activity-log.md`, and live Agent Instructions.

## Core rule

Maximize truthful fit signal without flattening Anton's actual career story or turning the resume into generic corporate AI prose.

Balance:

- factual truth from canonical profile/experience/project evidence;
- ATS/recruiter language from the target vacancy;
- human texture: concrete situations, constraints, outcomes and varied rhythm.

For tailored CVs also load `CV_EVIDENCE_FIRST_RULES.md` when available.

## Workflow

1. Identify target role, seniority, language, platform and hard constraints.
2. Extract role signal: responsibilities, requirements, repeated vocabulary, leadership/hands-on balance, stakeholder intensity and domain context.
3. Identify the hiring problem behind the vacancy: rescue, implementation, architecture, ownership, adoption, delivery, team leadership, product direction, etc.
4. Compare with verified experience; separate strongest direct proof, transferable proof and real gaps.
5. Assign Fit % through the employment workflow. If fit is strictly above 60%, follow `work-application-manager/SKILL.md` for the automatic tailored-CV/application-pack behavior.
6. Select evidence by relevance, not biography completeness, while preserving chronology.
7. Draft in vacancy language and reuse employer vocabulary only where truthful.
8. Humanize before detector checks.
9. Run detector checks only when actually available and useful; preserve raw results and rate-limit failures.
10. Render/inspect final DOCX and fix visible layout defects before calling it final.

## Evidence hierarchy

Lead with directly relevant supported experience. Reinforce with analogous experience only after direct proof is visible.

Use supported metrics, scale and before/after outcomes aggressively when they exist. Never invent metrics, team size, authority, title, industry exposure or ownership.

Relevance changes:

- bullet selection;
- depth of each role;
- summary/Role Fit wording;
- which technologies are surfaced.

Relevance does **not** reorder career chronology.

## Chronology

Employment experience is a timeline, not a relevance ranking.

Preserve the canonical relative order of major roles from current evidence. The only known overlap exception is ZIL versus Directorate of Cultural Centers of Moscow; they may swap according to role emphasis because the periods overlap.

Do not omit an intermediate role when that would create a misleading multi-year gap; keep at least a compact employer/title/dates entry.

## Managerial / executive resumes

Do not frame Anton primarily as a developer with some management experience.

Lead with:

- technology/transformation ownership;
- implementation responsibility;
- architecture/system decisions;
- stakeholder and adoption work;
- process/governance improvement;
- team/vendor coordination;
- measurable outcomes.

Hard skills and stack are supporting evidence.

Avoid making no-code/freelance identity the headline unless directly relevant to the target role.

## Technical / specialist resumes

Expose shipped systems, architecture, integrations, stack, debugging, data/access rules, delivery constraints and technical ownership. Management should differentiate the candidate rather than hide the technical proof.

## Project emphasis

Do not automatically add a `Selected Projects` or `AI Projects` section.

If the vacancy does not explicitly ask for project work or materially describe project-delivery responsibilities, lead with employment experience and integrate project facts into the relevant role where possible.

Use a dedicated project section when the vacancy makes project execution itself a hiring signal.

## Human voice

Prefer lived, specific language over symmetrical competency taxonomies.

Useful patterns:

- describe the actual friction: legacy systems, manual Excel/email/chat processes, broken access rules, migration problems, adoption failures, debugging loops;
- tie tools to the problem they solved rather than listing categories;
- vary bullet and sentence length;
- keep some plain workmanlike wording when it is true;
- avoid repeating the same claim in Profile, Role Fit, Experience and Technical Scope.

Avoid:

- polished abstract noun chains (`delivery / governance / transformation / architecture`) without proof;
- identical bullet rhythm;
- generic verbs without situation/outcome;
- long technology catalogues detached from work;
- deleting useful ATS terms only to improve an AI-detector score.

## Detector checks

Detector scores are weak screening signals, not truth.

When detectors are run, record detector, URL, date, block, score/label and any 403/429/rate-limit failure. Never claim a detector ran when it did not.

Common false positives include short factual language lists, education, contact blocks and dense technology sections.

Tune high-risk blocks by adding real career sequence, concrete situations and varied structure while preserving facts and ATS keywords.

## Scanability / information architecture

Preferred compact header order:

1. Name
2. target role / clear positioning
3. location + phone + email + LinkedIn
4. languages on the next compact line

Telegram is secondary and is removed before phone/email/LinkedIn when space is tight.

Role Fit is a recruiter scan layer, normally about 5–6 distinct points, not a duplicate mini-CV.

Experience blocks may be unequal: highly relevant roles can carry substantially more proof than secondary timeline roles.

When shortening, preserve in order:

1. direct requirement evidence;
2. measurable result;
3. scale/scope;
4. transferable proof;
5. implementation detail.

## Word layout benchmark

Readability outranks an arbitrary page target.

Use the current user-edited Word CV references and live Agent Instructions for exact benchmark details when available. General target:

- restrained ATS-friendly layout;
- readable body around 10 pt, employer/role/date line around 11 pt, section headings around 12 pt, name around 17–18 pt;
- compact but not cramped spacing;
- no duplicated Languages block;
- no repeated technology catalogue after every employer.

Two pages are preferred when evidence remains complete; a third page is acceptable for senior/executive/architect roles when it carries relevant proof. Do not shrink readable text merely to force a page count.

## Mandatory DOCX visual QA

For every generated or materially revised DOCX:

1. render it to page images directly or through PDF;
2. inspect every page at 100% zoom;
3. inspect page/section breaks and transitions for blank pages or excessive empty areas;
4. verify consistent line and paragraph spacing in body, headings, dates and bullets;
5. verify clean wrapping, no clipping/overlap, headings kept with following content and deliberate page endings;
6. fix defects, rerender and inspect every page again;
7. call the DOCX final only after the latest render passes;
8. if rendering is unavailable, state the blocker and do not claim visual QA passed.

## Operational boundary

This workflow deliberately contains no writable-tab list, no column-level salary storage contract, no cross-tab routing procedure and no Gmail status mutation rules. Those change independently and must be loaded fresh from the employment workflow's canonical operational references.
