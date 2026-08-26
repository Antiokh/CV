# Vacancy discovery workflow

This reference is mandatory for CV-mode vacancy discovery, scheduled job scans, and any request to find new employment opportunities for Anton.

## Live source inventories

Do not hardcode the job-board or employer lists in this repository. The canonical live inventories are Google Sheet `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`):

- `Job Sources` — job boards, aggregators, ATS directories, Serbia-specific sources, remote boards, and other vacancy-search sources. Read the current rows before every discovery run and use the listed URLs as the coverage checklist. Respect relevance notes; low-relevance sources may be deprioritized, but do not silently replace the inventory with LinkedIn recommendations or a memorized subset.
- `RU-root Companies` — companies with Russian-speaking / ex-USSR / Russian-root international hiring relevance and their current careers URLs. Read the current rows before every discovery run and inspect the listed careers pages in addition to general job boards.

Because these inventories are maintained live in the Sheet, newly added rows become part of the next search automatically without a repository change.

## Tracker partition architecture

The live tracker uses partitioned canonical storage.

- `Jobs` is a **read-only aggregate view** that VSTACKs canonical vacancy rows from `Queue`, `Active`, `Low fit`, and `Closed`. It is useful for unified reads and deduplication, but it must never receive direct vacancy-cell writes; a write inside its array spill range can break the aggregate with `#REF!`.
- Canonical rows live in the partition tabs and remain identified by immutable `Row ID`.
- New discovery vacancies start in `Queue` with `To review`, `Reviewed`, or `CV ready` as appropriate.
- Lifecycle routing: `Queue` = `To review`, `Reviewed`, `CV ready`; `Active` = `Referral`, `Applied`, `Recruiter screen`, `Interview`, `Technical interview`, `Final`, `Offer`; `Low fit` = `Not a fit`; `Closed` = `Rejected`, `Withdrawn`, `Ghosted`, `Closed`.
- Reads/deduplication may use `Jobs`, but every mutation must re-resolve the Row ID in the owning partition and write there.
- A status-changing workflow that crosses a partition boundary must move the complete canonical row safely/atomically rather than editing the `Jobs` aggregate.
- This partition rule supersedes older tracker instructions that described `Jobs` as the writable canonical table or `Queue` / `Active` / `Low fit` as read-only formula views.

## Search-source priority

Discovery is not an equal-depth sweep. Spend search effort in this order unless an explicit user request names a narrower source:

1. **Y Combinator / Work at a Startup / YC Jobs** — highest-priority general source. Check it early in every broad discovery run, especially for product, engineering, solutions, forward-deployed, technical leadership, founding-team, and unusual cross-functional roles. Prefer roles that explicitly do not require a US visa or that clearly allow remote work from Serbia/Europe.
2. **`RU-root Companies` with blank `Blocker`** — highest-priority employer inventory alongside YC. Scan these official careers pages early, not only after exhausting generic boards. Russian-speaking / ex-USSR roots are a search-priority signal because cultural/language fit and warm-network probability may improve access, but they do not override role fit or geographic eligibility.
3. **High-priority rows in `Job Sources`** — then cover the strongest Serbia, Europe, remote, startup, ATS-meta-search, and direct-hiring sources according to their current Notes/relevance.
4. **Secondary/low-relevance sources** — use after the priority tiers or when they cover a gap not represented above.

A source priority affects search order and time allocation, not `Fit %`. Do not inflate fit because a company is YC-backed, Russian-rooted, familiar, prestigious, or network-accessible.

## Network-first opportunity ranking

Warm access is a first-class search signal. For every genuinely new vacancy that passes basic role-fit and geographic-eligibility screening, perform the `LinkedIn Connections` lookup immediately after deduplication and before spending substantial time on salary research or application-pack generation.

- Search the hidden `LinkedIn Connections` snapshot by exact normalized `Company Key`, then evidence-backed parent/subsidiary/former-name/common-brand aliases as defined in `work-application-manager/SKILL.md` and `Agent Instructions`.
- Rank useful first-degree contacts in this order: relevant recruiter/TA; likely hiring manager or function leader; then a role-relevant employee who could credibly introduce Anton. A highly relevant functional leader may outrank generic HR.
- A strong warm path does **not** change `Fit %`. It changes practical priority among otherwise comparable vacancies.
- When two vacancies have similar fit and geography, prefer the one with a credible warm path. A direct first-degree recruiter/hiring-manager connection is a stronger ranking signal than a generic employee connection; no exact useful connection is neutral, not disqualifying.
- Do not populate `Referral` or change `Stage` merely because a connection exists. The snapshot yields referral candidates, not evidence of outreach.
- In shortlist output, surface the best referral candidates prominently instead of burying them after the vacancy analysis.

The purpose is to maximize interview probability, not just vacancy count. A slightly less attractive but still high-fit role with a credible warm introduction may deserve action before an equally high-fit cold application.

## Vacancy availability evidence precedence

