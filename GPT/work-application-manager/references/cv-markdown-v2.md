# CV Markdown-first workflow v2

This is the current hard CV artifact/storage contract for candidate-side employment workflows. It supersedes `cv-markdown-v1.md` wherever v1 requires an agent to construct Markdown Drive export URLs or author multiple rich-text links inside the tracker `CV` cell.

Converter:

- repository: `Antiokh/markdown-drive`
- production: `https://markdown-drive.pages.dev/`

## 1. Canonical authored artifact

The canonical tailored CV remains Markdown.

- Author, revise, fact-check and preserve `Anton_Nazarov<PositionTitle>.md`.
- Do not independently author or maintain Word/PDF as parallel editable sources.
- DOCX/PDF remain disposable derivatives of the current Markdown source.
- If Markdown changes, previously exported derivatives are stale.

The normal persistent application pack remains:

```text
WorkApplications/<Company>/<PositionTitle>/Position.md
WorkApplications/<Company>/<PositionTitle>/Anton_Nazarov<PositionTitle>.md
WorkApplications/<Company>/<PositionTitle>/Anton_Nazarov<PositionTitle>.txt
```

The TXT cover exists when required by the workflow. Persisted DOCX/PDF are optional.

## 2. Queue CV write contract

For a vacancy currently owned by `Queue`, the agent writes only the verified public canonical Markdown source URL into `Queue!CV`.

Agents must not:

- URL-encode the source URL for tracker presentation;
- construct `markdown-drive` DOCX/PDF URLs;
- build multiple hyperlink/rich-text runs in `CV`;
- write or repair `CV` in Active / Low fit / Closed.

The raw Markdown URL is therefore the API-write representation. The bound Apps Script converts it into the human-facing Queue presentation.

A new/current CV source must be a real Markdown source. Historical non-Markdown CV links may be preserved as legacy evidence during migration; do not relabel them as Markdown.

## 3. Queue-only presentation

Only `Queue!CV` needs the generated variant UI.

When the bound spreadsheet opens, the CV presentation helper scans Queue rows. If a Queue CV cell contains a canonical source URL, it replaces that raw source with visible text:

```text
DOCX PDF
```

where the two labels are separate rich-text hyperlinks to:

```text
https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=docx
https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=pdf
```

The source remains recoverable from either generated link.

The helper also recognizes an already-rendered `DOCX PDF` cell and leaves it unchanged.

## 4. Lifecycle copy semantics

Do not re-render CV presentation in Active / Low fit / Closed.

The canonical lifecycle script moves vacancy rows with `Range.copyTo(..., SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false)` across canonical columns A:W. That operation carries the already-formed Queue CV rich-text hyperlinks with the row.

Therefore:

- variant generation belongs only to Queue;
- a human Stage move copies the current CV presentation as part of the row;
- later lifecycle partitions keep that copied presentation snapshot;
- agents remain forbidden from writing protected lifecycle rows merely to refresh CV links.

`Jobs` is a formula aggregate and may not preserve rich-text link metadata. It remains a read/index surface, not the place to recover CV links for mutation.

## 5. CV ready gate

For Fit > 60%, the CV artifact requirement is satisfied when:

- the canonical Markdown source has been created, verified and publicly readable;
- `Queue!CV` contains either that verified raw source URL awaiting UI rendering or the derived `DOCX PDF` presentation generated from it;
- required Cover exists and is verified;
- Salary Data normalization passes;
- Queue integrity passes;
- Markdown content QA passes.

Because connector/API writes do not fire simple Apps Script triggers, a newly written raw Markdown URL may remain visible until the spreadsheet is next opened. This is acceptable: the source is already valid and Queue Z sees a nonblank CV value. The next UI open deterministically renders the variants.

## 6. Markdown authoring contract

Write semantic, renderer-independent Markdown:

- clear heading hierarchy;
- ordinary paragraphs;
- compact bullets;
- normal Markdown links;
- concise emphasis where useful.

Avoid HTML/CSS layout hacks, fake spacing/columns, decorative layout machinery, unnecessary tables and embedded images unless explicitly required.

## 7. Export and QA

Use Markdown Drive when a concrete Word/PDF derivative is requested or required by the submission channel.

- Markdown QA is mandatory for every tailored CV.
- DOCX/PDF visual QA is required only when that derivative is actually exported for final use/delivery.
- Missing persisted derivatives do not block `CV ready`.
- Never edit a derivative to diverge from Markdown; fix Markdown/theme and regenerate.

## 8. Migration compatibility

Existing rendered Queue `DOCX PDF` cells remain valid. Existing Active / Low fit / Closed CV links remain untouched.

When a legacy rendered Queue cell must be rebuilt, recover the encoded source URL from either Markdown Drive link and re-render deterministically. Do not browse or guess a missing source.

This file is the hard override for Queue CV source-write and presentation semantics until superseded by a later explicit rule.
