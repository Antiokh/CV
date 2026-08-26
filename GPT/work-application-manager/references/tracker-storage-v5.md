# WorkInterviews tracker storage v5

This is the current hard storage/write boundary for candidate-side employment workflows. It supersedes `tracker-storage-v4.md` and older instructions that treat `Jobs` as writable, allow agents to route vacancy rows between lifecycle sheets, or store salary as free text in F / annual EUR in AF.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).

## Physical vacancy storage

Each vacancy record physically exists in exactly one canonical tab:

| Canonical tab | Persistent Stage values | Agent vacancy-row writes |
|---|---|---|
| `Queue` | `To review`, `Reviewed`, `CV ready` | **Yes** |
| `Active` | `Referral`, `Applied`, `Recruiter screen`, `Assessment`, `Interview`, `Technical interview`, `Final`, `Offer` | **No** |
| `Low fit` | `Not a fit` | **No** |
| `Closed` | `Rejected`, `Withdrawn`, `Ghosted`, `Closed` | **No** |

`Assessment` covers employer-requested test assignments, take-home tasks, online assessments and comparable evaluated exercises. It remains an `Active` lifecycle stage until the employer explicitly advances or closes the process.

`Jobs` is a read-only aggregate over the four physical stores and is the preferred combined read/search surface.

Canonical tabs retain A:AF. A:V are tracker fields, W is immutable `Row ID`, X:AE are presentation/helper space, and AF is the derived `Salary midpoint EUR/month`. In Queue, R `Date applied` and S `Last contact` are hidden because normal discovery/ingestion must not populate them.

## Hard agent write boundary

ChatGPT/agent/API vacancy-row mutations are Queue-only.

- Never insert, update, move, clear, sort, or delete vacancy rows in `Active`, `Low fit`, `Closed`, or the `Jobs` spill range.
- Never emulate Apps Script partition movement through the Sheets API.
- Resolve identity in aggregate `Jobs`, then resolve the same immutable Row ID in Queue immediately before any permitted vacancy-row write.
- If a record is owned by another partition, preserve it and report the constraint instead of creating a second Queue copy.
- Do not populate Queue `Date applied` or `Last contact` during normal discovery/analysis.

Two auxiliary stores are narrow exceptions because they are not vacancy-row ownership changes:

- `Activity Log` may append immutable Row-ID-linked history events according to its own rules.
- hidden `Salary Data` may be inserted/updated only for a Row ID whose vacancy is currently owned by Queue, according to the salary rules below.

## Queue completeness gate

Queue hidden Z is `Queue integrity`, the machine-readable completion contract.

Every new Queue row and every Queue row an agent claims to have completed must be freshly read back. `Queue integrity` must equal exactly `OK` before success is reported.

Core required fields are Company, Position, numeric Fit %, Stage, Vacancy file, Archetype, Location, Vacancy URL, native Date found, Next action, Vacancy snapshot, Notes, and immutable Row ID. Posted date may be blank only when precise evidence is unavailable; when populated it must be a native date.

For displayed Fit strictly above 60%, all of the following are additionally required:

- matching `Salary Data` row with `Normalization status = OK`;
- verified CV URL;
- verified Cover URL.

`Salary expectation` is deliberately not model-generated. It may contain only Anton's explicit current confirmed expectation.

An incomplete high-fit salary/CV/Cover state is a blocker, not permission to invent data. Queue visually highlights missing high-fit data, but Z is the enforcement surface.

## Structured salary schema — current override

Salary is no longer stored as free text in canonical F.

Hidden `Salary Data` is keyed by immutable Row ID:

| Col | Field | Contract |
|---|---|---|
| A | Row ID | exact immutable vacancy Row ID; unique |
| B | Range min / month | native numeric amount in source currency |
| C | Range max / month | native numeric amount in source currency |
| D | Currency | 3-letter ISO code; use `RSD`, not `DIN` |
| E | Type | exactly `NET` or `GROSS` |
| F | FX EUR per unit | static numeric EUR per one source-currency unit |
| G | Range min EUR/month | derived |
| H | Range max EUR/month | derived |
| I | Midpoint EUR/month | derived |
| J | Normalization status | derived integrity status; must be `OK` for a complete high-fit vacancy |
| K | Legacy estimate text | read-only migration audit |
| L | Legacy midpoint EUR/year | read-only migration audit |

