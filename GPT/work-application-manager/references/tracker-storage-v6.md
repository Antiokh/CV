# WorkInterviews tracker storage v6

This is the canonical WorkInterviews storage/lifecycle contract for CV/employment mode after the CV-column v7 migration. It supersedes `tracker-storage-v5.md` wherever column layout, CV presentation or helper-column addresses conflict.

Spreadsheet: `1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`.

## Storage surfaces

Physical vacancy storage remains partitioned:

- `Queue` — agent-writable working queue; persistent stages `To review`, `Reviewed`, `CV ready`.
- `Active` — applied/in-process records; agent read-only.
- `Low fit` — `Not a fit`; agent read-only.
- `Closed` — terminal records; agent read-only.
- `Jobs` — unified read-only aggregate over the four storage sheets. Never write into its spill range.

Cross-partition moves belong to the bound lifecycle Apps Script / human UI. API/connector writes do not fire `onEdit`.

`Row ID` is the durable vacancy identity. Company, Position and row number are not durable identity.

## Queue compaction invariant

Every agent WorkInterviews run starts its tracker work by compacting internal physical gaps in Queue.

On v7, determine an empty Queue row from exactly these three non-formula identity fields:

- A / `Company`
- B / `Position`
- Y / `Row ID`

Read their display values and compare `String(value ?? '').trim()` with the empty string. A row is deletable only when **all three trimmed values are empty**.

Do **not** use `isBlank()`; formula-owned cells may exist on an otherwise empty physical row. Do not include F, K, L, Z:AH or any other formula/helper field in the emptiness test.

Only internal gaps before the last populated A/B/Y row are compacted. Preserve trailing spare rows. Delete contiguous empty ranges bottom-up so earlier row coordinates cannot invalidate later deletion coordinates.

If any of A/B/Y is non-empty, do not delete that row. A partial identity is an integrity problem, not whitespace.

After compaction, physical Queue row numbers must be treated as invalidated cache. All subsequent mutations resolve the target again by immutable Row ID immediately before writing.

## Canonical vacancy columns

The physical storage sheets share this exact layout:

| Col | Header | Ownership / meaning |
|---|---|---|
| A | Company | vacancy data |
| B | Position | vacancy data |
| C | Fit % | native number, stored 0..1, displayed as percent |
| D | Stage | lifecycle stage |
| E | Salary expectation | vacancy/application data |
| F | Estimated salary (EUR/month) | formula-derived from Salary Data; never replace with a literal |
| G | Referral | vacancy/application data |
| H | Recruiter | vacancy/application data |
| I | Apply URL | absolute HTTP(S) or mailto: |
| J | CV MD | canonical verified Markdown source URL; the only authored CV tracker field |
| K | CV DOCX | formula-derived direct-export link from J; never write directly |
| L | CV PDF | formula-derived direct-export link from J; never write directly |
| M | Cover | individual persisted cover artifact URL when required |
| N | Vacancy file | individual persisted Position/vacancy artifact URL |
| O | Archetype | role archetype |
| P | Location | vacancy location/remote scope |
| Q | Vacancy URL | source vacancy URL |
| R | Posted date | native date |
| S | Date found | native date |
| T | Date applied | native date; lifecycle evidence |
| U | Last contact | native date |
| V | Next action | concrete next step |
| W | Vacancy snapshot | compact vacancy evidence/snapshot |
| X | Notes | working notes |
| Y | Row ID | immutable UUID v4 |
| Z | Referral candidates | Queue helper; formula-owned |
| AA | Duplicate elsewhere | Queue helper; formula-owned |
| AB | Queue integrity | Queue helper; formula-owned |
| AC:AG | Reserved | helper/reserved |
| AH | Salary midpoint EUR/month | formula-derived helper; never replace with a literal |

User-facing filters cover A:X. Y and helper columns are outside the normal filter surface.

## CV columns

J/K/L deliberately separate source state from presentation:

- `J / CV MD` stores the original verified Markdown source URL and remains inspectable/debuggable.
- `K / CV DOCX` is an ordinary per-row Google Sheets formula derived from J through `markdown-drive` with `export=docx`.
- `L / CV PDF` is the same with `export=pdf`.
- Agents, API clients and lifecycle scripts never write K or L.
- There is no `onOpen`, `onSelectionChange` or rich-text mutation for CV presentation.
- Every physical storage sheet owns the same per-row K/L formulas. There are no CV spill/array formulas.
- Lifecycle moves skip K:L. They copy A:J and M:Y; the destination rows already have local K/L formulas.

Preferred canonical Drive source for newly created CVs:

```text
https://drive.google.com/file/d/<FILE_ID>/view#markdown
```

The preferred underlying object is a public `text/markdown` file. Legacy rows may also point to native Google Docs whose names are `.md` / `.markdown` and whose document bodies contain literal Markdown. Public `markdown-drive` URL launch supports those Google Docs-backed sources through Drive `files.export`.

