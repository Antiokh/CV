# Canonical tailored CV: Markdown v3

This contract supersedes `cv-markdown-v2.md` wherever tracker CV presentation/storage semantics conflict. Authoring/evidence rules remain Markdown-first; the major v3 change is that source and derivatives are now separate tracker columns.

## Canonical artifact

The canonical tailored CV artifact is Markdown stored in the vacancy/application folder. Markdown is the authored source of truth. DOCX/PDF are derivatives.

A tailored CV must use verified Anton evidence only. Vacancy wording may determine emphasis/order but cannot create facts, metrics, authority, team size, stack, dates or results.

## Tracker contract

WorkInterviews uses three distinct CV columns:

- `J / CV MD` — canonical public/accessible Markdown source URL;
- `K / CV DOCX` — formula-derived `markdown-drive` DOCX export link;
- `L / CV PDF` — formula-derived `markdown-drive` PDF export link.

Agents write only J. Agents do not construct or write K/L links, rich-text runs, HYPERLINK cells or encoded wrapper URLs.

The old model where Queue J was mutated from a raw source URL into visible rich-text `DOCX PDF` is retired. There is no CV presentation `onOpen` or `onSelectionChange` renderer.

Because J remains raw, debugging is direct: inspect J to validate the source; inspect K/L to validate the formula/export layer independently.

## Accepted Markdown source forms

K/L derivative formulas are generated only when J is one of:

1. explicit HTTP(S) `.md` source;
2. Google Docs plain-text export URL with `format=txt`;
3. verified opaque HTTP(S) source with terminal `#markdown` marker.

For form 3, `#markdown` is a type marker and is removed before export.

Do not tag a file `#markdown` merely because its filename looks plausible. Verify that the underlying artifact is actually the intended Markdown CV first.

## Derivative URLs

The sheet formula constructs:

```text
https://markdown-drive.pages.dev/?file=<URL-encoded canonical source>&export=docx
https://markdown-drive.pages.dev/?file=<URL-encoded canonical source>&export=pdf
```

The formula is the presentation layer. Do not persist those wrapper URLs back into J.

## Lifecycle behavior

Every physical storage sheet has its own K1/L1 spill formulas. Lifecycle moves copy J with the vacancy but deliberately skip K:L. The target sheet then derives DOCX/PDF locally from its copied J source.

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
3. K and L resolve from J when J is a supported source form;
4. if J is opaque, it carries `#markdown` only after source verification;
5. the Markdown itself passes evidence/content QA;
6. if a DOCX/PDF derivative is actually exported for final use, perform the required derivative visual QA at that time.

Missing separately persisted DOCX/PDF files do not block readiness when K/L export links are valid.