B:F are the canonical salary inputs. G:J are formulas. K:L exist only to preserve/migrate historical salary evidence and must not be used for new records.

### Monthly normalization

Every salary estimate must end as a monthly range before it is complete.

- annual -> divide by 12;
- weekly -> multiply by 52/12;
- hourly -> multiply by 2080/12;
- true fixed salary -> min = max;
- one-sided range -> do not invent the missing bound; find defensible supporting market evidence or leave salary incomplete;
- do not fold equity into B/C;
- bonus, OTE, equity and compensation-composition caveats belong in the visible salary note.

### Currency and FX

For a new non-EUR estimate, store one verified point-in-time FX rate in Salary Data F and keep it static. EUR uses `1`.

Never use `GOOGLEFINANCE` or another live FX formula for canonical salary history; historical values must not drift with exchange rates. The salary note must state the rate, rate date, and source.

Historical migration performed on 2026-08-26 used the previously stored EUR annual midpoint as a fixed conversion anchor where available, preserving the prior normalized salary instead of re-pricing old records at a new rate.

### Visible salary and heatmap

Canonical F is `Estimated salary (EUR/month)` and is a formula lookup from Salary Data. Example output:

- `€4.5k–6k gross/mo`
- `€950–1.2k net/mo`

Never write a literal value into canonical F. Write/update only its native Google Sheets note for provenance.

The note must include research date, salary source URL(s), original source range/currency/period, NET/GROSS basis, normalization method when the source was not monthly, FX source/rate for non-EUR data, geography/proxy caveats, and material compensation caveats.

AF is `Salary midpoint EUR/month`, also formula-derived and read-only. Heatmaps use AF, so all compared values have one currency and one period.

Salary Data remains external when a vacancy moves between Queue / Active / Low fit / Closed. Apps Script only needs to preserve immutable Row ID and canonical formulas; it does not copy or delete the Salary Data record.

## Native field contract

Agent/API writes must use native values, not strings that merely look correct.

- Fit %: native number 0..1; display as whole percent.
- Posted date / Date found: native Google Sheets dates displayed `yyyy-mm-dd`; never quoted/apostrophe-prefixed strings or TEXT/DATEVALUE wrappers.
- URL fields: absolute valid HTTP(S) URLs; Apply URL may be `mailto:` only when email is the actual application channel.
- Salary Data B/C/F: native numbers.
- Salary Data D: uppercase ISO currency.
- Salary Data E: NET or GROSS.

After agent writes, read back `effectiveValue` / `effectiveFormat` when type correctness matters. Sheets API writes do not trigger Apps Script normalization.

The spreadsheet-bound simple UI entrypoint is:

`GPT/work-application-manager/scripts/workinterviews-simple-onedit.gs`

It normalizes direct human edits for Fit %, dates, links, and Salary Data inputs before delegating lifecycle edits to `trackerOnEdit(e)`.

## Deduplication before Queue writes

Before inserting or changing a Queue vacancy:

1. Search aggregate Jobs for identity and current Row ID/Stage.
2. Match immutable Row ID first when known.
3. Check Vacancy URL and normalized Company + Position; Apply URL is supporting identity evidence.
4. If a match exists in Active / Low fit / Closed, do not recreate or mutate it.
5. If the match exists in Queue, freshly re-read that Queue row before writing.

Queue Y is a formula-driven exact duplicate guard against non-Queue partitions. It is secondary to the normalized preflight above.

## New vacancy creation

A genuinely new candidate vacancy is created in Queue only.