For both raw Drive files and legacy `docs.google.com/document/d/...` sources, K/L extract the same Drive file ID and construct the wrapper against:

```text
https://drive.google.com/file/d/<FILE_ID>/view#markdown
```

The `#markdown` fragment is part of the wrapper source URL and is preserved. It becomes `%23markdown` inside the encoded `file=` parameter.

Other accepted sources are:

1. public HTTP(S) URLs whose path explicitly ends in `.md`;
2. verified HTTP(S) sources carrying the terminal `#markdown` marker.

Never replace a legacy Google Doc with a different raw Markdown file merely because the filename matches. Different vacancy-tailored CVs may share filenames; source file ID/content is authoritative.

## Agent write policy

Vacancy-row agent writes are Queue-only. Active / Low fit / Closed are read-only to agents except Activity Log evidence is allowed as defined by `activity-log.md`.

On a new or repaired Queue row:

- write vacancy/application data only to authored columns;
- write the verified canonical Markdown CV source only to J;
- for new Drive-hosted CVs, prefer a real raw `text/markdown` Drive file URL; existing Google Docs-backed Markdown sources remain supported;
- never write or clear K/L manually;
- never replace F or AH formulas with literal salary values;
- never fabricate Row ID, dates, salary evidence, URLs or lifecycle evidence;
- read Queue AB after a mutation when the workflow requires Queue integrity confirmation.

## Lifecycle ownership

Queue persistent stages: `To review`, `Reviewed`, `CV ready`.

CV-state semantics:
- `To review` may contain a verified vacancy-owned **baseline** CV copied from the Archetype-routed canonical role template.
- `Reviewed` means review/enrichment has materially progressed; do not infer tailored-CV completion from this stage alone.
- `CV ready` requires a genuinely **tailored** vacancy-specific CV plus the current salary/cover/integrity/content gates. A baseline template copy alone can never justify `CV ready`.

Baseline routing is defined by `archetype-cv-routing-v1.md`.

Active stages: `Referral`, `Applied`, `Recruiter screen`, `Assessment`, `Interview`, `Technical interview`, `Final`, `Offer`.

Low fit stage: `Not a fit`.

Closed stages: `Rejected`, `Withdrawn`, `Ghosted`, `Closed`.

`Apply` is a UI transient normalized to `Applied` by the bound script.

If `Date applied` exists, a record cannot regress to Queue or Low fit. The lifecycle script owns the cross-sheet move and logs the event.

## Derived/helper formulas

The v7 migration preserves existing Queue helper formulas by inserting K:L after J, which lets Sheets shift formula references with the data. The canonical helper addresses are Z / AA / AB and salary midpoint AH.

`Jobs!A1` canonical aggregate after migration:

```gs
=LET(data,VSTACK(Queue!A2:AH,Active!A2:AH,'Low fit'!A2:AH,Closed!A2:AH),VSTACK(Queue!A1:AH1,FILTER(data,CHOOSECOLS(data,25)<>"")))
```

The durable aggregate key is column 25 (`Y / Row ID`).

## Apps Script contract

Canonical bound source files:

- `scripts/workinterviews-partitioned-tracker.gs` — lifecycle v7; one simple `onEdit(e)` entrypoint; column layout above; moves skip K:L.
- `scripts/workinterviews-sheet-schema.gs` — schema/validation/filter/conditional-format v7 for the shifted columns.
- `scripts/workinterviews-cv-presentation.gs` — no presentation triggers. It contains the one-time legacy migration and the formula-repair helper.

`repairCvDerivativeFormulas()` must reconstruct ordinary per-row K/L formulas that:

1. recognize both Drive `/file/d/<ID>/...` and Google Docs `/document/d/<ID>/...` sources;
2. normalize either Google source to `/file/d/<ID>/view#markdown`;
3. URL-encode the complete source URL, including `#markdown`;
4. render short hyperlink titles `DOCX` / `PDF`;
5. leave unsupported non-Markdown sources blank rather than creating a broken wrapper URL.

Do not install a second edit trigger. Do not restore the retired Queue rich-text CV renderer.

## Migration guard

The live spreadsheet must not be structurally migrated while old bound Apps Script code is still active. Old code hard-codes the pre-v7 positions and would route/edit wrong columns after K:L insertion.

Safe order:

1. replace the three bound source files with their current repository versions;
2. run `migrateWorkInterviewsCvColumnsV7()` once;
3. run `installPartitionedTrackerAutomation()`;
4. run `auditPartitionedTracker()` and resolve structural errors;
5. only then update live Agent Instructions to this v6 layout if they have not already been migrated atomically.

The migration is idempotent at the schema level: it recognizes either the complete legacy layout or the complete v7 layout and refuses a mixed/unknown state before structural writes.
