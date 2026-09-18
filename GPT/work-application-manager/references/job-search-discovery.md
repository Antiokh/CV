# Vacancy discovery workflow

Use this reference for CV-mode vacancy discovery, scheduled job scans and requests to find new employment opportunities.

This file does not redefine the modular contracts. Load:

- the runtime-selected tracker contract; on live v7, `tracker-storage-v6.md` owns physical columns and helper addresses;
- `salary-normalization-v6.md` for salary research/storage/completion;
- the runtime-selected CV contract; on live v7, `cv-markdown-v3.md` owns J/K/L semantics;
- `archetype-cv-routing-v1.md` for fast baseline CV selection during broad capture;
- `activity-log.md` when hiring/process evidence is encountered;
- `role-entry-strategy-v1.md` for interview-derived role targeting and cold-entry priority.

## Phase 0 — compact Queue before discovery

Before snapshotting Jobs, scanning Queue, reading source inventories or creating any vacancy rows, run the tracker-defined Queue startup compaction. On live v7 delete only internal physical rows where trimmed A / Company, B / Position and Y / Row ID are all empty. Ignore formulas/helpers for the emptiness decision, delete ranges bottom-up, preserve trailing capacity, then discard cached row numbers and re-resolve by Row ID.

## Live inventories

Before every broad discovery run read current WorkInterviews:

- `Job Sources` — live search coverage and priorities;
- `RU-root Companies` — employer inventory and Blocker state.

Skip a company with a non-empty Blocker unless Anton explicitly overrides it.

## Hard tracker boundary

During discovery:

- read/deduplicate through aggregate `Jobs`;
- write genuinely new vacancy rows only to Queue;
- agent Stage writes are limited to `To review`, `Reviewed`, `CV ready`;
- never write to Jobs / Active / Low fit / Closed;
- never emulate cross-tab lifecycle routing;
- preserve pre-existing vacancy Stage and Date applied throughout the discovery run;
- if a pre-existing Row ID resolves outside Queue, it is read/history only for discovery.

## Search priority

Unless Anton requests a narrower source:

1. Y Combinator / Work at a Startup / YC Jobs;
2. RU-root Companies with blank Blocker using current official careers pages;
3. high-priority Job Sources;
4. secondary sources for coverage gaps.

Source priority affects search effort, not Fit %.

## Role-entry priority

Apply `role-entry-strategy-v1.md` independently from Fit scoring. Interview evidence as of 2026-09-04 indicates that otherwise comparable vacancies should receive application/search effort in this order:

1. Product Manager / technical product roles with meaningful ownership, discovery, analytics and cross-functional delivery;
2. applied AI Engineering / AI Principal roles where analytics, automation, architecture, tooling or product judgment are material;
3. Engineering Manager roles where leadership/system judgment matters more than recent stack-specific coding, especially with AI scope or a warm path;
4. CTO / Head / technology-leadership roles with strong pain/evidence fit, giving additional priority to trust-based/warm channels;
5. generic non-AI Tech Lead / IC-heavy leadership only when unusually well matched and not primarily filtered on recent conventional coding depth.

This order controls time allocation, shortlist priority and outreach strategy. It must **never** inflate or lower the evidence-based Fit % merely because a role is easier or harder to enter cold.

When a strong company has several credible roles, do not automatically prefer the grandest title. Prefer the role with strong evidence-backed fit, cleaner first-screen recognition and meaningful ownership, especially Product or applied-AI roles that can establish trust inside the company. Apply sincerely to the actual role; do not tell the employer it is merely a stepping stone.

## Broad discovery and capture sequence

Discovery has two phases. Breadth comes first; deep personalization comes second.

### Phase 1 — capture the vetted new pool with baseline CVs

For each candidate opportunity:

1. verify it is still accepting applications;
2. verify Serbia/Europe/EMEA/Worldwide eligibility as applicable;
3. deduplicate against Jobs by Row ID when known, Vacancy URL and normalized Company + Position; Apply URL is supporting evidence;
4. classify the vacancy against `role-entry-strategy-v1.md` for priority without changing Fit truthfulness;
5. capture substantive vacancy text and source/application metadata;
6. assign evidence-based Fit % and an evidence-backed Archetype;
7. after the breadth gate, ingest each vetted vacancy into Queue as `To review` with immutable Row ID and all cheap/source-obvious fields available now;
8. create/verify Position.md when substantive vacancy text is available;
9. route Archetype through `archetype-cv-routing-v1.md`;
10. copy the selected canonical role CV verbatim into the vacancy folder as the vacancy-owned Markdown CV, verify/read back content and public sharing, and write only that source URL to J;
11. on live v7, verify K/L are existing row-local formulas and resolve to `DOCX` / `PDF`; never write K/L;
12. continue capturing the vetted pool without waiting for deep salary research, referral research, Cover, Pain/Expectation mapping, or CV personalization.

A baseline CV is an allowed `To review` state and is not evidence of `CV ready`.

### Phase 2 — complete Queue rows one by one

After new-pool capture, process incomplete Queue rows by practical attractiveness and age:

1. complete missing vacancy metadata, salary normalization, recruiter/referral lookup and other applicable fields;
2. build Pain Map + Expectation Map and verify evidence;
3. convert the vacancy-owned baseline CV into a genuinely vacancy-tailored CV;
4. create and humanize Cover when required by the workflow;
5. verify J plus v7 K/L derivatives, Salary Data, public artifacts and Queue integrity AB;
6. advance to `Reviewed` / `CV ready` only when the current gates are genuinely satisfied.

