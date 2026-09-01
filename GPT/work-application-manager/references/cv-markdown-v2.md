# CV Markdown-first workflow v2

This is the current hard CV artifact/storage contract for candidate-side employment workflows. It supersedes `cv-markdown-v1.md` wherever v1 requires an agent to construct Markdown Drive URLs, write `DOCX PDF` rich-text runs into a vacancy row, or use the visible tracker `CV` cell as canonical artifact storage.

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

## 2. Hidden Artifacts registry

WorkInterviews has a hidden `Artifacts` sheet keyed by immutable vacancy Row ID.

Canonical v1 schema:

| Column | Field | Ownership |
|---|---|---|
| A | Row ID | immutable vacancy foreign key |
| B | CV Source URL | agent-writable verified source URL |
| C | Source kind | `markdown` for new canonical CVs; `legacy` only for migrated historical sources |
| D | Updated at | informational timestamp |

Rules:

- one Artifacts row per Row ID; upsert by exact Row ID, never duplicate;
- new/current CV generation writes the publicly readable canonical Markdown URL to `Artifacts!B` and `markdown` to `Artifacts!C`;
- `legacy` is migration compatibility only and must not be used for a newly authored CV;
- Artifacts is auxiliary artifact storage, not lifecycle storage, so its row remains stable when a vacancy moves Queue -> Active / Low fit / Closed;
- artifact recovery/migration may update Artifacts for an existing Row ID in any lifecycle partition without mutating that vacancy row;
- verify the source file and required public sharing before calling the Artifacts entry valid.

## 3. Agent write boundary

Agents do **not** write vacancy column J (`CV`).

Agents must not:

- URL-encode the Markdown source for tracker presentation;
- construct `markdown-drive` preview/export URLs for the tracker;
- create multiple hyperlink runs in `CV`;
- use `CV` display text as proof that the canonical source exists;
- repair a missing/stale presentation link by overwriting Queue/Active/Low fit/Closed J.

The agent task ends at the verified canonical source + Artifacts upsert.

This deliberately separates facts from presentation: the agent stores the source; deterministic spreadsheet/script logic renders the UI.

## 4. Tracker CV presentation

Vacancy column J is a derived presentation surface.

For a canonical source URL `SOURCE_URL`, Markdown Drive Preview is:

```text
https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>
```

Derived exports remain:

```text
https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=docx
https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=pdf
```

The bound presentation helper may render a compact single `CV` link to Preview or another deterministic presentation approved by Anton. The canonical URL always remains in Artifacts, never hidden inside the presentation as its only storage location.

Important UI constraint: Google Sheets rich-link smart chips are not a portable representation for arbitrary external Markdown Drive exporter URLs. Do not make agent correctness depend on a chip. If two separate direct-export targets are ever required with true one-target-per-click behavior, use separate UI cells/controls rather than asking the agent to build multiple links inside one cell.

`Jobs` is a formula aggregate and may not preserve rich-text hyperlink metadata from physical partitions. This is expected. Resolve canonical CV source through Row ID -> Artifacts, not by scraping Jobs!J.

## 5. CV ready gate

For Fit > 60%, the CV artifact requirement is satisfied by a valid matching Artifacts record whose CV Source URL points to the verified/shareable canonical Markdown CV.

`CV ready` does not depend on vacancy J being freshly rendered. Presentation may lag source storage without invalidating the artifact.

Other gates remain unchanged:

- required Cover exists and is verified;
- Salary Data normalization passes;
- Queue integrity passes;
- Markdown content QA passes.

During migration only, an existing legacy CV presentation may remain usable while Artifacts is being backfilled. New CV work must use the Artifacts registry.

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

When migrating existing tracker data:

- extract the canonical source from valid legacy Markdown Drive links when possible and write it to Artifacts;
- preserve an old direct Google Doc/Drive CV URL as `Source kind = legacy` only when it is real historical evidence;
- do not relabel a non-Markdown historical source as canonical Markdown;
- migration must preserve source access before replacing any visible tracker presentation.

This file is the hard override for CV artifact registry/storage and tracker presentation semantics until superseded by a later explicit rule.
