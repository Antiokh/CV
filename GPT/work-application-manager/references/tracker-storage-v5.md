# WorkInterviews tracker storage v5

This file is the **single canonical operational contract** for WorkInterviews vacancy storage. It supersedes `tracker-storage-v4.md` and every copied/legacy tracker rule elsewhere. Other docs should link here instead of restating storage, routing, or salary-write semantics.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).

## 1. Physical vacancy ownership

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

## 2. Hard agent boundary

ChatGPT/agent/API vacancy-row writes are **Queue-only and Queue-stage-only**.

- Agents may create new vacancy rows only in Queue.
- Agents may update an existing vacancy row only when its Row ID currently resolves to Queue.
- Agent Stage writes are limited to Queue persistent stages: `To review`, `Reviewed`, `CV ready`.
- Agents must never write `Referral`, `Applied`, `Recruiter screen`, `Assessment`, `Interview`, `Technical interview`, `Final`, `Offer`, `Not a fit`, `Rejected`, `Withdrawn`, `Ghosted`, or `Closed` as an API substitute for UI routing.
- Agents must never insert/update/delete/move vacancy rows in Active, Low fit, Closed or Jobs.
- If lifecycle evidence concerns a Row ID outside Queue, record/report the evidence according to `activity-log.md`; do not mutate the owning vacancy row.
- If a Queue row already has a valid Date applied, treat it as an inconsistency requiring human/UI reconciliation; never clear the date or route it by API.

This intentionally sacrifices some automatic updates of `Last contact` / `Next action` on Active rows in exchange for protection against status corruption. Detailed post-application process history is canonical in Activity Log.

## 3. Deduplication and concurrency

Before every Queue write:

1. Resolve identity through aggregate Jobs.
2. Prefer immutable Row ID when known.
3. Check Vacancy URL and normalized Company + Position; Apply URL is supporting evidence.
4. If the existing Row ID is in Active / Low fit / Closed, stop the vacancy-row mutation; do not recreate it in Queue.
5. If it is in Queue, freshly resolve that exact Row ID immediately before writing.
6. Update only intended source cells; never rewrite a whole existing row for a small change.
7. Read back the written values and Row ID.
8. Re-check Jobs for duplicate identity/Row ID.

Queue Y (`Duplicate elsewhere`) is a secondary exact duplicate warning. It does not replace the normalized aggregate preflight.

## 4. Queue integrity gate

Queue Z is `Queue integrity` and is machine-readable. An agent must read it back after every Queue insert/update it claims as successful.

Core completeness requires supported values for Company, Position, numeric Fit %, Queue Stage, Vacancy file, Archetype, Location, Vacancy URL, native Date found, Next action, Vacancy snapshot, Notes and Row ID.

For displayed Fit > 60%, completion additionally requires:

- `Salary Data!J = OK` for the same Row ID;
- verified CV URL;
- verified Cover URL.

`Salary expectation` is never inferred. It is populated only from Anton's explicit current confirmed expectation.

If Queue Z is not exactly `OK`, do not call the vacancy complete; fix supported data or report the specific blocker.

## 5. Structured salary contract

Salary storage is **not** free text in vacancy column F and is **not** annual EUR in AF.

Hidden `Salary Data` is keyed by Row ID:

| Col | Field | Contract |
|---|---|---|
| A | Row ID | exact vacancy Row ID; unique |
| B | Range min / month | native numeric source-currency amount |
| C | Range max / month | native numeric source-currency amount |
| D | Currency | 3-letter ISO code, e.g. EUR/USD/RSD |
| E | Type | exactly `NET` or `GROSS` |
| F | FX EUR per unit | static native numeric point-in-time rate |
| G | Range min EUR/month | formula |
| H | Range max EUR/month | formula |
| I | Midpoint EUR/month | formula |
| J | Normalization status | formula/integrity state |
| K:L | Legacy audit | read-only historical migration evidence |

Agent Salary Data writes are a narrow Queue-only auxiliary exception: an agent may upsert Salary Data only while the same Row ID is currently owned by Queue. It must never create a duplicate Salary Data Row ID.

Normalize estimates to monthly source-currency amounts: annual /12, weekly *52/12, hourly *2080/12. Fixed salary may use min=max. Never invent a missing bound for a one-sided range. Equity/bonus/OTE are not folded into B/C.

