# CV Markdown-first workflow v1

This is the current hard CV artifact-format override for candidate-side employment workflows. It supersedes conflicting instructions that treat DOCX as the canonical authored CV, require a persisted DOCX for every high-fit vacancy, make DOCX generation/visual QA a prerequisite for `CV ready`, or require the tracker `CV` cell to expose the raw Markdown URL.

Converter:

- repository: `Antiokh/markdown-drive`
- production: `https://markdown-drive.pages.dev/`

`markdown-drive` reads Markdown into a canonical MDAST model and exports semantic DOCX or PDF from that same source and ThemeSpec. The CV workflow should therefore author and preserve Markdown, not independently author Word/PDF documents.

## Hard rule: Markdown is canonical

For every tailored CV, the canonical authored and stored source is Markdown.

- Author, revise, fact-check, diff, and preserve the CV as `.md`.
- Do not independently author or maintain a parallel DOCX or PDF version.
- DOCX/PDF are disposable/derived exports of the canonical Markdown source.
- If Markdown and a previously exported derivative disagree, Markdown wins; regenerate the derivative rather than editing it separately.
- Prefer storing only the Markdown CV in `WorkApplications` unless a specific application step requires a persistent derivative copy.

This rule exists to reduce storage and duplicated artifacts, simplify model editing, keep formatting deterministic, and make CV appearance consistent through one renderer/theme pipeline.

## Canonical application-pack files

For a high-fit vacancy, the persistent application pack is normally:

```text
WorkApplications/<Company>/<PositionTitle>/Position.md
WorkApplications/<Company>/<PositionTitle>/Anton_Nazarov<PositionTitle>.md
WorkApplications/<Company>/<PositionTitle>/Anton_Nazarov<PositionTitle>.txt
```

Roles:

- `Position.md` — canonical full vacancy source.
- `Anton_Nazarov<PositionTitle>.md` — canonical tailored CV.
- `Anton_Nazarov<PositionTitle>.txt` — final humanized cover letter when required by the workflow.

A `.docx` or `.pdf` is not a mandatory persistent artifact.

When an application channel requires a derivative, export the current Markdown through `markdown-drive`. A stored derivative may use the existing naming convention, but it is optional and replaceable.

## Markdown authoring contract

Write CV Markdown for semantic document conversion, not for browser-specific visual tricks.

Prefer:

- one clear H1/title area;
- H2/H3 section hierarchy;
- ordinary paragraphs;
- compact bullet lists;
- normal Markdown links;
- concise emphasis where materially useful.

Avoid:

- raw HTML/CSS for layout;
- manual spacing with repeated spaces/tabs;
- fake columns made from spaces;
- decorative Unicode used as layout machinery;
- unnecessary tables solely to force page geometry;
- embedded images unless explicitly required.

`markdown-drive` currently exports semantic headings, lists, links, tables, quotes and code styles. Images are conservative and may export as placeholders, so ordinary CVs should remain text-first.

The CV content should remain renderer-independent: formatting and page geometry belong to `ThemeSpec` / converter settings, not to ad-hoc Markdown hacks.

## CV generation workflow

When the automatic CV gate applies:

1. Create/update `Position.md` and verify vacancy evidence.
2. Select truthful role-specific evidence.
3. Draft the tailored CV directly as Markdown.
4. Review the Markdown for factual accuracy, ATS vocabulary, section order, concision, and conversion-safe structure.
5. Upload/update the Markdown file in the vacancy folder and verify Drive readback/shareability.
6. Build tracker `CV` as compact rich text `DOCX PDF` from the verified canonical Markdown URL according to the tracker-link contract below.
7. Generate/update the cover letter according to the existing humanizer rules when required.
8. `CV ready` may be set when the canonical Markdown CV, required cover letter, salary gate, tracker generator links and tracker integrity requirements are satisfied. Persisted DOCX/PDF files are not required.

Never generate a Word/PDF document first and reverse-engineer Markdown from it.

## Tracker CV direct-export link contract

The tracker `CV` cell is a presentation/export surface. It must display exactly:

```text
DOCX PDF
```

The two labels are separate rich-text hyperlinks in one cell, separated by one ordinary space.

For canonical Markdown source URL `SOURCE_URL`:

```text
DOCX -> https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=docx
PDF  -> https://markdown-drive.pages.dev/?file=<URL-ENCODED-SOURCE_URL>&export=pdf
```

Rules:

- URL-encode the complete canonical Markdown URL as the `file` value.
- `DOCX` links to `export=docx`; `PDF` links to `export=pdf`.
- Do not expose the raw Drive/GitHub Markdown URL as the visible tracker value.
- Do not point `CV` directly to a stored DOCX/PDF derivative.
- The canonical Markdown source remains recoverable from either generator link and remains the source of truth.
- The Markdown source must be publicly readable according to the WorkApplications sharing contract before generator links are considered valid.
- For a legacy native Google Doc or other non-Markdown source, first migrate/replace it with a real `.md` file; do not fabricate generator links to a non-Markdown source.
- When writing through the Sheets API, preserve the two independent hyperlink runs; a plain literal `DOCX PDF` without links does not satisfy the contract.
- Read back `textFormatRuns`/link metadata after writing when the connector supports it.

This compact tracker representation replaces the older rule that `CV` directly stores the raw Markdown Drive URL.

## Export on demand

Use `markdown-drive` when:

- the user explicitly asks for Word or PDF;
- the application/ATS requires a concrete derivative;
- a submission workflow needs an actual uploadable file;
- final rendering needs to be checked for that concrete submission.

The tracker direct-export links are launch intents, not evidence that a derivative has been persisted.

Expected path:

```text
canonical CV .md -> markdown-drive -> Preview/ThemeSpec -> Export DOCX/PDF
```

Do not silently substitute a separate authoring/rendering pipeline when `markdown-drive` is the intended converter. If the converter cannot be used in the current execution context, preserve/deliver the canonical Markdown and report derivative export as the remaining submission step rather than fabricating an independently formatted copy.

## DOCX/PDF QA semantics

Old rules that required derivative visual QA for every generated CV are superseded.

- Markdown QA is mandatory for every CV.
- DOCX/PDF visual QA is required only when that derivative is actually exported and is about to be used/delivered as a final submission artifact.
- Missing persisted derivatives do not block `CV ready`.
- If a derivative is exported, it must correspond to the current canonical Markdown revision. If the Markdown changes afterward, the old derivative is stale and must be regenerated before submission.

## Tracker semantics

Tracker `CV` uses the compact direct-export representation, while Markdown remains canonical.

- Visible value: `DOCX PDF`.
- Two independent hyperlinks: markdown-drive `export=docx` and `export=pdf` using the same canonical Markdown source URL.
- Do not replace these generator links with a raw Markdown URL merely because no derivative is stored.
- Do not treat generator links as persisted artifact URLs.
- If a persistent derivative is created for a specific application, its existence may be recorded in Notes or submission evidence when useful, but it does not replace Markdown as canonical source.
- `CV ready` means the Markdown CV is ready to render/export and the tracker provides working export intents; it does not mean every output format has already been stored.

## Versioning

Major CV revisions should version/preserve Markdown, not proliferate DOCX/PDF files.

When a new Markdown revision becomes canonical:

- tracker DOCX/PDF links must be rebuilt if the canonical source URL changed;
- older derivatives are considered stale;
- regenerate derivatives only if still needed;
- never manually synchronize multiple editable sources.

This file is the hard override for CV artifact format and tracker CV export-link semantics until superseded by a later explicit rule.