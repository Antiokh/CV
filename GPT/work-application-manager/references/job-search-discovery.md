# Vacancy discovery workflow

Use this reference for CV-mode vacancy discovery, scheduled job scans and requests to find new employment opportunities.

This file does not redefine the modular contracts. Load:

- `tracker-storage-v5.md` for vacancy ownership/agent writes/lifecycle integrity;
- `salary-normalization-v6.md` for salary research/storage/completion;
- `cv-markdown-v2.md` for tailored CV source/write/presentation semantics;
- `activity-log.md` when hiring/process evidence is encountered;
- `role-entry-strategy-v1.md` for interview-derived role targeting and cold-entry priority.

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

## New-vacancy sequence

For each candidate opportunity:

1. verify it is still accepting applications;
2. verify Serbia/Europe/EMEA/Worldwide eligibility as applicable;
3. deduplicate against Jobs by Row ID when known, Vacancy URL and normalized Company + Position; Apply URL is supporting evidence;
4. classify the vacancy against `role-entry-strategy-v1.md` for application priority without changing Fit truthfulness;
5. for a genuinely new candidate, perform LinkedIn Connections lookup before expensive pack work;
6. capture substantive vacancy text and source/application metadata;
7. create Position.md and verify it;
8. assign evidence-based Fit %;
9. research/normalize salary according to `salary-normalization-v6.md`;
10. create the Queue row with immutable Row ID through the atomic protocol from `tracker-storage-v5.md`;
11. complete the Markdown-first application-pack gate when fit >60%;
12. read back Queue Z and required Salary Data fields before reporting the vacancy processed.

## Salary gate

`salary-normalization-v6.md` is authoritative.

In particular:

- `To review` may temporarily have incomplete salary research while work is in progress.
- Do not leave a vacancy as `Reviewed` or `CV ready` unless the matching Salary Data J is `OK`.
- Employer silence on compensation is not a waiver; research a defensible market estimate.
- If a defensible two-sided range / currency / NET-GROSS basis / static FX cannot be established, keep `To review`, record the exact blocker and do not claim review completion.
- Never literal-write vacancy F or AF; both are computed from Salary Data.

## Network-first ranking

For every genuinely new vacancy that passes basic fit/geography screening, check the private LinkedIn Connections snapshot after dedup and before substantial salary/application-pack work.

Use exact normalized Company Key first, then evidence-backed aliases only. Suggest at most three useful contacts: recruiter/TA, likely functional leader/hiring manager, relevant employee.

Networking may affect practical priority but never Fit %. A connection is not a referral until outreach/introduction is confirmed.

Under the current role-entry strategy, warm paths are especially valuable for Engineering Manager and CTO/Head roles because they allow management/architecture evidence to be evaluated before a narrow recent-coding filter. Product and applied-AI roles still benefit from referrals, but do not require a warm path to remain primary cold-application targets.

## Vacancy availability precedence

Explicit terminal application-state evidence wins over promotional badges. Examples: no longer accepting applications, applications closed, vacancy unavailable, disabled/removed Apply, ATS refusing submission.

`Actively reviewing applicants` does not make a closed vacancy open.

For a pre-existing tracker record discovered to be closed, preserve its run-start Stage and report the evidence; discovery does not perform lifecycle mutation.

## Pre-existing Stage immutability

Before the first Queue write:

1. snapshot every pre-existing Row ID + Stage from Jobs;
2. treat those Row IDs as immutable lifecycle state for the discovery run;
3. do not change their Stage / Date applied / protected history;
4. do not use discovery to repair orphaned packs or advance/reject old applications;
5. report material inconsistencies instead.

## High-fit transactional gate

For each **new** vacancy inserted in the current run with displayed Fit >60%, geographic eligibility not disproved and no explicit user decline, finish or explicitly block the pack before ingesting the next new high-fit vacancy.

Successful Queue state requires:

- verified Position.md;
- verified canonical tailored CV Markdown;
- Queue `CV` containing the verified public Markdown source URL or its derived `DOCX PDF` presentation;
- humanized Cover TXT when required by the workflow;
- required Drive readbacks/shareability checks;
- verified Vacancy file / CV / Cover values as applicable;
- Salary Data J = `OK`;
- Queue Z = `OK`;
- Stage exactly `CV ready`.

Agents write only the raw verified Markdown source URL to Queue `CV`; they do not construct markdown-drive DOCX/PDF links. The bound Queue presentation helper renders those variants on sheet open/manual sync. A persistent DOCX is **not** part of the default success gate. Export DOCX through `markdown-drive` only when Anton or the actual application channel requires Word. If Word is exported for final use, it must be generated from the current Markdown and visually QA'd before delivery/submission.

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

Before reporting discovery complete:

1. re-read every Row ID created in this run from Queue;
2. verify salary status and Queue Z;
3. for every new Fit >60% row, verify complete Markdown-first pack / explicit blocker / explicit Anton decline;
4. re-read Jobs and confirm every pre-existing Row ID touched by the run still has the run-start Stage;
5. if a pre-existing Stage changed unexpectedly, stop further writes and report the conflict.

## Company cooldown

A non-empty `RU-root Companies!Blocker` is a stop signal for discovery/outreach unless Anton overrides it.

A confirmed rejection normally creates a 90-calendar-day company cooldown from rejection/last-contact date when applicable. Do not create blockers from silence, talent-pool mail, generic receipts or ambiguous status.