When a source page presents contradictory hiring-state signals, treat the explicit terminal application state as authoritative over promotional or recruiter-activity metadata.

- `No longer accepting applications`, `Applications closed`, `This job is no longer available`, a disabled/removed apply action, or an ATS response that no longer accepts submissions means the vacancy is **closed for new applications**, even if the same page also shows `Actively reviewing applicants`, `Promoted by hirer`, applicant counts, recruiter activity, or similar badges.
- Promotional/recruiter badges describe hiring or review activity and may lag behind the actual application intake state. They must never override an explicit closed/not-accepting state.
- When LinkedIn or another board shows both `Actively reviewing applicants` and `No longer accepting applications`, classify the vacancy as **not open** and do not ingest it as a new active opportunity.
- Prefer the most direct submission-state evidence: the live ATS/apply endpoint or explicit application-state message beats listing metadata; explicit terminal state beats non-terminal activity badges.
- If a pre-existing tracked vacancy is found closed during a discovery run, obey pre-existing Stage immutability: do not change its Stage inside discovery. Report the stale/closed evidence separately if useful. A separate status-changing workflow may set `Stage = Closed` when supported by direct evidence or explicit user instruction.

## Pre-existing Stage immutability during discovery

A vacancy-discovery run may add new positions, but it must never change `Stage` for a row that existed before the run started.

At the start of every discovery run that may write to the tracker:

1. read the current populated rows through the aggregate `Jobs` view and snapshot each existing immutable `Row ID` together with its current `Stage`;
2. treat every snapshotted Row ID as pre-existing for the entire run, even if the row later moves between canonical partitions;
3. if a discovered vacancy deduplicates to a pre-existing Row ID, preserve that row's `Stage` exactly and do not write `Date applied` or any other discovery-side field whose event automation could change `Stage`;
4. only rows inserted during the current discovery run may receive an initial `Stage` or discovery-driven transition to `CV ready`;
5. automatic CV generation, orphan-pack repair, completion reconciliation, enrichment, or material re-analysis during discovery must not override this rule for a pre-existing row;
6. a pre-existing row may change `Stage` only in a separate status-changing workflow backed by explicit user instruction or direct hiring-process evidence, such as an ATS receipt, recruiter/interview message, rejection, offer, withdrawal, ghosting, closure, or other lifecycle event.

If a pre-existing row appears stale, incomplete, or inconsistent, report it separately without changing its `Stage` during the discovery/addition task.

## Discovery sequence

1. Read hidden `Agent Instructions` when the run will write to the tracker.
2. Snapshot pre-existing Row IDs and Stages through the aggregate `Jobs` view as required by the immutability rule above.
3. Read `Job Sources` and `RU-root Companies` fresh from `WorkInterviews` before searching.
4. Check Y Combinator / Work at a Startup / YC Jobs first for relevant Serbia/Europe/worldwide-eligible roles.
5. Scan `RU-root Companies` rows with blank `Blocker` early, using their listed `Careers URL`; prefer the official/current careers page over a generic homepage or LinkedIn fallback.
6. Search the remaining relevant `Job Sources` URLs for Anton's target roles and allowed geography/work model. Treat the Sheet as the coverage checklist; do not rely only on LinkedIn, search-engine results, or recommendation feeds.
7. For each candidate vacancy, verify current application availability before treating it as active. Apply the vacancy availability evidence precedence rule above; terminal `closed` / `no longer accepting` evidence disqualifies the vacancy even when promotional activity badges suggest otherwise.
8. For each candidate vacancy that passes basic fit/geography/availability screening, deduplicate against aggregate `Jobs` by Vacancy URL and normalized Company + Position. If genuinely new, immediately run the mandatory `LinkedIn Connections` referral-candidate lookup before substantial downstream processing.
9. Rank comparable opportunities using both fit and practical access: preserve `Fit %` as the role-fit score, while using credible first-degree network paths as a tie-breaker / action-priority boost.
10. Apply the normal vacancy workflow subject to pre-existing Stage immutability and partitioned storage. Insert genuinely new discovery rows into `Queue`; process every new high-fit vacancy transactionally before moving to the next new high-fit vacancy.
11. Record material broken/stale source URLs when encountered so the inventories can be repaired rather than repeatedly retried.
12. Run the mandatory completion reconciliation below before reporting the discovery run as complete.

## High-fit transactional CV invariant

For a new employment vacancy inserted during the current discovery run with displayed `Fit % > 60%`, geographic eligibility not disproved, and no explicit user instruction declining a CV, the automatic-CV gate is a hard workflow invariant, not an optional follow-up.

For a pre-existing row, do not use discovery to change its `Stage`, even when it is materially re-analyzed or its application pack is incomplete. Handle any desired repair in a separate explicit workflow.

After a newly inserted vacancy crosses the gate, do not proceed to the next new high-fit vacancy until one of these states is reached:

### Successful pack state

