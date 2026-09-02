# CV Markdown-first workflow v1 — deprecated

This file is a compatibility tombstone.

Current canonical contract:

`GPT/work-application-manager/references/cv-markdown-v2.md`

Do not use the old v1 requirement that agents manually URL-encode the canonical Markdown source, construct Markdown Drive DOCX/PDF links, or write multiple rich-text runs into tracker `CV`.

Current rule in short:

- Markdown remains the canonical authored/stored tailored CV.
- For a vacancy currently in Queue, ChatGPT/agents write only the verified public canonical Markdown source URL into Queue `CV`.
- The bound `workinterviews-cv-presentation.gs` converts raw Queue source URLs into `DOCX PDF` rich-text export links for the human UI.
- Active / Low fit / Closed are not re-rendered; lifecycle `copyTo(..., PASTE_NORMAL)` carries the already-formed Queue links with the row.
- DOCX/PDF remain on-demand derivatives and are not mandatory persistent artifacts for `CV ready`.

Always load and follow `cv-markdown-v2.md` for the complete current contract.
