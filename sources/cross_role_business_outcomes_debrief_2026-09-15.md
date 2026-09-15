# Cross-role business outcomes debrief

**Date captured:** 2026-09-15  
**Source type:** first-person debrief from Anton Nazarov in ChatGPT conversation  
**Purpose:** capture business-level outcomes and management evidence across Directorate / MosRazvitie, Moscow Social Development Agency, Settlement and Savings Bank, and NeedleBit.

## Evidence status

This file records Anton's direct recollection. Exact numbers and causal claims should be treated as first-person evidence until supported by stored reports, screenshots, contracts, system exports or other documentary sources. The purpose is to preserve potentially high-value executive evidence for later CV use while keeping provenance details out of the public CV itself.

---

## 1. Directorate / MosRazvitie — sector-wide source of truth

Anton describes AIS MosRazvitie as much more than a reporting portal. It evolved into a sector-wide information system representing the operational structure and activity of 100+ Moscow cultural institutions and libraries.

The system captured and related information such as:

- institution / branch / building / room structure;
- floor area and physical assets;
- employees, positions, vacancies and management structure;
- salaries and financial data where appropriate;
- clubs / sections and participants;
- events and responsible staff;
- accessibility infrastructure;
- technical infrastructure, including CCTV, electrical capacity and other facility data;
- participation in city programmes and campaigns;
- management / KPI / planning information.

Anton states that the system often held a more complete picture of institutions than any one institution's local records because it combined data from institutions with data coming through the Department of Culture.

Executive interpretation: **industry-level operational data platform / digital twin and management source of truth**, with elements of ERP-like workflow but without full transactional ERP scope.

---

## 2. Directorate — redesign around actual operating reality

Anton began by interviewing departments about what data they actually used and discovered that the old system's structure did not match real organizational relationships.

Examples:

- one institution could occupy rooms in multiple buildings;
- one building could contain spaces belonging to multiple institutions;
- the prior rigid hierarchy could not model these cases correctly;
- event, club / section and staff relationships required more detailed and flexible links.

Anton redesigned the data model while preserving migration / continuity.

This is evidence of:

- enterprise data modelling;
- stakeholder discovery across departments;
- translating organizational reality into system structure;
- reducing ambiguity in management reporting.

---

## 3. Directorate — field-level freshness and targeted data refresh

Anton introduced field-level freshness logic so individual fields / entities could be marked stale and users could be prompted to refresh only the data that needed updating.

Users could save partially completed records without losing known data. The system showed which fields remained incomplete and reminders could be sent for missing information.

This created a practical data-governance model:

- not all data was treated as equally current;
- management could distinguish current from stale information;
- institutions could progressively complete complex records;
- reminders and update requests became systematic rather than ad hoc.

Executive interpretation: **data quality / freshness governance**, not only form design.

---

## 4. Directorate — reporting throughput and self-service

Anton recalls that after performance and reporting redesign the system was generating roughly **200–300 reports per working day** across the Directorate and institutions.

Reports were used both centrally and by institutions themselves, including exporting event and operational data for reuse in their own systems.

The established performance evidence remains:

- a previously very slow export / reporting workflow could take around **5 hours**;
- redesigned web reporting completed in approximately **1.5 seconds to 1.5 minutes** depending on the report.

Anton implemented formatted spreadsheet generation with filtering / conditional formatting, making reports directly usable rather than raw data dumps.

Potential executive outcome: **turned a bottlenecked reporting system into a high-throughput self-service reporting platform used hundreds of times per day**.

Do not convert 200–300 reports/day into person-hour savings until the old report mix and old per-report cost are clarified.

---

## 5. Directorate — rapid schema / workflow evolution

Anton converted parts of the platform from code-heavy change toward a low-code-like model for himself as system owner.

When departments requested additional fields / sections, the system generated much of the required code / structure, allowing Anton to update cards and add data elements very quickly — in some cases within a day.

This is evidence of:

- internal platform design;
- reduced change lead time;
- product responsiveness to departmental requirements;
- architecture designed for ongoing evolution rather than one-off delivery.

---

## 6. Directorate — RBAC and role-specific operating views

Anton redesigned access control so users saw and edited only the information relevant to their responsibilities.

Examples:

- leadership roles could view broad organizational information;
- event teams could work with event data without access to finance;
- finance could access financial data without unnecessary operational sections;
- club / section users were limited to their functional area.

This supports **role-based access, least-privilege design and organization-wide adoption** at sector scale.

---

## 7. Directorate — standardization across institutional IT

Anton coordinated / issued requirements to IT specialists across the institutional network and participated in rollout / governance of centrally provided systems and controls.

He recalls activity around:

- Active Directory standardization;
- telephony;
- mandatory information systems;
- documentation and security requirements;
- CCTV and access-control reporting;
- information-security checks;
- institutional data submission and operational compliance;
- centralized testing / certification-style checks for some staff groups.

Exact rollout counts and formal authority should be clarified before CV claims beyond the already supported indirect coordination of 100+ IT specialists.

---

## 8. Directorate — domain-block incident recovery

When the system moved from IP access to a domain name, security vendors / browsers classified the domain as phishing because a Moscow-government-branded login page was hosted on a privately registered domain.

Operational effect:

- domain access produced security warnings and effectively blocked normal use;
- IP-based access remained partially available as a fallback;
- the incident lasted roughly **1.5 days** according to Anton's recollection.

Anton rapidly:

