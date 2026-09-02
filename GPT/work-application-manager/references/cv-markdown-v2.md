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

### Opaque source URLs

Some verified Markdown sources, especially Google Drive `https://drive.google.com/file/d/.../view` links, do not expose the filename or MIME type in the URL. Simple Apps Script triggers cannot inspect another Drive file because that would require authorization.

For a verified Markdown source whose URL is otherwise syntactically opaque, append the fragment marker:

```text
#markdown
```

Example:

```text
https://drive.google.com/file/d/<FILE_ID>/view?usp=drivesdk#markdown
```

The marker is a writer-side type attestation only. It is not sent to the source server, and the presentation helper strips it before constructing Markdown Drive export URLs. Do not add this marker unless the underlying source has already been verified as the canonical Markdown file and publicly readable.

No marker is required when the URL itself proves the source type, currently:

- an HTTP(S) URL whose path ends in `.md`;
- the historical Google Docs text-export form `/document/d/<ID>/export?...format=txt`.

This keeps Queue writes single-value and API-friendly while preventing the renderer from converting arbitrary historical HTTP(S) CV links.

## 3. Queue-only presentation

Only `Queue!CV` needs the generated variant UI.

When the bound spreadsheet opens, the CV presentation helper scans Queue rows. If a Queue CV cell contains a validated canonical source URL, it replaces that raw source with visible text:

```text
DOCX PDF
```

where the two labels are separate rich-text hyperlinks to:

```text
https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=docx
https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=pdf
```

The source remains recoverable from either generated link. A `#markdown` type marker is removed before the source is encoded, so export links contain the clean canonical source URL.

The helper also recognizes an already-rendered `DOCX PDF` cell and leaves it unchanged. A raw URL that does not pass the Markdown-source validation is also left unchanged; this preserves historical non-Markdown CV evidence rather than silently relabeling it.

## 4. Lifecycle copy semantics

Do not re-render CV presentation in Active / Low fit / Closed.

The canonical lifecycle script moves vacancy rows with `Range.copyTo(..., SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false)` across canonical columns A:W. Immediately before a Queue row is copied out of Queue, it invokes the Queue renderer for that row. Therefore a newly written validated raw Markdown source is synchronously converted to `DOCX PDF` even if the spreadsheet was already open and no selection/open sync occurred first.

Therefore:

- variant generation belongs only to Queue;
- a human Stage/Date-applied move first renders any pending validated Queue Markdown source, then copies the row;
- later lifecycle partitions keep that copied presentation snapshot;
- a historical/unverified CV link that is not a validated Markdown source is copied unchanged rather than rewritten;
- agents remain forbidden from writing protected lifecycle rows merely to refresh CV links.

`Jobs` is a formula aggregate and may not preserve rich-text link metadata. It remains a read/index surface, not the place to recover CV links for mutation.

## 5. CV ready gate

For Fit > 60%, the CV artifact requirement is satisfied when:

- the canonical Markdown source has been created, verified and publicly readable;
- `Queue!CV` contains either that verified raw source URL awaiting UI rendering or the derived `DOCX PDF` presentation generated from it;
- opaque raw source URLs carry the `#markdown` marker so the bound simple trigger can distinguish them from legacy non-Markdown links;
- required Cover exists and is verified;
- Salary Data normalization passes;
- Queue integrity passes;
- Markdown content QA passes.

Because connector/API writes do not fire simple Apps Script triggers, a newly written raw Markdown URL may remain visible until the spreadsheet is next opened, the row selection changes, manual sync is run, or a lifecycle move occurs. This is acceptable: the source is already valid and Queue Z sees a nonblank CV value. Any later Queue presentation path deterministically renders validated sources before they leave Queue.

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

Historical raw Queue links that are not verified Markdown sources remain unchanged. Do not add `#markdown` merely to make them render.

When a legacy rendered Queue cell must be rebuilt, recover the encoded source URL from either Markdown Drive link and re-render deterministically. Do not browse or guess a missing source.

This file is the hard override for Queue CV source-write and presentation semantics until superseded by a later explicit rule.
