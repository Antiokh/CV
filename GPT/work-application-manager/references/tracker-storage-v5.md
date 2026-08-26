# WorkInterviews tracker storage v5

This file is the **single canonical vacancy storage / lifecycle write-boundary contract** for WorkInterviews. It supersedes `tracker-storage-v4.md` and every copied/legacy tracker-storage rule elsewhere.

Salary research/calculation/storage is separately canonical in `salary-normalization-v6.md`. Activity/process history is separately canonical in `activity-log.md`. Do not duplicate either contract here.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).

## Physical vacancy ownership

Each vacancy Row ID physically exists in exactly one lifecycle tab:

| Tab | Persistent Stage values | Agent vacancy-row writes |
|---|---|---|
| `Queue` | `To review`, `Reviewed`, `CV ready` | **Allowed** |
| `Active` | `Referral`, `Applied`, `Recruiter screen`, `Assessment`, `Interview`, `Technical interview`, `Final`, `Offer` | **Forbidden** |
| `Low fit` | `Not a fit` | **Forbidden** |
| `Closed` | `Rejected`, `Withdrawn`, `Ghosted`, `Closed` | **Forbidden** |

`Assessment` covers employer-requested tests, take-homes, online assessments and comparable evaluated exercises.

`Jobs` is the unified **read-only aggregate** over Queue / Active / Low fit / Closed. Never write into its spill range.

Column W is immutable `Row ID` (UUID v4). It is the durable vacancy identity across every move. Row numbers, Company and Position are never durable identifiers.

## Hard agent boundary

ChatGPT/agent/API vacancy-row writes are **Queue-only and Queue-stage-only**.

- New vacancy rows may be created only in Queue.
- Existing vacancy rows may be updated only when their Row ID currently resolves to Queue.
- Agent Stage writes are limited to Queue persistent stages: `To review`, `Reviewed`, `CV ready`.
- Never write `Referral`, `Applied`, `Recruiter screen`, `Assessment`, `Interview`, `Technical interview`, `Final`, `Offer`, `Not a fit`, `Rejected`, `Withdrawn`, `Ghosted`, or `Closed` into Queue as an API substitute for UI routing.
- Never insert/update/delete/move vacancy rows in Active, Low fit, Closed or Jobs.
- If lifecycle evidence concerns a Row ID outside Queue, record/report it through Activity Log; do not mutate the protected vacancy row.
- If a Queue row already has valid Date applied, treat it as requiring human/UI reconciliation. Never clear the date or route it by API.

This intentionally makes detailed post-application history canonical in Activity Log rather than allowing agents to mutate protected Active rows.

## Deduplication and concurrency

Before every Queue write:

1. Resolve identity through aggregate Jobs.
2. Prefer immutable Row ID when known.
3. Check Vacancy URL and normalized Company + Position; Apply URL is supporting evidence.
4. If the existing Row ID is in Active / Low fit / Closed, stop the vacancy-row mutation; never recreate it in Queue.
5. If it is in Queue, freshly resolve that exact Row ID immediately before writing.
6. Update only intended source cells; never rewrite a full existing row for a small change.
7. Read back written values and Row ID.
8. Re-check Jobs for duplicate identity/Row ID.

Queue Y (`Duplicate elsewhere`) is a secondary exact duplicate warning, not a substitute for normalized aggregate preflight.

## Queue integrity gate

Queue Z (`Queue integrity`) is the final machine-readable vacancy completion/type gate. Read it back after every Queue insert/update that an agent claims as successful.

Core completeness requires supported values for Company, Position, numeric Fit %, Queue Stage, Vacancy file, Archetype, Location, Vacancy URL, native Date found, Next action, Vacancy snapshot, Notes and Row ID.

Salary completion requirements are defined exclusively by `salary-normalization-v6.md`. Current salary-v6 rule: a Queue vacancy must not remain `Reviewed` or `CV ready` unless its matching Salary Data row has `Normalization status = OK`; high-fit completion also requires CV and Cover.

