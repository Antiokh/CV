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

Before selecting bullets, load and apply:

- `EXPECTATION_TAXONOMY.md` — expectation definitions, hard-filter parsing and management-scale semantics;
- `ANTON_EVIDENCE_MATRIX.md` — strongest supported proof blocks for each expectation;
- `ROLE_SIGNAL_PROFILES.md` — role-family defaults and closest existing CV shell.

## Workflow

1. Identify target role, seniority, language, platform and hard constraints.
2. Extract role signal: responsibilities, requirements, repeated vocabulary, leadership/hands-on balance, stakeholder intensity and domain context.
3. Identify the hiring problem behind the vacancy: rescue, implementation, architecture, ownership, adoption, delivery, team leadership, product direction, etc.
4. Build an internal **expectation map** using `EXPECTATION_TAXONOMY.md`. For every material expectation record:
   - vacancy evidence / wording;
   - `MUST / STRONG / OPTIONAL` priority;
   - whether it is a true hard filter;
   - expected visibility (`TOP / EXPERIENCE / TECHNICAL_SCOPE / OMIT`).
5. Parse management scale explicitly where relevant: direct span, total organizational scope, hierarchy depth, number of teams/functions and functional coordination without line authority. Never infer `direct reports` from total team/org size.
6. Map each expectation to `ANTON_EVIDENCE_MATRIX.md`, selecting the strongest exact proof and recording evidence strength 0–5 plus any caveat or gap.
7. Use `ROLE_SIGNAL_PROFILES.md` to choose the closest canonical shell and default evidence order. Treat the role profile as a prior only; the actual vacancy overrides it.
8. Separate three judgments internally:
   - **Fit** — does Anton actually have credible experience for the work/problem?
   - **CV evidence coverage** — does the draft visibly prove the vacancy's important expectations?
   - **cold-entry probability** — how likely first filters are to recognize that fit, from `role-entry-strategy-v1.md`.
9. Assign Fit % through the employment workflow. If fit is strictly above 60%, follow `work-application-manager/SKILL.md` for the automatic tailored-CV/application-pack behavior.
10. Select evidence by relevance and first-screen value, not biography completeness, while preserving chronology.
11. Draft in vacancy language and reuse employer vocabulary only where truthful.
12. Run a first-screen coverage pass before polishing: every `MUST` expectation must either be visibly proved with the strongest available evidence or remain an explicit internal gap.
13. Humanize before detector checks.
14. Run detector checks only when actually available and useful; preserve raw results and rate-limit failures.
15. Render/inspect final DOCX when that derivative is required and fix visible layout defects before calling it final.

## Evidence hierarchy

Lead with directly relevant supported experience. Reinforce with analogous experience only after direct proof is visible.

Use supported metrics, scale and before/after outcomes aggressively when they exist. Never invent metrics, team size, authority, title, industry exposure or ownership.

When two facts are both impressive, prefer the one that proves the **actual expectation being screened**.

Examples:

- a `~10x revenue` result is stronger business impact, but it does not replace explicit people-management proof when the vacancy screens for team leadership;
- `100+ IT specialists coordinated` proves influence/functional scale, not direct line management or manager-of-managers;
- `200–300 reports/day` may prove self-service adoption/throughput but must not be used as high-load evidence;
- endpoint/server/asset counts are useful for corporate-IT scope when asked, but usually weaker than economics, people, risk and operating outcomes for CTO/Product/EM roles.

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

Lead with the expectations that the concrete vacancy screens first. Depending on role these may include:

- people-management scope and org shape;
- technology/transformation ownership;
- technology economics / budget / resource allocation;
- architecture/system decisions;
- stakeholder and adoption work;
- process/governance improvement;
- team/vendor coordination;
- continuity / risk / reliability;
- measurable outcomes.

Hard skills and stack are supporting evidence unless the vacancy explicitly makes current hands-on depth a first-screen filter.

Avoid making no-code/freelance identity the headline unless directly relevant to the target role.

### Management-scale guardrail

Keep these separate in both analysis and CV wording:

- verified direct span: **5 IT staff + 2 installation engineers** at ZIL;
- functional coordination: **100+ IT specialists across 100+ institutions** without line authority;
- manager-of-managers: do not imply formal Engineering Manager / Team Lead hierarchy unless separately evidenced.

A 20–70+ organization in a vacancy is normally total scope unless the vacancy explicitly says direct reports. Conversely, explicit `manage Engineering Managers / Team Leads` is a real hierarchy filter and cannot be closed by the 100+ coordination figure.

## Technical / specialist resumes

Expose shipped systems, architecture, integrations, stack, debugging, data/access rules, delivery constraints and technical ownership. Management should differentiate the candidate rather than hide the technical proof.

For current-stack or high-scale technical filters, map the exact requirement rather than using broad seniority as a substitute.

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

Role Fit must be generated from the **highest-priority expectation rows**, not from a generic role competency list.

Experience blocks may be unequal: highly relevant roles can carry substantially more proof than secondary timeline roles.

When shortening, preserve in order:

1. explicit hard-filter evidence;
2. direct requirement / MUST-expectation evidence;
3. measurable result;
4. scale/scope appropriate to the expectation;
5. transferable proof;
6. implementation detail.

## CV evidence coverage

After drafting, calculate an internal qualitative coverage state:

- **Covered** — every MUST expectation has visible evidence and no material first-screen signal is hidden;
- **Covered with gaps** — all supported MUST expectations are visible but one or more genuine vacancy gaps remain;
- **Under-covered** — Anton has relevant proof but the current CV fails to surface it;
- **Mismatch** — several MUST expectations lack credible evidence.

Do not lower Fit merely because a draft is under-covered. Fix the document first.

A classic under-coverage failure is: real people-management evidence exists, but the first third of the CV shows only architecture and technical tasks, causing the recruiter to infer `no people management`.

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

For every generated or materially revised DOCX that is actually required:

1. render it to page images directly or through PDF;
2. inspect every page at 100% zoom;
3. inspect page/section breaks and transitions for blank pages or excessive empty areas;
4. verify consistent line and paragraph spacing in body, headings, dates and bullets;
5. verify clean wrapping, no clipping/overlap, headings kept with following content and deliberate page endings;
6. fix defects, rerender and inspect every page again;
7. call the DOCX final only after the latest render passes;
8. if rendering is unavailable, state the blocker and do not claim visual QA passed.

## Mandatory final first-screen audit

Before finalizing a tailored CV, review every `MUST` expectation and answer:

1. What exact wording in the vacancy created this expectation?
2. Is it a business expectation, a screening filter, or both?
3. What is Anton's strongest evidence block for it?
4. Is that evidence visible in the first third if it is likely to be screened early?
5. Does the wording prove the exact thing being asked?
6. Are direct span, total org scope and influence-without-authority correctly distinguished?
7. Did a more impressive but irrelevant metric displace a required signal?
8. Is a supported fact hidden only in Skills/Summary instead of Experience?
9. Is a real gap being disguised by ambiguous wording?
10. Would a recruiter scanning only headline + Profile + Role Fit + most recent/relevant role see enough evidence to pass Anton to the next stage?

If Anton has strong evidence but the answer to #10 is no, the CV is not ready.

## Operational boundary

This workflow deliberately contains no writable-tab list, no column-level salary storage contract, no cross-tab routing procedure and no Gmail status mutation rules. Those change independently and must be loaded fresh from the employment workflow's canonical operational references.