# Canonical tailored CV: Markdown v3

This contract supersedes `cv-markdown-v2.md` wherever tracker CV presentation/storage semantics conflict. Authoring/evidence rules remain Markdown-first; the major v3 change is that source and derivatives are separate tracker columns.

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

## Preferred Drive source

For Drive-hosted CVs, the canonical source is a real Google Drive file with MIME type `text/markdown`, publicly readable by link. Store it in J as a normal Drive file URL. The canonical share form is:

```text
https://drive.google.com/file/d/<FILE_ID>/view#markdown
```

A Drive URL with extra sharing query parameters is acceptable in J, but K/L normalize it to the canonical `/view#markdown` form before URL-encoding it for `markdown-drive`.

The `#markdown` fragment is preserved as part of the source URL. Do not strip it before constructing the wrapper URL.

Native Google Docs URLs such as:

```text
https://docs.google.com/document/d/<ID>/edit
https://docs.google.com/document/d/<ID>/export?format=txt
```

are **not** valid canonical `CV MD` sources for the current `markdown-drive` public URL-launch contract. K/L must stay blank for those rows until J is repaired to a real Markdown file source.

## Other accepted Markdown source forms

Besides canonical Drive Markdown files, K/L may be generated for:

1. an explicit public HTTP(S) `.md` source;
2. a verified non-Google HTTP(S) source carrying a terminal `#markdown` marker.

Do not tag a URL `#markdown` merely because its content looks plausible. Verify that the source is actually the intended Markdown CV first.

## Derivative URLs

For a canonical Drive source, the formula first normalizes J to:

```text
https://drive.google.com/file/d/<FILE_ID>/view#markdown
```

and then constructs:

```text
https://markdown-drive.pages.dev/?file=<URL-encoded complete source URL>&export=docx
https://markdown-drive.pages.dev/?file=<URL-encoded complete source URL>&export=pdf
```

For example, the `#markdown` fragment becomes `%23markdown` inside the encoded `file=` parameter.

The visible hyperlink titles are `DOCX` and `PDF`. The formula is the presentation layer. Do not persist wrapper URLs back into J.

## Lifecycle behavior

Every physical storage sheet has ordinary per-row formulas in K and L. There are no spill/array formulas for CV derivatives.

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
2. J points to that source, not another vacancy's CV;
3. for Drive-hosted CVs, J resolves to a real `text/markdown` Drive file rather than a native Google Doc;
4. K and L are ordinary row formulas and resolve from J using the canonical source URL;
5. `#markdown` is preserved/encoded rather than removed;
6. the Markdown itself passes evidence/content QA;
7. if a DOCX/PDF derivative is actually exported for final use, perform the required derivative visual QA at that time.

Missing separately persisted DOCX/PDF files do not block readiness when K/L export links are valid.