Do not stop new-vacancy capture because one row needs expensive personalization. Do not let old incomplete Queue rows starve indefinitely across runs.

## Salary gate

`salary-normalization-v6.md` is authoritative.

In particular:

- `To review` may temporarily have incomplete salary research while work is in progress.
- Do not leave a vacancy as `Reviewed` or `CV ready` unless the matching Salary Data J is `OK`.
- Employer silence on compensation is not a waiver; research a defensible market estimate.
- If a defensible two-sided range / currency / NET-GROSS basis / static FX cannot be established, keep `To review`, record the exact blocker and do not claim review completion.
- On live v7, never literal-write vacancy F or AH; both are computed from Salary Data. Older AF references are superseded by the tracker v6 layout.

## Network lookup and ranking

Broad capture does not wait for LinkedIn/referral research. Capture the vetted vacancy and its Archetype-routed baseline CV first.

During Phase 2 completion, check the private LinkedIn Connections snapshot before final prioritization/application action. Use exact normalized Company Key first, then evidence-backed aliases only. Suggest at most three useful contacts: recruiter/TA, likely functional leader/hiring manager, relevant employee.

Networking may affect practical priority but never Fit %. A connection is not a referral until outreach/introduction is confirmed.

Under the current role-entry strategy, warm paths are especially valuable for Engineering Manager and CTO/Head roles because they allow management/architecture evidence to be evaluated before a narrow recent-coding filter. Product and applied-AI roles still benefit from referrals, but do not require a warm path to remain primary cold-application targets.

## Vacancy availability precedence

Explicit terminal application-state evidence wins over promotional badges. Examples: no longer accepting applications, applications closed, vacancy unavailable, disabled/removed Apply, ATS refusing submission.

`Actively reviewing applicants` does not make a closed vacancy open.

For a pre-existing tracker record discovered to be closed, preserve its run-start Stage and report the evidence; discovery does not perform lifecycle mutation.

## Pre-existing lifecycle safety across the two phases

Before Phase 1 Queue writes:

1. snapshot pre-existing Row ID + Stage from Jobs;
2. during discovery/broad capture, do not change Stage, Date applied or protected history on pre-existing rows;
3. Phase 1 creates only genuinely new `To review` rows.

During Phase 2 Queue completion:

4. pre-existing Queue rows may be enriched and their Stage may advance monotonically only within Queue persistent stages `To review -> Reviewed -> CV ready` when the corresponding gates are actually satisfied;
5. Date applied and later/terminal lifecycle evidence remain protected and are never fabricated or regressed;
6. rows in Active / Low fit / Closed remain read-only to agents;
7. report material identity/lifecycle inconsistencies instead of routing rows by API.

## Baseline-capture and tailored-readiness gate

For broad scheduled discovery, a newly ingested high-fit vacancy does **not** need to become `CV ready` before the next vacancy is captured. It needs a truthful `To review` record and, when Archetype routing is resolvable, a verified vacancy-owned baseline Markdown CV.

Baseline-capture success on live v7 requires:

- immutable Row ID in Y;
- evidence-backed Archetype in O;
- source-obvious vacancy fields captured;
- Position.md when substantive source text is available;
- vacancy-owned baseline Markdown CV copied from the routed canonical template and its verified public URL in J;
- K/L left formula-owned and resolving from J;
- Stage = `To review`.

Deep completion is separate. A row may reach `CV ready` only after:

- salary research is complete and matching Salary Data J = `OK`;
- applicable metadata/referral/recruiter enrichment is complete;
- the vacancy-owned Markdown CV is genuinely tailored to the vacancy, not still a verbatim template copy;
- required Cover is created/humanized/verified;
- public artifact readbacks succeed;
- Queue AB = `OK`;
- content/evidence QA passes.

Agents never write K/L. DOCX/PDF are formula derivatives of J and separately persisted exports remain optional unless a concrete application channel requires them.

A later evidenced lifecycle event does not authorize an agent to write `Applied` / Assessment / Interview / terminal stages into Queue. Log/report the event and leave UI routing to the bound script.

## Blocked state

When a required step cannot be completed:

- keep the vacancy in the safest truthful Queue state, normally `To review` while salary is unresolved or `Reviewed` only if all Reviewed gates are satisfied;
- preserve verified artifacts already created;
- put a specific blocker in Notes (`CV BLOCKED: ...` when the canonical CV pack itself is blocked);
- put the concrete recovery action in Next action;
- never invent a file URL, salary value or Stage.

Failure to export an optional DOCX is not a CV-ready blocker unless Word is actually required for the concrete submission.

## Completion reconciliation

Before reporting a broad run complete:

1. re-read every Row ID created in this run from Queue;
2. verify every captured row has the intended `To review` state, evidence-backed Archetype and correct vacancy-owned baseline CV source in J unless a specific routing/artifact blocker is recorded;
3. on live v7, verify K/L remain formulas derived from J and Queue AB is read after completion-phase mutations where the integrity gate applies;
4. report how many Queue rows remain baseline/incomplete versus fully tailored `CV ready`;
5. re-read Jobs and confirm every pre-existing protected lifecycle state remains unchanged except for explicit Queue completion work allowed by the current workflow;
6. if an unexpected lifecycle change occurs, stop further writes and report the conflict.

## Company cooldown

A non-empty `RU-root Companies!Blocker` is a stop signal for discovery/outreach unless Anton overrides it.

A confirmed rejection normally creates a 90-calendar-day company cooldown from rejection/last-contact date when applicable. Do not create blockers from silence, talent-pool mail, generic receipts or ambiguous status.
