# Vacancy discovery workflow

This reference is mandatory for CV-mode vacancy discovery, scheduled job scans, and any request to find new employment opportunities for Anton.

## Live source inventories

Do not hardcode job boards or employer lists. Before every broad discovery run, read the current Google Sheet `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`):

- `Job Sources` — live coverage checklist for boards, aggregators, ATS directories, Serbia/CEE/Europe/remote sources, Telegram channels, and other vacancy sources.
- `RU-root Companies` — live employer inventory. Skip rows with a non-empty `Blocker` unless Anton explicitly overrides it.

New rows in these inventories automatically become part of the next search.

## Tracker read/write boundary

This is a hard invariant for ChatGPT/agent operations.

- `Jobs` is the preferred **read-only aggregate** for unified vacancy reads, deduplication, Row ID lookup, Stage snapshots, and history/status verification.
- Agents may write vacancy-row data **only to `Queue`**.
- `Active`, `Low fit`, and `Closed` are read-only to agents. They may be consulted when useful, but agents must never insert, update, clear, delete, or move vacancy rows there.
- Never write into `Jobs`; it is an aggregate VSTACK view and writes inside its spill range can break it with `#REF!`.
- Do not perform owning-partition routing and do not emulate cross-tab moves.
- For any agent-side mutation of a tracked vacancy, resolve the immutable `Row ID` in `Queue` and write only there. If the requested change cannot be represented safely under Queue-only writes, report the constraint instead of writing another tracker tab.
- This rule supersedes all older instructions that allowed writes to `Jobs`, `Active`, `Low fit`, or `Closed`.

## Search-source priority

Spend discovery effort in this order unless the user names a narrower source:

1. **Y Combinator / Work at a Startup / YC Jobs**.
2. **`RU-root Companies` with blank `Blocker`**, using current official Careers URLs.
3. **High-priority `Job Sources`** according to their live notes/relevance.
4. Secondary/low-relevance sources when needed for coverage gaps.

Source priority changes search order, not `Fit %`. Do not inflate fit because a company is YC-backed, Russian-rooted, prestigious, familiar, or network-accessible.

## Network-first opportunity ranking

For every genuinely new vacancy that passes basic role-fit and geographic-eligibility screening, deduplicate first, then perform the `LinkedIn Connections` lookup before substantial salary/application-pack work.

- Search exact normalized `Company Key`, then only evidence-backed aliases.
- Prefer recruiter/TA, likely hiring manager/function leader, then role-relevant employee.
- Warm access affects practical priority, never `Fit %`.
- A connection is only a referral candidate. Do not populate `Referral` or change `Stage` unless outreach/introduction is actually evidenced.

## Vacancy availability evidence precedence

Explicit terminal application state wins over promotional/recruiter activity metadata.

- `No longer accepting applications`, `Applications closed`, `This job is no longer available`, disabled/removed Apply, or an ATS that no longer accepts submissions means **closed for new applications**.
- This remains true even when the same page says `Actively reviewing applicants`, `Promoted by hirer`, shows applicant counts, or other activity badges.
- Prefer the live ATS/apply endpoint or explicit submission-state message over listing metadata.
- Therefore `Actively reviewing applicants` + `No longer accepting applications` => **not open; do not ingest as a new opportunity**.
- If such evidence is found for a pre-existing vacancy during discovery, preserve its snapshotted Stage and report the stale/closed evidence; discovery itself must not change that pre-existing Stage.

## Pre-existing Stage immutability during discovery

Before the first tracker write in a discovery run:

1. read populated vacancies through aggregate `Jobs` and snapshot every existing immutable `Row ID` + `Stage`;
2. treat every snapshotted Row ID as pre-existing for the entire run;
3. if a candidate deduplicates to a pre-existing Row ID, do not change its Stage, Date applied, or other discovery-side lifecycle state;
4. do not use discovery for material re-analysis, orphan-pack repair, or automatic Stage promotion of pre-existing rows;
5. a pre-existing row may change Stage only in a separate status-changing workflow backed by explicit user instruction or direct hiring-lifecycle evidence.

