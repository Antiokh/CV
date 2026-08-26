# CV Markdown-first workflow v1

This is the current hard CV artifact-format override for candidate-side employment workflows. It supersedes conflicting instructions that treat DOCX as the canonical authored CV, require a persisted DOCX for every high-fit vacancy, or make DOCX generation/visual QA a prerequisite for `CV ready`.

Converter:

- repository: `Antiokh/markdown-drive`
- production: `https://markdown-drive.pages.dev/`

`markdown-drive` reads Markdown into a canonical MDAST model and exports semantic DOCX from that same source and ThemeSpec. The CV workflow should therefore author and preserve Markdown, not independently author Word documents.

## Hard rule: Markdown is canonical

For every tailored CV, the canonical authored and stored source is Markdown.

- Author, revise, fact-check, diff, and preserve the CV as `.md`.
- Do not independently author or maintain a parallel DOCX version.
- DOCX is a disposable/derived export of the canonical Markdown source.
- If Markdown and a previously exported DOCX disagree, Markdown wins; regenerate DOCX rather than editing Word separately.
- Prefer storing only the Markdown CV in `WorkApplications` unless a specific application step requires a persistent DOCX copy.

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

A `.docx` is not a mandatory persistent fourth artifact anymore.

When an application channel requires Word, export the current Markdown through `markdown-drive`. A stored derivative may use the existing name `Anton_Nazarov_<PositionTitle>.docx`, but it is optional and replaceable.

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
6. Store the Markdown Drive URL in tracker `CV`.
7. Generate/update the cover letter according to the existing humanizer rules when required.
8. `CV ready` may be set when the canonical Markdown CV, required cover letter, salary gate, and tracker integrity requirements are satisfied. A persisted DOCX is not required.

Never generate a Word document first and reverse-engineer Markdown from it.

## DOCX export on demand

Export DOCX only when:

- the user explicitly asks for Word;
- the application/ATS requires `.docx`;
- a submission workflow needs an actual uploadable Word file;
- final rendering needs to be checked for that concrete submission.

Use `markdown-drive` as the preferred converter. The expected path is:

```text
canonical CV .md -> markdown-drive -> Preview/ThemeSpec -> Export DOCX
```

Do not silently substitute a separate DOCX authoring/rendering pipeline when `markdown-drive` is the intended converter. If the converter cannot be used in the current execution context, preserve/deliver the canonical Markdown and report DOCX export as the remaining submission step rather than fabricating an independently formatted Word copy.

## DOCX QA semantics

Old rules that required DOCX visual QA for every generated CV are superseded.

- Markdown QA is mandatory for every CV.
- DOCX visual QA is required only when a DOCX is actually exported and is about to be used/delivered as a final submission artifact.
- A missing DOCX does not block `CV ready`.
- If a DOCX is exported, it must correspond to the current canonical Markdown revision. If the Markdown changes afterward, the old DOCX is stale and must be regenerated before submission.

## Tracker semantics

Tracker `CV` now points to the canonical Markdown CV file by default.

- Do not require a DOCX URL in `CV`.
- Do not clear/replace a valid Markdown `CV` URL merely because a DOCX has not been exported.
- If a persistent DOCX is created for a specific application, its existence may be recorded in Notes or submission evidence when useful, but it does not replace Markdown as canonical source.
- `CV ready` means the Markdown CV is ready to render/export, not that every possible output format has already been stored.

## Versioning

Major CV revisions should version/preserve Markdown, not proliferate DOCX files.

When a new Markdown revision becomes canonical:

- older DOCX exports are considered stale;
- regenerate Word only if still needed;
- never manually synchronize two editable sources.

This file is the hard override for CV artifact format until superseded by a later explicit rule.