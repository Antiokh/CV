# Directorate of Cultural Centers of Moscow — canonical employer dossier

**Employer:** Directorate of Cultural Centers of Moscow  
**Role:** Senior Manager / IT Architect / Analyst  
**Dates:** Jan 2017 – May 2023  
**Evidence type:** consolidated canonical working source assembled from first-person debriefs, raw career dictation, master CV evidence and AIS MosRazvitie project material.  
**Status:** primary source for future CV tailoring about this employer. Older raw/debrief files remain provenance and should not be independently recombined unless a fact is missing here.

## Why this role matters

This was not only a software-development role and not only ownership of AIS MosRazvitie. It combined:

- end-to-end product and technical ownership of a sector-wide information platform;
- business / process analysis across departments and institutions;
- architecture, data modelling, implementation and legacy modernization;
- technology governance across a network of **100+ cultural institutions**;
- indirect functional coordination with **100+ institutional IT specialists** outside Anton's reporting line;
- centralized procurement / technical-requirements coordination;
- scaled user adoption, training and support;
- incident response and continuity work involving external security vendors and public authorities;
- hiring, onboarding and mentoring.

For management and product CVs, this role should be read as a hybrid of **Product Owner + Solution Architect + Delivery Owner + cross-organizational technology coordinator**. Do not reduce it to `IBM Domino developer` or `reporting system`.

## Management scope and authority

- Coordinated technical requirements, operating standards, implementation decisions and priorities with IT directors, Heads of IT and specialists across **100+ subordinate institutions**.
- The 100+ specialists were **not direct reports**. This is functional / cross-organizational coordination and must never be represented as line management.
- Prepared sector-level technical requirements and represented institutional technology needs in meetings with public authorities.
- Participated in centralized IT procurement planning: consolidated institutional needs, aligned technical requirements with available quotas / centrally purchased equipment and tracked delivery / implementation.
- Worked in an environment where formal administrative authority was distributed, so influence depended on requirements, governance, shared systems, common standards and stakeholder alignment rather than direct reporting lines.
- Hired, onboarded, adapted and mentored employees and interns; designed probation / onboarding processes.

## AIS MosRazvitie — actual scope

AIS MosRazvitie evolved into a sector-wide operational information and management platform for **100+ cultural institutions and libraries**. It should not be described as only a reporting portal.

The platform represented and linked operational information including:

- institutions, branches, buildings and rooms;
- floor area and physical assets;
- employees, positions, vacancies and management structure;
- salary / finance-related data where appropriate;
- clubs / sections and their participants;
- events and responsible staff;
- accessibility infrastructure;
- technical infrastructure such as CCTV and electrical capacity;
- participation in city programs and campaigns;
- KPI, planning and management data;
- questionnaires, structured data-collection forms and reporting periods.

Anton recalls that the central system could hold a more complete management picture than any single institution's local records because it combined institutional submissions with data and requirements coming through the Department / Directorate layer.

**Safe interpretation:** sector-wide operational data platform / management source of truth with ERP-like workflows.  
**Do not overclaim:** it was not a full transactional ERP for every business process.

## Product ownership and discovery

Anton owned product logic, architecture, data model, workflows, reporting, access rules, governance, implementation decisions and user adoption.

A key discovery step was interviewing departments about how they actually used data. The inherited hierarchy did not match operating reality. Examples:

- one institution could occupy several buildings;
- one building could contain spaces belonging to multiple institutions;
- events, staff, clubs / sections and locations required more flexible relationships than the old rigid hierarchy allowed.

Anton redesigned the model around these real relationships while preserving migration and continuity.

This is strong evidence for:

- enterprise / domain data modelling;
- user and stakeholder discovery;
- turning organizational reality into a system model;
- product decisions driven by actual workflow rather than nominal org charts.

## Operational workflows

MosRazvitie supported real operating processes, not just static data entry.

Confirmed event lifecycle:

**plan → approval → assignment of responsible staff → event delivery → post-event report / attendance**

The system also supported:

- moderation and data-quality control;
- reporting periods and edit restrictions;
- service / batch actions on groups of records;
- background agents for status updates, unlocks and cleanup;
- questionnaires and structured collection campaigns;
- external data exchange over HTTP/XML;
- exports for institutions' own downstream use.

## Management information, planning and funding relevance

- Directorate users could answer many urgent questions about **equipment or events** from current centralized data rather than launching a new manual collection across institutions.
- System data was used for management planning and resource-allocation decisions.
- Anton recalls that **event volume / number of events influenced planning and funding**.
- CVs may state that the platform supplied information used in planning and funding decisions.
- Do **not** say Anton personally allocated funding.

This is one of the strongest executive/product signals from the role: the system became management information infrastructure rather than a passive database.

## Reporting architecture and self-service

Important precision:

