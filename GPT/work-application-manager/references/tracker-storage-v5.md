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

All canonical tabs retain the same A:AF physical schema. A:V are the visible tracker fields, W is immutable `Row ID`, X:AE are presentation/helper space, and AF is `Salary midpoint EUR/year`.

## Hard agent write boundary

ChatGPT/agent/API vacancy-row mutations are Queue-only.

- Never insert, update, move, clear, sort, or delete vacancy rows in `Active`, `Low fit`, `Closed`, or the `Jobs` spill range.
- Never emulate the Apps Script partition move through the Sheets API.
- If a requested mutation belongs to a record already stored outside Queue, preserve that record and report the constraint rather than creating a second Queue copy.
- If a status change would route a Queue row out of Queue, the agent must not perform the cross-tab move itself. Human UI / bound Apps Script owns that transition.

This restriction is intentionally stricter than ordinary Row-ID-safe API updates. Its purpose is to prevent discovery/ingestion agents from corrupting already-applied or terminal application history.

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
4. Preserve Queue presentation helpers; do not overwrite X:AE.
5. Read back the new Queue row and verify Row ID plus every written value.
6. Search aggregate Jobs again. The new Row ID must exist exactly once.

Never create a new vacancy directly in Active, Low fit, Closed, or Jobs from an agent workflow under v5.

## Queue updates

For an existing Queue row:

1. Resolve it by immutable Row ID after aggregate/cross-partition dedup.
2. Freshly read the current Queue row immediately before writing.
3. Update only intended cells; never rewrite the complete row just to change one field.
4. Read back Row ID and every written value.
5. Re-check Jobs / physical partitions for duplicate identity conflicts.

Do not write a durable out-of-Queue Stage through the API as a substitute for the UI automation. API writes do not fire Apps Script `onEdit` triggers.

## Human/UI routing

The bound Apps Script source is:

`GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs`

The human-facing Stage dropdown includes `Apply` as an action. `Apply` is normalized to durable `Applied` by the script.

- Queue -> `Apply` / `Applied`: set Stage `Applied`; fill Date applied when blank; move the complete record with the same Row ID to Active.
- Queue -> `Referral`: move to Active without fabricating Date applied.
- Queue -> `Not a fit`: move to Low fit.
- Queue -> `Closed`, `Rejected`, `Withdrawn`, or `Ghosted`: move to Closed.
- Active -> `Rejected`, `Withdrawn`, `Ghosted`, or `Closed`: move to Closed.
- A human-entered nonblank Date applied on a pre-application Queue row normalizes Stage to Applied and moves it to Active.
- A valid Date applied is a hard floor against automated regression to Queue/Low fit.

The script copies the complete canonical A:W record and AF helper, preserves the Row ID, verifies the destination, then removes the old source row. X:AE presentation helpers are partition-local and are not carried between tabs.

## Queue presentation helpers

- X: `Referral candidates` — presentation-only names from the private LinkedIn Connections snapshot using the existing conservative exact Company Key match.
- Y: `Duplicate elsewhere` — hidden exact duplicate guard against Active / Low fit / Closed using Row ID, Vacancy URL, Apply URL, and Company + Position. Rows flagged `DUPLICATE` are highlighted.
- W remains the hidden immutable Row ID.
- Z:AE remain reserved.

## Jobs aggregate view

`Jobs` stacks Queue, Active, Low fit, and Closed and filters by nonblank Row ID.

- Treat Jobs row numbers as ephemeral presentation coordinates.
- Never write Stage, Date applied, recruiter data, artifact links, salary fields, notes, or new vacancy rows to Jobs.
- Read Jobs for combined reporting, deduplication, status/history snapshots, and Row ID discovery.
- Resolve writable vacancy mutations back to Queue; if the Row ID is not in Queue, v5 blocks the agent mutation.

`Jobs Yesterday` remains a safety snapshot/reporting artifact, not a canonical write target.

## Apps Script installation requirement

GitHub contains the canonical source, but UI movement becomes active only after that source is present in the spreadsheet's bound Apps Script project and its installable edit trigger is enabled.

Run `installPartitionedTrackerAutomation()` once in the bound WorkInterviews Apps Script project and authorize it. The function installs only the `trackerOnEdit` trigger and refreshes Stage dropdown validation.

Sheets API / connector writes do not fire this trigger. That is why the v5 Queue-only agent boundary is mandatory rather than relying on `onEdit` as an enforcement layer.