## Discovery sequence

1. Load current runtime, router, `work-application-manager/SKILL.md`, this reference, and hidden `Agent Instructions`.
2. Snapshot pre-existing Row IDs + Stages from aggregate `Jobs`.
3. Read `Job Sources` and `RU-root Companies` fresh.
4. Search YC first, then unblocked RU-root employers, then high-priority sources, then secondary sources.
5. Verify each vacancy is still accepting applications and separately verify Serbia/Europe/EMEA/Worldwide eligibility.
6. Deduplicate against aggregate `Jobs` by Vacancy URL and normalized Company + Position.
7. For genuinely new candidates, run mandatory LinkedIn referral lookup.
8. Rank by practical attractiveness using fit, geographic certainty, salary/level, and warm-network path.
9. For each genuinely new vacancy, execute salary research, source capture, Position.md, evidence-backed tracker fields, UUID Row ID, and concurrency-safe write **to Queue only**.
10. Apply the transactional high-fit gate before ingesting the next new high-fit vacancy.
11. Record material broken/stale source URLs when encountered.
12. Run completion reconciliation before reporting.

## High-fit transactional CV invariant

For a new vacancy created in the current run with displayed `Fit % > 60%`, geographic eligibility not disproved, and no explicit user decline, complete or explicitly block the application pack before ingesting the next new high-fit vacancy.

### Successful pack state

The new `Queue` row must have:

- verified `Position.md`;
- tailored CV Markdown;
- final DOCX after mandatory render/visual QA;
- humanized cover TXT;
- readback of all four canonical Drive artifacts;
- verified public `anyone with the link` reader access where required by current tracker rules;
- verified `Vacancy file`, `CV`, and `Cover` links;
- `Stage = CV ready` in `Queue` unless explicit evidence supports a different value that is safe to represent in Queue.

A plain `Reviewed` row with `Fit % > 60%` and empty `CV` is not a successful completion state.

### Explicit blocked state

If a required step is genuinely unavailable:

- keep the new row in `Queue`, normally `Stage = Reviewed`;
- preserve verified artifacts already created;
- put `CV BLOCKED: <specific cause>` in `Notes`;
- put the concrete recovery action in `Next action`;
- never invent file URLs or claim the pack is complete.

If another supported generation/render path is available in the same run, try it before accepting the blocker.

## Backpressure

- Finish or explicitly block one new high-fit vacancy before ingesting the next.
- Do not trade application-pack completeness for discovery volume.
- If DOCX/render/Drive or another mandatory gate fails, record the blocker and stop creating further incomplete high-fit tracker rows.
- Existing vacancies remain read/dedup/history records during discovery; do not repair them in this workflow.

## Mandatory completion reconciliation

Before final output:

1. Re-read every row created in this run by immutable Row ID from `Queue`.
2. For every new `Fit % > 60%` row, confirm exactly one terminal state:
   - complete pack with verified links and `Stage = CV ready`, or
   - explicit `CV BLOCKED:` + concrete recovery action, or
   - explicit user decline recorded in Notes.
3. Re-read aggregate `Jobs` and verify that every pre-existing row touched/read during the run still has the same Stage as the run-start snapshot.
4. If a pre-existing Stage changed unexpectedly, stop further writes and report the conflict. Do not silently overwrite concurrent/user changes.

When a pre-existing high-fit row is missing a pack, it may be reported as an orphaned state, but repair requires a separate explicit workflow.

## Company blocker / rejection cooldown

`RU-root Companies!Blocker` is a company-level stop signal.

- Non-empty Blocker => skip company careers scan, recommendation, and referral/recruiter outreach unless Anton overrides.
- Confirmed rejection creates a default 90-calendar-day company cooldown from the rejection/last-contact date when applicable.
- Do not create blockers from silence, generic talent-pool mail, application receipts, or ambiguous statuses.
- Clear/override only from current evidence or Anton's explicit instruction.

The purpose is to avoid repeatedly spending effort on employers that are temporarily or explicitly blocked.