- `Position.md` exists and has passed Drive readback;
- the tailored CV Markdown exists;
- the final DOCX exists and has passed mandatory render/visual QA;
- the humanized cover-letter TXT exists;
- all four canonical Drive artifacts have passed readback;
- the verified DOCX URL is stored in `CV`;
- the verified TXT URL is stored in `Cover`;
- `Vacancy file` contains the verified `Position.md` URL;
- canonical row remains in `Queue` with `Stage = CV ready`, unless direct evidence already supports a later stage and a separate lifecycle workflow moves it to the appropriate partition.

A newly inserted plain `Reviewed` row with `Fit % > 60%` and an empty `CV` is not a successful completion state.

### Explicit blocked state

If a required application-pack step cannot be completed because of an actual tool, integration, source, rendering, or data blocker:

- keep the new canonical row in `Queue` with `Stage = Reviewed` unless a later stage is directly evidenced;
- preserve every artifact that was successfully created and verified;
- write a concise `CV BLOCKED: <specific cause>` marker in `Notes`;
- set `Next action` to the exact recovery action, for example `Retry DOCX generation/render and finish application pack`;
- never claim the pack is complete and never synthesize missing file URLs;
- if the failure is plausibly transient and another supported generation/render path is available in the current run, try that supported path before accepting the blocked state.

Generic phrases such as `could not finish`, `tool issue`, `later`, or silent omission are not valid blocker records. The blocker must identify the failed step and evidence enough context for a later retry.

## Backpressure and batch behavior

High-fit pack completion takes precedence over finding more high-fit rows.

- Finish or explicitly block one newly inserted `Fit % > 60%` vacancy before ingesting the next new high-fit vacancy.
- Do not trade application-pack completeness for larger discovery volume.
- If the environment starts failing on DOCX generation, rendering, Drive writes, or other mandatory pack steps, stop adding further high-fit vacancies after recording the current explicit blocker. Continue searching only when doing so cannot create additional incomplete high-fit tracker rows.
- Low-fit vacancies that do not cross the CV gate may legitimately remain reviewed without a CV, subject to the normal tracker rules.
- Existing rows are deduplication/history records during discovery: their `Stage` remains exactly as snapshotted at run start.

## Mandatory completion reconciliation

Before returning the final discovery result, re-read every row created during this run by immutable Row ID from its owning canonical partition and verify its final state. Also verify through aggregate `Jobs` that every pre-existing row touched or re-read during the run still has the same `Stage` captured in the run-start snapshot.

For each newly inserted row with displayed `Fit % > 60%`, confirm exactly one of the following:

1. application pack complete: verified `Vacancy file`, `CV`, and `Cover` links are present and Stage is `CV ready` in `Queue`, or a later evidenced lifecycle state in the correct canonical partition; or
2. explicit blocked state: `Notes` contains `CV BLOCKED:` with a specific cause and `Next action` contains the concrete recovery action; or
3. explicit user decline: the user's decision not to generate a CV is recorded concisely in `Notes`.

If any new high-fit row from the run has an empty `CV` without an explicit blocker or user decline, the discovery workflow is incomplete. Do not describe the run as successfully completed. Repair that new row before finishing, or record a real blocker if repair is impossible in the current run.

If a pre-existing row's `Stage` differs from the run-start snapshot and the current task contained no explicit status-changing instruction or direct lifecycle evidence, treat that as a discovery workflow violation: stop further writes, restore only if the agent itself can prove it caused the change without overwriting concurrent/user edits, otherwise report the conflict for reconciliation.

When the same run encounters an existing backlog row with `Fit % > 60%`, `Stage = Reviewed`, empty `CV`, and no explicit blocker, report it as an orphaned application-pack state if useful, but do not repair it or change its `Stage` as part of discovery. Repair requires a separate explicit workflow.

## Company blocker / rejection cooldown

`RU-root Companies!Blocker` is a company-level stop signal for discovery/outreach.

- A non-empty `Blocker` means: skip the company's careers scan, do not recommend applying, and do not initiate referral/recruiter outreach unless Anton explicitly overrides the blocker.
- A confirmed `Rejected` stage in the canonical tracker for a company present in `RU-root Companies` creates a default 90-calendar-day company cooldown from the rejection/last-contact date. Store a concise blocker such as `Rejected YYYY-MM-DD — cooldown until YYYY-MM-DD — <position>`.
- If several confirmed rejections exist, use the latest one and extend the cooldown from that date.
- An explicit user instruction not to pursue a company may create an indefinite blocker; state the reason/date instead of inventing an expiry.
- Do not create a blocker from silence, a generic talent-pool message, an application receipt, or an ambiguous status.
- When the cooldown has expired, verify the latest tracker evidence before clearing the blocker. Clear/override immediately if Anton explicitly instructs it.
- When a new confirmed rejection is recorded, update the matching `RU-root Companies` blocker in the same workflow when that company is present in the corporate inventory.

The blocker is company-level by design: its purpose is to avoid wasting effort by immediately knocking on another door at an employer that has just rejected Anton.