`Salary expectation` remains user-only and may be blank.

If Queue Z is not exactly `OK` for a state that is being claimed complete, fix supported data or report the specific blocker.

## Derived/helper fields

Agents must preserve formulas/helpers rather than hardcoding displayed output:

- Queue X: `Referral candidates` presentation helper.
- Queue Y: `Duplicate elsewhere` exact duplicate guard.
- Queue Z: `Queue integrity` gate.
- AA:AE: reserved.
- W: immutable Row ID.
- F: computed `Estimated salary (EUR/month)` from Salary Data.
- AF: computed `Salary midpoint EUR/month` from Salary Data.

All salary input/provenance/write mechanics belong to `salary-normalization-v6.md`.

## Native vacancy field types

Agent/API vacancy writes use native values:

- Fit %: number 0..1, displayed as whole percent.
- Posted date / Date found: native Google Sheets dates displayed `yyyy-mm-dd`, not date-looking strings.
- URLs: valid absolute HTTP(S); Apply URL may be `mailto:` only when email is the actual application channel.

Read back effective values/formats where type correctness matters. API writes do not trigger UI normalization.

## Human/UI lifecycle routing

There is one canonical bound Apps Script source:

`GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs`

It contains the only simple `onEdit(e)` entrypoint, field normalization, lifecycle routing, Activity Log writes and integrity audit.

`workinterviews-simple-onedit.gs` is a deprecated tombstone and must not be installed.

**Do not create a separate installable `trackerOnEdit` trigger.** The canonical script ignores legacy installable invocations (`e.triggerUid`), and `installPartitionedTrackerAutomation()` removes old `trackerOnEdit` triggers instead of creating one.

Routing:

- Queue -> `Apply` / `Applied`: normalize to `Applied`, fill Date applied only if blank, move to Active.
- Queue -> `Referral`: move to Active without fabricating Date applied.
- Queue -> `Not a fit`: move to Low fit.
- Queue -> `Closed`, `Rejected`, `Withdrawn`, `Ghosted`: move to Closed.
- Active -> supported Active stages: remain Active.
- Active -> `Rejected`, `Withdrawn`, `Ghosted`, `Closed`: move to Closed.
- Human nonblank Date applied on a pre-application Queue row: normalize to Applied and move to Active.
- Valid Date applied is a hard floor against regression to Queue/Low fit.

Moves preserve the same Row ID. Salary Data remains external and linked by Row ID.

## Activity history

`Activity Log` is the canonical append-only correspondence/process timeline. Follow `activity-log.md`.

Logging evidence is allowed for protected lifecycle partitions because it does not mutate the vacancy row. A logged event does not itself authorize a Stage change.

## Integrity audit

Run `auditPartitionedTracker()` after script deployment or whenever corruption is suspected. Current audit checks:

- Row ID uniqueness and Stage/partition placement;
- Queue duplicate flags;
- Jobs aggregate availability;
- computed F/AF formulas on physical rows;
- Queue Z presence/incomplete-state warnings;
- Salary Data duplicate Row IDs / non-OK normalization warnings;
- Activity Log duplicate Source keys and orphan Row IDs.

Warnings may reflect legitimate incomplete work. Errors indicate structural/integrity problems that should be resolved before further automated writes.

## Installation

In WorkInterviews -> Extensions -> Apps Script:

1. Replace old tracker/onEdit code with the current contents of `workinterviews-partitioned-tracker.gs`.
2. Do **not** copy `workinterviews-simple-onedit.gs`.
3. Save.
4. Run `installPartitionedTrackerAutomation()` once and authorize it. It removes legacy installable `trackerOnEdit` triggers; it does not create a new edit trigger.
5. Run `auditPartitionedTracker()` and inspect the result.
6. Reload the spreadsheet and test one intended Stage transition through the dropdown.

Sheets API / connector writes never fire simple UI `onEdit`. Agent safety remains enforced by the Queue-only boundary, fresh Row ID resolution, duplicate preflight, canonical salary-v6 rules and Queue integrity Z.
