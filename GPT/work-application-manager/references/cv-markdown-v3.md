# Canonical tailored CV: Markdown v3

This contract supersedes `cv-markdown-v2.md` wherever tracker CV presentation/storage semantics conflict. Authoring/evidence rules remain Markdown-first; source and derivatives are separate tracker columns.

## Canonical artifact

The canonical tailored CV artifact is Markdown stored in the vacancy/application folder. Markdown is the authored source of truth. DOCX/PDF are derivatives.

A tailored CV must use verified Anton evidence only. Vacancy wording may determine emphasis/order but cannot create facts, metrics, authority, team size, stack, dates or results.

## Tracker contract

WorkInterviews uses three distinct CV columns:

- `J / CV MD` — canonical public/accessible Markdown source URL;
- `K / CV DOCX` — per-row formula-derived `markdown-drive` DOCX export link;
- `L / CV PDF` — per-row formula-derived `markdown-drive` PDF export link.

Agents write only J. Agents do not construct or write K/L links, rich-text runs or encoded wrapper URLs.

The old model where Queue J was mutated from a raw source URL into visible rich-text `DOCX PDF` is retired. There is no CV presentation `onOpen` or `onSelectionChange` renderer.

Because J remains raw, debugging is direct: inspect J to validate the source; inspect K/L to validate the formula/export layer independently.

## Google Drive sources

Preferred form for a newly created Drive-hosted CV is a real Google Drive file with MIME type `text/markdown`, publicly readable by link:

```text
https://drive.google.com/file/d/<FILE_ID>/view#markdown
```

Legacy CVs may instead be native Google Docs whose filename is `.md` / `.markdown` and whose body contains literal Markdown. Public `markdown-drive` URL launch supports these through Drive metadata plus `files.export`, so both of these legacy forms are valid inputs in J:

```text
https://docs.google.com/document/d/<ID>/edit
https://docs.google.com/document/d/<ID>/export?format=txt
```

K/L do not pass those Google URLs through verbatim. For both raw Drive files and Google Docs-backed Markdown they extract the same Drive file ID and normalize the wrapper source to:

```text
https://drive.google.com/file/d/<FILE_ID>/view#markdown
```

The `#markdown` fragment is preserved as part of the source URL and becomes `%23markdown` inside the encoded `file=` parameter.

Do not replace a legacy Google Doc with a different raw `.md` merely because the filename matches. Different vacancy-tailored CVs can share the same filename. The file ID/source content is authoritative.

## Other accepted Markdown source forms

K/L may also be generated for:

1. an explicit public HTTP(S) `.md` source;
2. a verified HTTP(S) source carrying a terminal `#markdown` marker.

Do not tag a URL `#markdown` merely because its content looks plausible. Verify that the source is actually the intended Markdown CV first.

## Derivative URLs

For Google Drive / Google Docs-backed sources, formulas construct:

```text
https://markdown-drive.pages.dev/?file=<URL-encoded https://drive.google.com/file/d/FILE_ID/view#markdown>&export=docx
https://markdown-drive.pages.dev/?file=<URL-encoded https://drive.google.com/file/d/FILE_ID/view#markdown>&export=pdf
```

The visible hyperlink titles are `DOCX` and `PDF`. Each K/L data cell contains its own row-local formula. There are no spill/array formulas.

The formula is the presentation layer. Do not persist wrapper URLs back into J.

## Lifecycle behavior

Lifecycle moves copy J with the vacancy but deliberately skip K:L. The target sheet already owns formulas for its rows and derives DOCX/PDF locally from the copied J source.

Therefore:

- no Queue-only rendering step exists;
- no presentation state has to be copied between partitions;
- K/L cannot become stale relative to J because they are formulas;
- changing J automatically changes K/L.

## Persistent application pack

Normal vacancy/application storage remains:

- full source vacancy / `Position.md` according to current ingestion contract;
- tailored CV Markdown;
- individual Cover TXT when a cover is required.

Do not use one bulk cover/position file as the artifact link for many independent vacancy rows.

DOCX/PDF files do not have to be separately persisted merely because K/L export links exist. Persist an exported derivative only when Anton or the concrete application channel requires a file artifact.

## QA

Before a CV row is treated as ready:

1. the Markdown source exists and is the correct vacancy-tailored CV;
2. J points to that exact source/file ID, not another same-named vacancy CV;
3. a Drive-hosted source is either a real `text/markdown` file or a native Google Doc with a `.md` / `.markdown` name and literal Markdown body;
4. K and L are ordinary row formulas and resolve from J through the canonical `/file/d/<ID>/view#markdown` wrapper source;
5. `#markdown` is preserved/encoded rather than removed;
6. the Markdown itself passes evidence/content QA;
7. if a DOCX/PDF derivative is actually exported for final use, perform the required derivative visual QA at that time.

Missing separately persisted DOCX/PDF files do not block readiness when K/L export links are valid.
