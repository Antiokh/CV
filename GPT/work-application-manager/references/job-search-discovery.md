# Vacancy discovery workflow

Use this reference for CV-mode vacancy discovery, scheduled job scans and requests to find new employment opportunities.

This file does not redefine tracker storage. Load `tracker-storage-v5.md` first; it is authoritative for writable tabs, Stage writes, Salary Data and Queue integrity.

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

## New-vacancy sequence

For each candidate opportunity:

1. verify it is still accepting applications;
2. verify Serbia/Europe/EMEA/Worldwide eligibility as applicable;
3. deduplicate against Jobs by Row ID when known, Vacancy URL and normalized Company + Position; Apply URL is supporting evidence;
4. for a genuinely new candidate, perform the LinkedIn Connections lookup before expensive pack work;
5. capture substantive vacancy text and source/application metadata;
6. create Position.md and verify it;
7. assign evidence-based Fit %;
8. research salary and normalize it through the current structured Salary Data contract;
9. create the Queue row with immutable Row ID through the atomic creation protocol from `tracker-storage-v5.md`;
10. complete the application-pack gate when fit >60%;
11. read back Queue Z and required Salary Data fields before reporting the vacancy processed.

## Salary is mandatory before Reviewed / CV ready

Current live salary rules apply to discovery regardless of fit:

- `To review` may temporarily have incomplete salary research while work is in progress.
- Do not leave a vacancy as `Reviewed` or `CV ready` unless its matching Salary Data row has `Normalization status = OK`.
- Employer silence on compensation is not a waiver; produce a defensible market estimate using the current source order and evidence threshold.
- If a defensible two-sided range / currency / NET-GROSS basis / static FX cannot be established, keep the vacancy `To review`, record the exact blocker and do not claim review completion.
- Never write a literal estimate to vacancy F or AF; both are computed from Salary Data.

## Network-first ranking

For every genuinely new vacancy that passes basic fit/geography screening, check the private LinkedIn Connections snapshot after dedup and before substantial salary/application-pack work.

Use exact normalized Company Key first, then evidence-backed aliases only. Suggest at most three useful contacts: recruiter/TA, likely functional leader/hiring manager, relevant employee.

Networking may affect practical priority but never Fit %. A connection is not a referral until outreach/introduction is actually confirmed.

## Vacancy availability precedence

Explicit terminal application-state evidence wins over promotional badges.

Examples of terminal evidence: no longer accepting applications, applications closed, vacancy unavailable, disabled/removed Apply, ATS refusing submission.

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
- tailored CV Markdown;
- final DOCX after mandatory render/visual QA;
- humanized cover TXT;
- required Drive readbacks and shareability checks;
- verified Vacancy file / CV / Cover links;
- Salary Data J = `OK`;
- Queue Z = `OK`;
- Stage exactly `CV ready`.

A later evidenced lifecycle event does **not** authorize an agent to write `Applied`/Assessment/Interview/etc. into Queue. Log/report the event and leave human/UI routing to the bound script.

## Blocked state

When a required step genuinely cannot be completed:

- keep the vacancy in the safest truthful Queue state, normally `To review` while salary is unresolved or `Reviewed` only if all Reviewed gates are satisfied;
- preserve verified artifacts already created;
- put a specific blocker in Notes (`CV BLOCKED: ...` when the application pack itself is blocked);
- put the concrete recovery action in Next action;
- never invent a file URL, salary value or Stage.

If a supported alternate generation/render path exists in the same run, try it before accepting a blocker.

## Completion reconciliation

Before reporting discovery complete:

1. re-read every Row ID created in this run from Queue;
2. verify salary status and Queue Z;
3. for every new Fit >60% row, verify complete pack / explicit blocker / explicit Anton decline;
4. re-read Jobs and confirm every pre-existing Row ID touched by the run still has the run-start Stage;
5. if a pre-existing Stage changed unexpectedly, stop further writes and report the conflict.

## Company cooldown

A non-empty `RU-root Companies!Blocker` is a stop signal for discovery and outreach unless Anton overrides it.

A confirmed rejection normally creates a 90-calendar-day company cooldown from rejection/last-contact date when applicable. Do not create blockers from silence, talent-pool mail, generic receipts or ambiguous status.
