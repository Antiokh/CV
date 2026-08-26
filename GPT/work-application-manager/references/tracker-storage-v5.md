# WorkInterviews tracker storage v5

This is the current hard storage/write boundary for candidate-side employment workflows.
It supersedes `tracker-storage-v4.md` and any older instruction that treats `Jobs` as writable or allows ChatGPT/agents to move vacancy rows between canonical partitions.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).

## Physical storage model

Each vacancy record physically exists in exactly one canonical tab:

| Canonical tab | Persistent Stage values | Agent write access |
|---|---|---|
| `Queue` | `To review`, `Reviewed`, `CV ready` | **Yes** |
| `Active` | `Referral`, `Applied`, `Recruiter screen`, `Interview`, `Technical interview`, `Final`, `Offer` | **No** |
| `Low fit` | `Not a fit` | **No** |
| `Closed` | `Rejected`, `Withdrawn`, `Ghosted`, `Closed` | **No** |

`Jobs` is a read-only aggregate formula view over all four physical stores. It is the preferred combined read/search surface, but never a write target.

All canonical tabs retain the same A:AF physical schema. A:V are the canonical tracker fields, W is immutable `Row ID`, X:AE are presentation/helper space, and AF is `Salary midpoint EUR/year`. In Queue, R `Date applied` and S `Last contact` are hidden from the UI because they are not normal agent-ingestion fields; they remain physically present so row moves keep one stable schema.

## Hard agent write boundary

ChatGPT/agent/API vacancy-row mutations are Queue-only.

- Never insert, update, move, clear, sort, or delete vacancy rows in `Active`, `Low fit`, `Closed`, or the `Jobs` spill range.
- Never emulate the Apps Script partition move through the Sheets API.
- If a requested mutation belongs to a record already stored outside Queue, preserve that record and report the constraint rather than creating a second Queue copy.
- If a status change would route a Queue row out of Queue, the agent must not perform the cross-tab move itself. Human UI / bound Apps Script owns that transition.
- Do not populate Queue `Date applied` or `Last contact` during normal ingestion/analysis. Application evidence is routed by the human/UI lifecycle automation; correspondence/process history belongs in Activity Log.

This restriction is intentionally stricter than ordinary Row-ID-safe API updates. Its purpose is to prevent discovery/ingestion agents from corrupting already-applied or terminal application history.

## Queue completeness gate

Queue has a hidden Z column named `Queue integrity`. It is the machine-readable completeness contract for agent writes.

Every new Queue row, and every Queue row an agent claims to have completed, must be freshly read back after writing. `Queue integrity` must equal `OK` before the agent reports successful completion.

Core required fields are:

- Company
- Position
- Fit % as a native numeric percentage
- Stage
- Vacancy file
- Archetype
- Location
- Vacancy URL
- Date found as a native Sheet date
- Next action
- Vacancy snapshot
- Notes
- immutable Row ID

For displayed Fit % strictly above 60%, these are additionally mandatory:

- Estimated salary range
- AF `Salary midpoint EUR/year` as a native number
- verified CV URL
- verified Cover URL

`Salary expectation` is deliberately **not** a required model-generated field. It may only contain Anton's explicit current confirmed expectation and must never be inferred from vacancy or market data.

A missing/invalid high-fit salary/CV/Cover field is a blocker, not permission to invent data or report the row complete. An explicit Anton decline for one specific vacancy may waive CV/Cover; record the decline in Notes. This current rule supersedes older general preferences to omit per-role CV/cover for YC/profile-based application flows.

Queue visually highlights missing high-fit Estimated salary range, CV, Cover, or numeric AF midpoint. The visible formatting is a secondary signal; Z is the enforcement/readback surface.

## Native date contract

Queue `Posted date` and `Date found` must be native Google Sheets dates, not date-looking text.

- Through the Sheets API write the date as a numeric Sheet serial and apply/display the `yyyy-mm-dd` number format.
- Never write a quoted/escaped string, a leading-apostrophe value, or a `TEXT`/`DATEVALUE` formula merely to make a string look like a date.
- Immediately read back `effectiveValue`; a populated valid date must be a numeric value (`numberValue`), not `stringValue`.
- `Date found` is required for every Queue vacancy.
- `Posted date` may be blank only when precise publication evidence is genuinely unavailable. If populated, it must also be a native date.

Existing Queue date-like text values were normalized to native numeric dates on 2026-08-26.

## Deduplication before every Queue write

Before inserting or changing a Queue vacancy:

1. Read/search the aggregate `Jobs` view for the vacancy identity and current Row ID/Stage.
2. Also verify the physical canonical tabs when needed to resolve location or conflicts.
3. Match immutable Row ID first when known.
4. Check Vacancy URL and normalized Company + Position; use a verified Apply URL as supporting identity evidence.
5. If a match exists in `Active`, `Low fit`, or `Closed`, do not recreate it in Queue and do not mutate the owning tab. Report the existing record/location instead.
6. If a match exists in Queue, freshly re-read that Queue row A:W plus AF and update only intended fields.

The Queue sheet also contains a formula-driven exact duplicate guard against the three non-Queue partitions. It is a secondary integrity signal, not a substitute for the normalized preflight above.

## New vacancy creation

A genuinely new candidate vacancy is created in Queue only.

