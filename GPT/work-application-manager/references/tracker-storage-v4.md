# WorkInterviews tracker storage v4

This reference is the canonical tracker-storage model for candidate-side employment workflows.
It overrides older `Jobs is the sole writable source` / `Queue, Active, Low fit are formula views` text wherever that legacy wording still exists.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).

## Storage model

Vacancy records physically live in exactly one canonical tab:

| Canonical tab | Persistent Stage values |
|---|---|
| `Queue` | `To review`, `Reviewed`, `CV ready` |
| `Active` | `Referral`, `Applied`, `Recruiter screen`, `Interview`, `Technical interview`, `Final`, `Offer` |
| `Low fit` | `Not a fit` |
| `Closed` | `Rejected`, `Withdrawn`, `Ghosted`, `Closed` |

`Jobs` is a read-only aggregate formula view over those four physical stores. Never create, update, clear, sort, insert, delete, or route a canonical vacancy row in `Jobs`.

All four canonical tabs use the same A:AF physical schema. A:V remain the visible tracker fields, W is immutable `Row ID`, X:AE are reserved/presentation helpers, and AF is `Salary midpoint EUR/year`. Never change an existing Row ID during a move.

## UI routing semantics

The bound Apps Script source is `GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs`.

`Apply` is a UI command, not a durable Stage. The script immediately normalizes it to `Applied`.

- `Queue` -> `Apply` / `Applied`: set durable Stage `Applied`; if `Date applied` is blank, fill the current Europe/Belgrade date; move the record to `Active`.
- `Queue` -> `Referral`: move to `Active`; do not populate `Date applied`.
- `Queue` -> `Not a fit`: move to `Low fit`.
- `Queue` -> `Closed`, `Rejected`, `Withdrawn`, or `Ghosted`: move to `Closed`.
- `Active` -> `Rejected`, `Withdrawn`, `Ghosted`, or `Closed`: move to `Closed`.
- A user-entered nonblank `Date applied` is explicit application evidence. If the record is pre-application or `Referral`, normalize Stage to `Applied` and place it in `Active`.
- A valid `Date applied` is a hard floor: do not route the record back to `Queue` or `Low fit` by an automated regression.
- Explicit user reopening to a pre-application Stage routes to `Queue` only when the Date-applied floor is not violated. Explicit user reopening to a live hiring Stage routes to `Active`.

Sheets API / connector writes do not fire Apps Script edit triggers. Agents must execute the same routing themselves.

## Cross-partition lookup before every write

Immediately before any tracker write:

1. Search `Queue`, `Active`, `Low fit`, and `Closed` — never `Jobs` alone.
2. Resolve an existing record by immutable Row ID first when known.
3. Also check Vacancy URL and normalized Company + Position. A verified Apply URL is supporting identity evidence.
4. Freshly read the resolved physical row A:W plus AF immediately before writing.
5. If the same Row ID or vacancy identity appears in multiple canonical tabs, do not merge or delete automatically. Preserve data and report the conflict.

The Queue tab also has a formula-driven exact duplicate guard against `Active`, `Low fit`, and `Closed`, using Row ID, Vacancy URL, Apply URL, and Company + Position. A flagged Queue row is an integrity warning, not permission to delete either record. Agent preflight must remain stronger than this presentation guard.

## New vacancy creation

A genuinely new candidate vacancy normally starts in `Queue`.

After the final cross-partition duplicate check:

1. Generate one UUID v4 Row ID.
2. Freshly resolve the Queue insertion boundary.
3. In one Sheets `batchUpdate`, structurally insert/reserve the new destination row and write the complete initial record including Row ID. Preserve the A:AF schema and the Queue header-anchored duplicate helper.
4. Read back the new physical Queue row and verify Row ID plus every written value.
5. Search all four canonical tabs again for the Row ID and vacancy identity. There must be exactly one canonical record.

If direct evidence already places a newly recovered vacancy in a later lifecycle state, create it directly in the matching canonical partition rather than fabricating a Queue transition.

## Existing-record updates

For an update that does not change the storage bucket:

1. Re-resolve Row ID in the four canonical tabs.
2. Freshly read the physical source row.
3. Update only intended cells on that physical tab.
4. Read back and verify Row ID plus written values.
5. Re-run cross-partition identity search.

Never rewrite a complete row merely to change one field.

## Stage change that changes partitions

Use one Sheets `batchUpdate` transaction whenever the connector/API supports it:

1. Freshly resolve source sheet, source row, Row ID, and destination boundary.
2. Structurally insert/reserve one destination row in the destination canonical sheet.
3. Copy the current source A:W record to the destination with normal paste semantics so notes, formatting, validation, and rich cell metadata are preserved.
4. Copy AF separately. Do not copy X:AE presentation/helper cells between partitions.
5. Apply the intended Stage / Date applied changes to the destination row.
6. Delete the old source row in the same batch.
7. Read back the destination and verify the same Row ID and intended values.
8. Search all four canonical tabs. The Row ID must exist exactly once, in the expected partition.

Never implement a move as `create a second row now, clean up later`. If an atomic move cannot be completed, stop and report the blocker rather than risking duplicate lifecycle records.

## Monotonic lifecycle guard

Active progression remains:

`To review < Reviewed < CV ready < Referral < Applied < Recruiter screen < Interview < Technical interview < Final < Offer`

Automated research, discovery, Gmail checks, migrations, pack generation, and reconciliation may preserve or advance a live stage but may not regress it. `Rejected`, `Not a fit`, `Withdrawn`, `Ghosted`, and `Closed` are terminal branches and still require direct evidence or Anton's explicit instruction under the existing workflow rules.

A storage move must never be used as an excuse to reinterpret evidence. Migration between partitions preserves all existing vacancy metadata and only changes Stage when that change itself is evidenced.

## Jobs aggregate view

`Jobs` exists for combined reporting/search only. Its formula stacks `Queue`, `Active`, `Low fit`, and `Closed` and filters by nonblank Row ID.

- Treat `Jobs` row numbers as ephemeral presentation coordinates.
- Do not store durable links to a Jobs row number.
- Do not use Jobs as a target for Stage, Date applied, artifact links, recruiter fields, salary, notes, or ingestion.
- For any edit, resolve the physical canonical tab by Row ID first.

`Jobs Yesterday` remains a safety snapshot/reporting artifact, not a canonical write target.

## Bound Apps Script installation

The source file is versioned in GitHub, but the bound Apps Script project must contain it and have the installable edit trigger enabled.

Run `installPartitionedTrackerAutomation()` once inside the bound WorkInterviews Apps Script project. It creates only the `trackerOnEdit` installable trigger and refreshes Stage dropdown validation. API/agent routing remains independent because API writes do not fire edit triggers.