1. Generate one UUID v4 Row ID after cross-partition dedup.
2. Structurally reserve one Queue row.
3. Preserve/inherit system formulas: F computed salary, X referral candidates, Y duplicate guard, Z integrity, AF salary midpoint. Never hardcode their results.
4. Write supported source fields without replacing F/AF with literals.
5. For salary research, upsert one Salary Data record with the exact same Row ID and B:F structured inputs; no duplicate Salary Data Row IDs.
6. Put salary provenance in the native note on Queue F, not in its formula value.
7. Read back Queue values/types, Row ID, F, AF and Z; also read Salary Data J when high-fit.
8. Do not report completion until Z is `OK`.
9. Search Jobs again; the vacancy Row ID must exist exactly once.

## Queue updates

For an existing Queue row:

1. Resolve by immutable Row ID after aggregate dedup.
2. Freshly read immediately before writing.
3. Update only intended source cells; do not rewrite the full row for a small change.
4. Do not replace formula-derived F/AF.
5. Salary changes are upserts to the same Row ID in Salary Data B:F plus a provenance-note update on visible F.
6. Read back written values, native types and Queue Z.
7. If the workflow claims completion, Z must be `OK`.

Do not write a durable out-of-Queue Stage through the API as a substitute for UI routing.

## Human/UI lifecycle routing

Main tracker logic:

`GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs`

Simple edit entrypoint / normalizer:

`GPT/work-application-manager/scripts/workinterviews-simple-onedit.gs`

The simple `onEdit(e)` normalizes direct human edits, then delegates to `trackerOnEdit(e)`. A separate installable `trackerOnEdit` trigger must not coexist with it because the same edit could be processed twice.

Routing:

- Queue -> `Apply` / `Applied`: normalize to Applied, set Date applied if blank, move to Active.
- Queue -> `Referral`: move to Active without fabricating Date applied.
- Queue / Active -> `Assessment`: keep or move the record in Active as the employer-evaluated test/task stage.
- Queue -> `Not a fit`: move to Low fit.
- Queue -> `Closed`, `Rejected`, `Withdrawn`, `Ghosted`: move to Closed.
- Active -> `Rejected`, `Withdrawn`, `Ghosted`, `Closed`: move to Closed.
- Human nonblank Date applied on a pre-application Queue row -> normalize to Applied and move to Active.
- Valid Date applied is a hard floor against regression.

The vacancy move preserves the complete canonical A:W record and AF formula/helper and the same immutable Row ID. X:AE presentation helpers are partition-local. Structured salary is not moved because Salary Data is linked externally by Row ID.

## Queue presentation signals

- X `Referral candidates`: presentation-only names from the private LinkedIn Connections snapshot.
- Y `Duplicate elsewhere`: hidden exact duplicate guard.
- Z `Queue integrity`: hidden completion/type gate; agents must read it back and may never hardcode `OK`.
- Company A uses dark-green font when that company has confirmed prior application history in Active/Closed.
- Position B uses bright-red bold font when exact Company + Position exists in Active / Low fit / Closed.
- Salary F uses a five-band heatmap driven by homogeneous AF EUR/month values.
- Queue no longer bolds entire `Reviewed` / `CV ready` rows; those states are already inherent to the Queue workflow.
- W remains hidden immutable Row ID; AA:AE remain reserved.

## Jobs aggregate

`Jobs` stacks Queue, Active, Low fit, and Closed and filters by nonblank Row ID.

- Row numbers are ephemeral presentation coordinates.
- Never write vacancy data into Jobs.
- Read Jobs for combined reporting, deduplication, status/history snapshots and Row ID discovery.
- Resolve permitted vacancy mutations back to Queue.

`Jobs Yesterday` was retired and removed on 2026-08-26. Do not recreate it. Use physical partitions, immutable Row IDs, Activity Log, aggregate Jobs, and the retained full pre-migration backup for recovery/audit.

## Apps Script trigger mode

Direct human edits are handled by the spreadsheet-bound simple `onEdit(e)` from `workinterviews-simple-onedit.gs`; it calls `trackerOnEdit(e)` after normalization.

Do not create a separate installable `trackerOnEdit` on-edit trigger while the simple entrypoint is present.

Sheets API / connector writes do not fire UI edit triggers. Hard enforcement for agents therefore remains the Queue-only boundary, structured Salary Data contract, aggregate duplicate preflight, native-value readback, and Queue integrity Z gate.