After the final cross-partition duplicate check:

1. Generate one UUID v4 Row ID.
2. Freshly resolve the Queue insertion boundary.
3. Use one `spreadsheets.batchUpdate` call that structurally inserts/reserves one Queue row and writes the complete initial record including Row ID.
4. Preserve Queue presentation helpers. X/Y/Z are system-owned helper columns; never replace their formulas/results with hardcoded values. AA:AE stay reserved.
5. Ensure the inserted row inherits/contains the Queue Z integrity formula. If structural insertion leaves Z blank, copy the adjacent Queue Z formula into that row; never hardcode `OK`.
6. Read back the new Queue row, native date value types, Row ID, AF, and Z.
7. Do not report the row complete while Z is anything other than `OK`.
8. Search aggregate Jobs again. The new Row ID must exist exactly once.

Never create a new vacancy directly in Active, Low fit, Closed, or Jobs from an agent workflow under v5.

## Queue updates

For an existing Queue row:

1. Resolve it by immutable Row ID after aggregate/cross-partition dedup.
2. Freshly read the current Queue row immediately before writing.
3. Update only intended cells; never rewrite the complete row just to change one field.
4. Read back Row ID, every written value, native date types, AF, and Queue integrity Z.
5. If the workflow claims the vacancy/pack is complete, Z must be `OK`; otherwise continue the required work or report the concrete blocker instead of claiming success.
6. Re-check Jobs / physical partitions for duplicate identity conflicts.

Do not write a durable out-of-Queue Stage through the API as a substitute for the UI automation. API writes do not fire Apps Script `onEdit` triggers.

## Human/UI routing

The tracker logic source is:

`GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs`

The bound spreadsheet also uses the simple edit entrypoint:

`GPT/work-application-manager/scripts/workinterviews-simple-onedit.gs`

The simple `onEdit(e)` delegates direct human spreadsheet edits to `trackerOnEdit(e)`. A separate installable `trackerOnEdit` trigger is not required and should not coexist with the simple entrypoint, because one edit could otherwise be processed twice.

The human-facing Stage dropdown includes `Apply` as an action. `Apply` is normalized to durable `Applied` by the script.

- Queue -> `Apply` / `Applied`: set Stage `Applied`; fill Date applied when blank; move the complete record with the same Row ID to Active.
- Queue -> `Referral`: move to Active without fabricating Date applied.
- Queue -> `Not a fit`: move to Low fit.
- Queue -> `Closed`, `Rejected`, `Withdrawn`, or `Ghosted`: move to Closed.
- Active -> `Rejected`, `Withdrawn`, `Ghosted`, or `Closed`: move to Closed.
- A human-entered nonblank Date applied on a pre-application Queue row normalizes Stage to Applied and moves it to Active.
- A valid Date applied is a hard floor against automated regression to Queue/Low fit.

The script copies the complete canonical A:W record and AF helper, preserves the Row ID, verifies the destination, then removes the old source row. X:AE presentation helpers are partition-local and are not carried between tabs.

## Queue presentation helpers and visual signals

- X: `Referral candidates` — presentation-only names from the private LinkedIn Connections snapshot using the existing conservative exact Company Key match.
- Y: `Duplicate elsewhere` — hidden exact duplicate guard against Active / Low fit / Closed using Row ID, Vacancy URL, Apply URL, and Company + Position. Rows flagged `DUPLICATE` are highlighted.
- Z: `Queue integrity` — hidden required-field/type gate described above. Agents must read it back after writes and may not hardcode its result.
- Company (A) uses dark-green font when the same company has at least one record in Active or Closed with a nonblank `Date applied`; this means there is confirmed prior application history with that company.
- Position (B) uses bright-red bold font when the same exact Company + Position pair exists in Active, Low fit, or Closed.
- Missing high-fit Estimated salary range / CV / Cover / numeric AF midpoint and invalid Queue dates are highlighted red.
- W remains the hidden immutable Row ID.
- AA:AE remain reserved.

## Jobs aggregate view

`Jobs` stacks Queue, Active, Low fit, and Closed and filters by nonblank Row ID.

- Treat Jobs row numbers as ephemeral presentation coordinates.
- Never write Stage, Date applied, recruiter data, artifact links, salary fields, notes, or new vacancy rows to Jobs.
- Read Jobs for combined reporting, deduplication, status/history snapshots, and Row ID discovery.
- Resolve writable vacancy mutations back to Queue; if the Row ID is not in Queue, v5 blocks the agent mutation.

`Jobs Yesterday` was retired and removed on 2026-08-26. Do not recreate it. Recovery/audit should use the physical canonical partitions, immutable Row IDs, Activity Log, aggregate Jobs view, and the retained full pre-migration backup.

## Apps Script trigger mode

Direct human edits are handled by the spreadsheet-bound simple `onEdit(e)` entrypoint from `workinterviews-simple-onedit.gs`, which calls `trackerOnEdit(e)` in the main tracker script.

Do not create a separate installable `trackerOnEdit` on-edit trigger while the simple entrypoint is present.

Sheets API / connector writes do not fire the UI routing trigger. That is why the v5 Queue-only agent boundary plus Queue integrity readback are mandatory rather than relying on `onEdit` as an enforcement layer.