- prepared formal explanation material;
- identified escalation contacts;
- contacted security vendors and Google channels;
- coordinated removal of false classifications.

Executive interpretation: **business continuity / incident management across external security ecosystems**.

---

## 9. Directorate — training and adoption as data-quality control

Anton used BigBlueButton and recurring webinars to train institutions when new system blocks were introduced.

The goal was not only user education; it also made reporting comparable and consistent across institutions by teaching users to enter data under a common model and by using formal requests / reminders to complete required sections.

This supports:

- change management;
- scaled adoption;
- data-standardization governance;
- training as part of product operations.

---

## 10. Moscow Social Development Agency — greenfield IT function

Anton describes joining a newly created organization where most end-user and operating IT had to be built almost from zero.

Work under his leadership included:

- end-user workstation rollout;
- Windows imaging / standardized deployment;
- domain and policy setup;
- local network rollout / testing;
- printers and office hardware;
- software / licensing;
- support processes;
- server / directory integration;
- contractor search / technical evaluation;
- an internal map / floor-location tool adapted from open source because the organization was distributed across a large building.

The team used parallelized deployment methods (many machines prepared simultaneously, standard images, domain policies, automated application rollout) to bring users online quickly.

Executive interpretation: **greenfield IT-function build and rapid office enablement**, not workstation setup.

Need follow-up on: number of users / workstations, launch timeline, budget, and whether go-live deadlines were met.

---

## 11. Settlement and Savings Bank — regulatory-risk and workflow transparency

Anton states that the bank was incurring financial losses / penalties because regulatory reporting or required documents sometimes missed deadlines.

The document-flow project was intended to make routing, ownership and timing explicit.

After implementation:

- documents were registered centrally and worked with as digital copies;
- multiple people could work on the same matter without physically moving the original;
- document location, owner, transfer time and overdue status became visible;
- management could see exactly where a document had stalled;
- excuses such as "the document never reached me" became verifiable;
- paper courier movement was largely removed from the operating process;
- approximately **60 users** used the system.

Anton recalls that the new transparency showed a recurring bottleneck in the registry / clerical intake function, where documents could remain too long before being routed to legal / other departments.

Executive interpretation: **regulatory-risk reduction, accountability, workflow transparency and removal of physical handoffs**.

Need follow-up on actual fines / missed deadlines before vs after and whether the courier role was removed, reassigned or simply reduced.

---

## 12. Bank — governance before automation

When department heads disagreed about how a route should work, Anton did not automate ambiguous process logic.

Instead:

1. conflicting stakeholders were brought together;
2. when necessary the chairman of the board resolved the operating rule;
3. the agreed process was documented in detail;
4. only then was it implemented.

This is strong evidence of **process governance and executive stakeholder alignment before system implementation**.

---

## 13. NeedleBit — platform selection and lifecycle economics

Anton repeatedly challenged client platform choices when he believed they would create higher long-term cost, vendor lock-in or forced rewrites.

Examples recalled:

- moved clients from **Glide** toward **WeWeb** when broader functionality / lower long-term platform cost mattered;
- recommended **Supabase** instead of **Airtable** for structured backend needs; in at least one case the frontend was later replaced while Supabase remained as the backend;
- discouraged **Bubble** in cases where Anton expected eventual rewrite / ownership limitations;
- preferred architectures where data / backend logic remained portable and understandable by future developers or AI-assisted teams.

The business signal is not preference for a tool. It is **total cost of ownership, portability and avoidance of predictable replatforming**.

Exact monetary savings are not currently supported.

---

## 14. NeedleBit — rescuing failed outsourced builds

Anton recalls multiple engagements where clients had already paid external / offshore developers more than once and still had non-working or unreliable systems, then came to him to recover / rebuild the project.

This is potentially strong rescue / turnaround evidence, but individual cases need to be identified and quantified before entering a CV.

Follow-up needed:

- client / project pseudonym;
- what failed;
- what Anton changed;
- time to recovery;
- whether the product launched;
- cost / rework avoided.

---

## 15. Product / vendor selection principle: test before committing

Across ZIL and client work, Anton repeatedly used a principle of:

- pilot first;
- progressive rollout;
- evaluate operational fit and adoption;
- avoid large irreversible commitment before evidence exists.

This included CRM trials and other platform selection.

This supports CTO / CIO positioning around **de-risking technology investment**.

---

## 16. Odoo evaluation — rejecting "free" software when TCO was wrong

Anton evaluated Odoo as a possible self-hosted / free platform but concluded that the apparent zero-license-cost proposition was misleading for the organization because:

- it was resource-heavy for available infrastructure;
- integrations / customisation required Python development;
- the organization did not have a convenient in-house development capability for that stack at the time;
- modifications would be slow / expensive relative to alternatives.

The team rejected Odoo and continued evaluating ready-made / lower-code / vendor-supported alternatives.

Executive interpretation: **TCO-driven rejection of superficially cheap software**, including supportability and internal capability as decision criteria.

---

## Cross-role executive patterns surfaced

1. Build systems around operating reality, not nominal org charts.
2. Treat data freshness and ownership as governance problems, not only technical fields.
3. Design platforms for fast future change, not one-off requirements.
4. Use transparency to expose bottlenecks and accountability.
5. Resolve stakeholder disagreement before automating the process.
6. Evaluate technology by total ownership cost, supportability, portability and future rewrite risk.
7. Prefer pilots and progressive rollout over large irreversible commitments.
8. Build operating capability that can survive handoff to other teams / developers.