For non-EUR estimates store one verified point-in-time FX rate and keep it static. EUR uses 1. Never use live `GOOGLEFINANCE` for canonical history.

Vacancy F is `Estimated salary (EUR/month)` and is formula-derived from Salary Data. Vacancy AF is `Salary midpoint EUR/month` and is also formula-derived. **Never write literal values into F or AF.** Salary provenance belongs in the native note on F.

## 6. Native field types

Agent/API writes must use native values:

- Fit %: native number 0..1, displayed as a whole percent.
- Posted date / Date found: native Google Sheets dates displayed `yyyy-mm-dd`, not date-looking strings.
- URLs: valid absolute HTTP(S); Apply URL may be `mailto:` only when email is the actual application channel.
- Salary Data B/C/F: native numbers.
- Salary Data D: uppercase ISO code.
- Salary Data E: `NET` or `GROSS`.

Read back effective values/formats where type correctness matters. API writes do not trigger UI normalization.

## 7. Human/UI lifecycle routing

There is one canonical bound Apps Script source:

`GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs`

It contains the only simple `onEdit(e)` entrypoint, field normalization, routing, Activity Log writes and integrity audit.

`workinterviews-simple-onedit.gs` is a deprecated tombstone and must not be installed.

**Do not create an installable `trackerOnEdit` trigger.** The canonical script deliberately ignores legacy installable invocations (`e.triggerUid`) and `installPartitionedTrackerAutomation()` removes any old `trackerOnEdit` triggers instead of creating one.

Routing:

- Queue -> `Apply` / `Applied`: normalize to `Applied`, fill Date applied only if blank, move to Active.
- Queue -> `Referral`: move to Active without fabricating Date applied.
- Queue -> `Not a fit`: move to Low fit.
- Queue -> `Closed`, `Rejected`, `Withdrawn`, `Ghosted`: move to Closed.
- Active -> supported Active stages: remain Active.
- Active -> `Rejected`, `Withdrawn`, `Ghosted`, `Closed`: move to Closed.
- Human nonblank Date applied on a pre-application Queue row: normalize to Applied and move to Active.
- A valid Date applied is a hard floor against regression to Queue/Low fit.

Moves preserve the same Row ID. Salary Data remains external and linked by Row ID.

## 8. Presentation/helper columns

- Queue X: `Referral candidates` presentation helper.
- Queue Y: `Duplicate elsewhere` exact duplicate guard.
- Queue Z: `Queue integrity` completion/type gate.
- AA:AE: reserved.
- W: immutable Row ID.
- F and AF: formula-derived salary fields.

Agents must preserve these formulas/helpers and never hardcode their displayed results.

## 9. Activity history

`Activity Log` is the canonical append-only process/correspondence timeline. Follow `activity-log.md`.

Logging an event is allowed even when the vacancy is in Active / Low fit / Closed because it does not mutate the vacancy row. A logged event does not itself authorize a Stage change.

For post-application email/recruiter activity, prefer complete Activity Log evidence over attempting to keep mutable process notes on a protected Active row.

## 10. Integrity audit

Run `auditPartitionedTracker()` after script deployment or when corruption is suspected. Current audit checks:

- Row ID uniqueness and Stage/partition placement;
- Queue duplicate flags;
- Jobs aggregate availability;
- computed F and AF formulas on physical vacancy rows;
- Queue Z presence and incomplete-state warnings;
- Salary Data duplicate Row IDs / invalid normalization states;
- Activity Log duplicate Source keys and orphan Row IDs.

Warnings may represent legitimate incomplete work. Errors indicate structural/integrity problems that should be resolved before further automated writes.

## 11. Installation

In WorkInterviews -> Extensions -> Apps Script:

1. Replace old tracker/onEdit code with the current contents of `workinterviews-partitioned-tracker.gs`.
2. Do **not** copy `workinterviews-simple-onedit.gs`.
3. Save.
4. Run `installPartitionedTrackerAutomation()` once and authorize it. It removes legacy installable `trackerOnEdit` triggers; it does not create a new edit trigger.
5. Run `auditPartitionedTracker()` and inspect the result.
6. Reload the spreadsheet and test one intended Stage transition through the dropdown.

Sheets API / connector writes never fire the simple UI edit trigger. Agent safety therefore remains enforced by the Queue-only boundary, native-value readback, Salary Data contract, duplicate preflight and Queue integrity Z.