- report generation was **server-side**;
- the famous `~5 hours → seconds/minutes` case refers to **one major events report**, not every report;
- before redesign that large report was realistically produced about once per day;
- redesigned web reporting typically completed in approximately **1.5 seconds to 1.5 minutes**, depending on report complexity;
- after redesign, system logs showed roughly **200–300 report runs per working day** across Directorate and institutional users;
- institutions could run the same reporting layer with visibility restricted to their own organization.

The 200–300 figure proves **self-service adoption / reporting throughput**, not high-load distributed-systems scale. Never use it as a high-load claim.

Anton also generated polished Excel outputs through Apache POI, including filtering / conditional formatting, so reports were directly usable rather than raw dumps.

## Data quality and freshness governance

Anton introduced logic where individual fields / entities could be treated as stale or incomplete instead of pretending every record was equally current.

The system supported:

- progressive / partial completion without losing known data;
- visibility into missing fields;
- prompts / reminders for required updates;
- distinction between current and stale information;
- targeted refresh rather than forcing institutions to re-enter entire records.

This is best framed as **data freshness / governance**, not merely form validation.

## Role-based access and operating views

Anton redesigned permissions so users saw and edited only the information relevant to their role.

Examples recalled:

- leadership could see broad organizational information;
- event staff could work with event data without finance access;
- finance could access relevant financial data without unrelated event operations;
- section / club users were restricted to their functional area.

This supports RBAC / least-privilege claims at sector scale.

## Architecture for rapid change

Parts of the platform were redesigned into a low-code-like internal development model for Anton as owner / developer:

- reusable generators for fields, forms, filters and reports;
- generated structures / code for common change patterns;
- new fields and sections could sometimes be added within roughly **one day** rather than through a long custom-development cycle.

The signal is reduced change lead time and architecture designed for repeated evolution, not `low-code` branding.

## User support operating model

The initial support model relied heavily on telephone calls. A single call could occupy one specialist for roughly an hour with poor diagnostic context.

Anton moved support to browser-based assisted chat using **tawk.to**.

The new model allowed the team to:

- handle roughly **10–15 support sessions in parallel** during busy periods;
- see richer user/context information;
- use visual / screen context to diagnose issues;
- avoid serial one-user-per-phone-call support across a 100+ institution network.

The value is **service-team leverage and support scalability**. Do not present 10–15 sessions as product high-load.

## Adoption, training and standardization

- Used documentation, consultations and recurring webinars / BigBlueButton sessions when new system blocks were introduced.
- Training was part of data governance: institutions were taught a shared terminology and common data-entry rules so sector reports became comparable.
- Formal reminders / requests were used to complete required information.
- Feedback from recurring support issues was translated into product changes.
- Training and support covered **hundreds of users**; exact unique-user count is not currently canonical enough for a stronger figure.

## Technology governance across institutions

Anton recalls coordinating / issuing requirements around areas such as:

- Active Directory standardization;
- telephony;
- mandatory information systems;
- documentation and security requirements;
- CCTV / access-control reporting;
- information-security checks;
- institutional data submission and operational compliance;
- centralized testing / certification-style checks for some staff groups.

Use the broad claim `coordinated technology requirements and operating standards across 100+ institutions`. Do not invent exact rollout counts or formal line authority for individual controls without separate evidence.

## Legacy modernization and infrastructure

- Modernized a live IBM Domino / Notes environment without interrupting operational use.
- Migrated infrastructure from Windows to **CentOS + nginx**.
- Strengthened authentication, role-based authorization, server access and transport security.
- Historical project materials also record an **A+ SSL** result after reverse-proxy / TLS modernization; useful for technical roles, usually secondary for management/product CVs.
- Maintained server setup, backup and production support responsibilities alongside product ownership.

## Domain-block / false-phishing incident

When the system moved from IP access to a private domain carrying a Moscow-government-style login page, security vendors / browser ecosystems falsely classified it as phishing / malware.

Operational effect:

- normal domain access produced warnings / blocking;
- IP access remained partially usable as fallback;
- Anton recalls the incident lasting roughly **1.5 days**.

Anton:

- prepared formal explanation material for leadership;
- found escalation / vendor contacts;
- coordinated remediation and delisting with **Google, Bitdefender, Quttera and Sangfor**;
- restored normal access quickly.

Use as business-continuity / external incident-management evidence. Avoid turning vendor names into a top-level CV achievement unless the vacancy values incident/security operations.

## Technology / implementation stack

IBM/HCL Domino, Lotus Notes, XPages, JavaScript, Java, CSS, HTML, XML, Apache POI, CentOS, nginx, HTTP/XML integrations, Yandex Maps API, background agents, role-based access, web reporting.

The stack is supporting evidence. For managerial/product CVs, lead with ownership, operating scope, adoption, governance and business use.

## Strongest signals by role

### Product / Technical Product
- end-to-end product ownership across 100+ institutions;
- discovery-driven redesign of domain model;
- event lifecycle and operational workflows;
- data freshness / governance;
- RBAC and self-service reporting;
- management data used for planning / funding;
- scaled adoption and support.

