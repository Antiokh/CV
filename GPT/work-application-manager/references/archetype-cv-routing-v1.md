# Archetype -> baseline CV routing v1

Purpose: make vacancy capture cheap and deterministic. During broad discovery/capture, use Queue `Archetype` (column O) to choose one canonical role CV, copy that Markdown into the vacancy folder, and store the vacancy-owned copy in `J / CV MD`. Deep vacancy-specific adaptation happens later during Queue completion.

This file owns **baseline template routing**. `ROLE_SIGNAL_PROFILES.md` still owns vacancy-specific evidence order and final tailored-CV logic.

## Two CV states

Every Queue CV artifact is vacancy-owned and may be in one of two states:

- **baseline** — a verbatim copy of the routed canonical role CV. Valid for a newly captured `To review` vacancy. It is a fallback application artifact, not evidence that vacancy-specific CV work is complete.
- **tailored** — the same vacancy-owned Markdown artifact after vacancy-specific Pain Map / Expectation Map / evidence adaptation and QA. Required for `CV ready`.

Do not point many Queue rows at one shared template URL. Copy the routed template into `WorkApplications/<Company>/<PositionTitle>/Anton_Nazarov_<PositionTitle>.md`, verify the copy, share it publicly as reader, and put that vacancy-owned source URL in J. Later personalization updates the same vacancy-owned artifact/file when the storage tool supports safe in-place replacement; otherwise replace J only after the new tailored artifact has been verified.

K/L remain formula-owned derivatives of J in all states.

## Routing algorithm

Normalize `Archetype` to lowercase for matching. Use the **first matching family below, in precedence order**. The order matters for compound archetypes.

### 1. CTO / executive technology leadership
Signals include:
- `cto`
- `technology director`
- `group cto`
- `executive technology`
- `technology strategy` when explicitly executive/CTO-like

Template: `RESUME_FRACTIONAL_CTO.md`

### 2. CIO / Head of IT / corporate IT leadership
Signals include:
- `cio`
- `head of it`
- `it leadership`
- `it operations`
- `it service management`
- `corporate it`
- `internal platforms` when the archetype is explicitly IT-leadership/operations oriented

Template: `RESUME_CIO_HEAD_OF_IT.md`

### 3. Engineering management / engineering leadership
Signals include:
- `engineering management`
- `engineering manager`
- `engineering leadership`
- `head of engineering`
- `engineering director`
- `head of development`
- `software development management`
- `product engineering leadership`

Template: `RESUME_ENGINEERING_MANAGER_HEAD.md`

### 4. ERP / business applications / CRM / business systems ownership
Signals include:
- `erp`
- `business applications`
- `business systems`
- `crm architecture`
- `crm automation`
- `enterprise applications`
- `systems analysis` when centered on ERP/business applications rather than architecture
- `financial systems / implementation / business analysis`

Template: `RESUME_ERP_BUSINESS_APPLICATIONS_MANAGER.md`

### 5. Solutions / systems / enterprise architecture and technical solution engineering
Signals include:
- `solution architecture`
- `solutions architecture`
- `solutions architect`
- `systems architecture`
- `enterprise architecture`
- `technical architecture`
- `data architecture`
- `cloud / infrastructure architecture`
- `solutions engineering`
- `customer engineering`
- `technical pre-sales`
- `applied ai solutions`
- `ai engineering`
- `applied ai`
- `ai automation engineering`
- `ai enablement engineering`
- `principal engineering`
- `founding engineer`
- `lead engineer`
- `senior backend`

Template: `RESUME_SOLUTIONS_ARCHITECT.md`

### 6. Delivery / implementation / program / project / transformation management
Signals include:
- `delivery`
- `implementation`
- `deployment`
- `program management`
- `program /`
- `technical program`
- `project management`
- `project /`
- `technical project`
- `pmo`
- `professional services`
- `service delivery`
- `change management`
- `business transformation`
- `digital transformation`
- `transformation leadership`

Template: `RESUME_DELIVERY_TRANSFORMATION_MANAGER.md`

Exception: if the same Archetype has a stronger Product/AI Product signal and is fundamentally a product role, continue to Product routing below rather than treating a word like `delivery` as decisive. Use the actual leading role noun in the Archetype when resolving this ambiguity.

### 7. AI Product / AI transformation product ownership
Signals include:
- `ai product`
- `ai product management`
- `ai product transformation`
- `product leadership / ai`
- `product ownership / ai`
- `agentic platform` when explicitly product-owned
- `ai platform` when explicitly Product/Product Leadership
- `ai transformation` when the archetype is primarily product/adoption rather than delivery/project management

Template: `RESUME_AI_PRODUCT_TRANSFORMATION.md`

### 8. Product / Technical Product / Product Leadership
Signals include:
- `product management`
- `product manager`
- `product leadership`
- `head of product`
- `director of product`
- `technical product`
- `product owner`
- `product ownership`
- `senior product`
- `principal product`
- `staff product`
- `product /`
- `product operations` when it remains a product role

Template: `RESUME_TECHNICAL_PRODUCT_MANAGER.md`

## Fallback

If no family can be resolved confidently from Archetype:

1. do not invent a route;
2. use Position title plus `ROLE_SIGNAL_PROFILES.md` only to choose the nearest family;
3. record the chosen family in O if O was missing, or preserve existing O and note the routing ambiguity in Notes;
4. if still ambiguous, use `RESUME_FRACTIONAL_CTO.md` only for genuinely managerial/executive hybrid roles, not as a universal fallback;
5. otherwise leave baseline CV blocked and continue capture of the vacancy row rather than attaching a misleading CV.

## Capture-state rules

Broad capture prioritizes breadth over deep adaptation.

For every vetted new vacancy that is actually ingested:

1. create Queue row as `To review`;
2. fill all cheap/source-obvious fields available at capture time, including Archetype;
3. preserve substantive vacancy text in Position.md when available;
4. route Archetype through this file;
5. create a vacancy-owned copy of the routed baseline CV;
6. verify/read back the copied Markdown and public sharing;
7. write only that source URL to J;
8. verify K/L formula cells exist and resolve to `DOCX` / `PDF`; never write K/L;
9. continue capturing the vetted pool without waiting for salary research, referral research, cover creation, or tailored CV work.

A baseline CV does **not** make a vacancy `CV ready`.

## Queue-completion rules

After broad capture, process incomplete Queue rows one by one. For each row:

1. recover full vacancy evidence / Position.md;
2. complete salary, recruiter/referral, dates, location, snapshot, notes and other applicable fields;
3. build Pain Map + Expectation Map;
4. adapt the vacancy-owned baseline CV into a genuinely tailored CV using `ROLE_SIGNAL_PROFILES.md`, evidence matrix and normal CV QA;
5. create/humanize Cover when required by the workflow;
6. verify J source and K/L derivatives, Salary Data and Queue integrity;
7. advance to `Reviewed` / `CV ready` only when their current gates are actually met.

Priority within Queue completion: practical attractiveness first, then age/staleness, while ensuring older incomplete rows are not starved indefinitely.

## Stage semantics

- `To review`: may contain a verified vacancy-owned **baseline** CV. Deep enrichment/personalization is still pending.
- `Reviewed`: vacancy analysis/data gates are substantially complete; do not infer `tailored` solely from this stage unless the current workflow explicitly established it.
- `CV ready`: vacancy-owned CV is **tailored**, content QA is complete, required cover/salary/artifact gates are complete, and current integrity checks pass.