### CIO / CTO / Technology Director
- cross-organizational technology governance across 100+ institutions;
- management information infrastructure;
- legacy modernization without service interruption;
- external incident recovery;
- centralized procurement / standards coordination;
- training / support operating model at network scale.

### Solutions Architect
- enterprise data model;
- RBAC;
- server-side reporting redesign;
- reusable generators / rapid schema evolution;
- HTTP/XML integration;
- live legacy migration Windows → CentOS/nginx.

### Delivery / Transformation
- adoption across many organizations without line authority;
- support model redesign;
- training / standardization for hundreds;
- translating recurring operational pain into product change;
- stakeholder alignment and rollout.

## Completeness additions from older technical / structured sources

A repository-wide audit on 2026-09-18 recovered additional Directorate details that had been preserved in older profile, technical-path and job-board sources but were not explicit in the first employer dossier.

### Management-scope precision

- A later first-person confirmation records functional interaction / coordination with approximately **126 people across subordinate institutions**.
- This is a more precise recollection inside the already-safe 100+ specialists across 100+ institutions scope.
- It is still **functional coordination without line authority**. Do not convert ~126 into direct reports.
- For ordinary CVs, 100+ remains the safer rounded wording unless the exact scope is useful and Anton wants to defend ~126.

### Requirements, procurement and internal consulting

Additional preserved responsibilities include:

- drafting technical specifications / requirements for Directorate IT projects;
- procurement of certificates and software / infrastructure licenses;
- IBM Notes training for internal staff as well as consulting / support for subordinate institutions;
- governance around VPN access and changes to database fields / shared system structures.

### Specific platform capabilities preserved in older sources

Historical structured profile / CV material also records:

- edit locking during controlled workflow / reporting stages;
- conditional field / section visibility;
- live session-based settings;
- filtered exports;
- full-text search;
- a user feedback section;
- reusable report, field, form, filter and export generators;
- batch / service actions;
- Word / PDF / Excel-oriented formal output in addition to structured HTTP/XML exchange.

Use these as technical/product depth when a vacancy specifically needs workflow-platform, document-generation or enterprise application evidence.

### Infrastructure topology and performance detail

Older technical-path evidence records:

- production on physical **HP ProLiant** server infrastructure;
- development / replica environment on **VMware**;
- CentOS 7 / Linux and nginx reverse-proxy deployment;
- database replication and production/development separation;
- a first-person recollection that the database / application layer became roughly **2.5x faster** when moved from Windows to Linux.

The Windows → CentOS/nginx migration itself is well established. Treat the ~2.5x infrastructure-speed recollection as secondary first-person evidence, not a headline metric unless separately corroborated.

### Apache POI / export-engine depth

Technical-path notes preserve work on:

- server-side Java / Apache POI report generation;
- Excel formatting and generation constraints;
- handling Apache POI / Excel limits;
- reusable report / table / field generators.

### Older metric variants that must stay separate

Two older source variants should **not** be silently merged into newer evidence:

1. Older structured profiles say exports were accelerated by about **20x** and that long-running operations received expected-time estimation. The later, more precise debrief establishes the stronger report-specific evidence: one major events report went from about **5 hours** to seconds/minutes. Preserve 20x + ETA as historical supporting evidence, but prefer the report-specific timing in current CVs.
2. An older technical-path recollection says the system could support roughly **200–300 users** comfortably. Separately, later debrief/log evidence says the platform executed roughly **200–300 report runs per working day**. These are **different metrics**. Until the user-count recollection is independently reconciled, do not turn the 200–300 report-run metric into a user-count claim or vice versa.

## Claims to avoid or qualify

- **Do not** call 200–300 reports/day high-load.
- **Do not** imply all reports previously took five hours.
- **Do not** say 100+ IT specialists were direct reports.
- **Do not** say Anton allocated institutional funding; the platform supplied data used in planning / funding.
- **Do not** call MosRazvitie a complete ERP; use `ERP-like operational workflows` / `sector operational information platform`.
- **Do not** invent exact user counts, data-row counts or budgets not currently supported.

## Provenance / underlying materials

Primary raw and intermediate sources retained for traceability:

- `GPT/_notebooklm_import/05A_RAW_STORY_01_FRAME_BANK_DIRECTORATE.txt`
- `GPT/anton_nazarov_career_path_story_full_raw.md`
- `GPT/anton_nazarov_experience_full.md`
- `sources/cross_role_business_outcomes_debrief_2026-09-15.md`
- `sources/cross_role_business_outcomes_second_pass_2026-09-15.md`
- `sources/cross_role_business_outcomes_followup_2026-09-15.md`
- `sources/directorate_support_model_debrief_2026-09-15.md`
- `sources/mosrazvitie.md` — historical assistant-formulation note; not primary factual source after this dossier
- `portfolio/ais_mosrazvitie/README.md`
- `RESUME.md` — master evidence inventory, not provenance by itself

If future debriefs add or correct facts about this employer, update **this dossier first**, then update derived CV/evidence files.