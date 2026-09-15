# Anton Nazarov

**Technology Executive / Engineering & Product Leader / Systems Architect**

Belgrade, Serbia  
Portfolio: [Portfolio Index](./portfolio/README.md)

## Profile

Technology leader and systems architect with 18+ years across startups, enterprise, banking, public-sector systems and founder-led businesses. I work at the intersection of engineering, business operations and organizational design: rebuilding under-controlled technology functions, designing products and internal systems, and turning fragmented processes into operating models with explicit ownership, measurable work and lower dependency on individual employees or vendors.

My management experience includes direct leadership of specialized teams, hiring and performance management, vendor and contractor ownership, budget-conscious modernization, and indirect functional coordination across more than 100 institutional IT specialists. I stay technically close enough to architecture and implementation to challenge platform choices, review system boundaries and make trade-offs around cost, portability, maintainability and adoption.

This document is the evidence-rich master resume. Role-specific CVs should select from it rather than trying to preserve every signal.

## High-Signal Management Scope

- **Direct people management:** managed **5 IT staff and 2 installation engineers** at ZIL, with differentiated ownership across service desk/documentation, workplace technology, infrastructure/DevOps, business systems and physical technology.
- **Indirect leadership at scale:** coordinated requirements, operating standards and delivery with **100+ IT specialists across 100+ cultural institutions** without line authority.
- **Hiring and capability building:** hired, onboarded, trained and mentored employees and interns; built capability around specialist ownership rather than interchangeable generalists.
- **Performance management:** introduced explicit responsibilities, measurable service expectations and KPI-based performance management; made personnel changes when inherited arrangements did not meet operating requirements.
- **Organizational design:** combined full-time, fractional and shared specialist capability to obtain senior expertise under tight payroll constraints instead of duplicating every capability as permanent headcount.
- **Delegation model:** diagnose and design the operating model, launch it with the relevant owner, document the process, then delegate steady-state execution while retaining accountability for economics, risk and priorities.
- **Durability:** the ZIL technology/service operating model continued functioning for approximately **18 months after my departure**, indicating that processes and ownership did not depend solely on me.
- **Executive stakeholder work:** worked directly with founders, directors, department heads, public authorities and external technology organizations; represented ZIL in higher-level organizations including Moscow DIT.

## Selected Business & Operating Results

- Helped a service business achieve approximately **10x revenue growth in about three months** after redesigning customer intake, operations and product presentation; growth was organic, without paid advertising.
- Reduced routine client-service work from **hours to minutes** through structured systems, integrations and automation.
- As part of the ZIL management team, supported an anti-crisis turnaround from approximately **RUB 30m in accumulated debt** through internal optimization, automation and tighter technology economics.
- Avoided approximately **RUB 22m** in potential workstation replacement and licensing costs by choosing lifecycle extension and licensing strategy over blanket replacement.
- Rebuilt ZIL support from a largely unmanaged service into a measurable operating model: routine issues were often resolved in approximately **10–15 minutes**, explicit response and resolution SLAs were introduced, and monthly demand fell from roughly **300–600 requests to about 150** over approximately 6–12 months as backlog, workstation inconsistency and recurring user issues were reduced.
- Moved **100+ employees** to secure remote work during COVID while maintaining operating continuity.
- Found **160+ accounts/mailboxes associated with former employees** still active after departure and rebuilt onboarding/offboarding and identity-lifecycle controls so access removal became part of the HR/IT process.
- Converted license and certificate management from surprise expiry and business interruption into a planned renewal/procurement cycle with advance reminders.
- Introduced one tracked event workflow across at least four delivery functions, replacing fragmented phone/email/Excel coordination with shared scheduling, ownership and equipment reservation; approximately **300 events** passed through the workflow during practical use.
- Built AIS MosRazvitie into a sector-wide operational source of truth across **100+ cultural institutions and libraries**, supporting management reporting, planning and resource-allocation decisions; event volume recorded in the system influenced planning and funding.
- Replaced a major **5-hour events-report bottleneck** with server-side reporting completing in seconds to minutes; after redesign the platform handled approximately **200–300 report runs per working day** according to system logs. This is supporting operational scale rather than a high-load claim.
- Built a banking document-management system used by approximately **60 back-office users**; after rollout documents stopped disappearing inside the process, ownership and overdue status became traceable, and internal courier movement was no longer required for routine document circulation.
- Helped stand up the IT function and workplace environment for approximately **100 users** in a newly created organization under an ASAP operating mandate.
- Consolidated field operations and client workflows while migrating approximately **70,000 historical documents** into a structured backend.

## Technology Investment & Architecture Judgment

- Prefer total cost of ownership, supportability, portability and adoption over nominal license price or fashionable technology.
- At ZIL, stopped further investment in **Bitrix24 after approximately RUB 90k had already been spent** when testing showed the platform was too complex for the actual user base; redirected workflow implementation toward Pyrus rather than defending a sunk-cost choice.
- Evaluated Odoo as a self-hosted/free option but rejected it when infrastructure demand, customization requirements and the need for specialized Python development made the real ownership cost unattractive.
- Advised clients away from Glide when customization ceilings constrained the product; moving to WeWeb enabled map-heavy interfaces, themes, better authentication flows and a proper desktop experience.
- Recommended Supabase instead of Airtable for a structured backend; that backend has remained in production for approximately **three years** and survived a complete frontend rewrite without replacement of the core data layer.
- Delivered a production system on Xano despite advising against the platform choice; documentation and architecture were explicit enough that the client later replaced **the entire Xano backend** with an agentically developed alternative.
- Repeatedly use pilots and progressive rollout before major platform commitment, treating adoption and operational fit as investment criteria rather than assuming feature completeness equals success.
- Have rewritten failed externally developed systems rather than continuing to patch architectures that were not economically or technically recoverable.

## Professional Experience

### NeedleBit, Serbia
**Founder / CTO / Systems Architect / Project Manager**  
Nov 2022 - Present

- Work directly with founders and business owners, translating operating constraints into architecture, product scope, automation priorities, ownership boundaries and delivery trade-offs.
- Design and deliver CRM, ERP, internal portal, reporting, marketplace, assessment and field-operations products across PostgreSQL, Supabase, WeWeb, Xano, REST APIs, n8n, Make, Telegram integrations and AI APIs.
- Redesigned customer intake, booking, communication and internal workflows for a service business; the broader restructuring supported approximately **10x revenue growth in about three months** without paid advertising.
- Reduced routine service handling from **hours to minutes** by replacing repeated manual handoffs with structured workflows, integrations and automation.
- Consolidated field operations, client workflows and reporting in one platform and migrated approximately **70,000 historical documents** into a structured backend.
- Design systems around explicit workflow states, permissions, data relationships, notifications and reporting rather than burying business rules in front-end screens.
- Reduce vendor and key-person dependency by separating data, business logic and interfaces and documenting ownership and handover paths.
- Designed a Supabase backend that has remained in production for approximately **three years** and survived a complete frontend rewrite without replacement of the core backend.
- Delivered a production Xano-based system whose entire backend was later replaceable from the architectural documentation, demonstrating portability and handoff quality even when the original platform was not my preferred choice.
- Advise platform changes when product ceilings become material: moved client work away from Glide where customization limits prevented richer map, authentication, theme and desktop experiences.
- Build AI-assisted engineering workflows using repository instructions, bounded tasks, acceptance criteria, architectural guardrails, execution checkpoints, review loops, auditable SQL practices and database-to-git workflows.
- Built PromptlessPress as a structured AI generation system with reproducible prompt composition, execution snapshots, debugging flows and shared backend helpers rather than a thin prompt wrapper.

### New Business Environment
**Implementation Curator / Product Manager**  
Aug 2022 - Nov 2022

- Investigated why technically completed ERP/CRM implementations were failing to become working daily management tools.
- Connected failure to unclear ownership, client communication, post-launch responsibility and implementation method rather than assuming missing features were the root problem.
- Helped shift implementation success from technical acceptance toward actual adoption, managerial ownership and measurable business effect.
- Worked with founders and managers on implementation methodology, role boundaries and post-delivery operating responsibility.

### ZIL Cultural Center
**Head of IT**  
Mar 2020 - Jun 2022

Joined the management team during an anti-crisis period with three technology objectives: reduce operating cost through internal optimization and automation; make ZIL a more technologically progressive cultural venue; and support repositioning toward a modern, youth-oriented organization. I treated reconstruction of the IT function as the prerequisite for wider transformation.

#### People, organization and management

- Managed **5 IT staff and 2 installation engineers** plus vendors and contractors.
- Rebuilt the inherited support model around differentiated specialist ownership instead of one generic support role: service desk/documentation, on-site endpoint capability, deeper remote infrastructure/DevOps expertise and physical-technology support.
- Used fractional senior DevOps capability where the organization needed deeper expertise but did not need or could not economically justify a full-time equivalent role.
- Rewrote responsibilities and operating rules, introduced measurable service expectations and performance management, and made personnel changes where inherited performance did not meet requirements.
- Hired and developed staff from both conventional and nontraditional backgrounds, using training and role design to match people to the work rather than filtering only by prior title.
- Designed overlapping backup capability around critical functions without eliminating specialization.
- Built a service/technology operating model that continued functioning for approximately **18 months after my departure**.

#### Economics, procurement and investment

- As part of the management team, supported turnaround from approximately **RUB 30m accumulated debt** through internal optimization, automation and tighter operating economics.
- Chose lifecycle extension and licensing optimization over blanket workstation replacement, avoiding approximately **RUB 22m** in potential replacement and licensing costs.
- Managed the full IT procurement lifecycle under **223-FZ**: supplier/solution research, technical requirements, procurement coordination, acceptance, implementation through the team and final accountability for the result.
- Evaluated procurement by total organizational cost rather than unit price alone; avoided splitting purchases when additional tender effort and delay would cost more than the line-item price difference.
- Negotiated vendor discounts and trial periods before larger commitment where possible.
- Stopped further investment in Bitrix24 after approximately **RUB 90k sunk cost** when user testing showed poor adoption fit, and shifted process work toward Pyrus.

#### Service operations and business continuity

- Replaced support through corridor conversations, calls and personal messages with a managed HelpDesk system, documented request types, ownership, urgency/business-impact prioritization and explicit response/resolution SLAs.
- Routine issues were often resolved remotely in approximately **10–15 minutes**; monthly request volume fell from roughly **300–600 to about 150** over approximately 6–12 months as backlog was cleared, endpoints were standardized and repeated user issues were reduced through training.
- Used service analytics to identify recurring demand and distinguish system failures from training/process problems rather than treating ticket volume itself as success.
- Centralized working data and standardized endpoints so a failed workstation could be swapped and the employee could continue under the same identity and centrally stored data instead of relying on a specific physical PC.
- Moved **100+ employees** to secure remote work during COVID without interrupting core operations.
- Recovered critical control after a key-person continuity failure, then centralized privileged access, documentation and ownership so core systems no longer depended on one administrator.

#### Security, identity and governance

- Audited personal-data handling, information security, access, licensing, service operations and integration risks across the organization.
- Found more than **160 former-employee accounts/mailboxes** still active and rebuilt identity lifecycle / offboarding so account removal became a controlled HR/IT process.
- Defined role-based access and endpoint-control models; the team standardized permissions, shared storage, domain configuration, public-computer privacy controls and monitoring.
- Moved license, key and certificate tracking into GLPI with advance reminders so renewal/procurement work started before expiry rather than after interruption.
- Rebuilt technology governance for event support, equipment custody and accountability.
- Restored and expanded CCTV/retention and access-control processes; recordings supported approximately three theft investigations and property recovery in some cases.

#### Business-process transformation and products

- Extended the service-management pattern beyond IT into additional internal service functions.
- Built one tracked event-request workflow covering at least IT, lighting, sound and installation/technical setup, replacing fragmented email/phone/Excel coordination with a shared calendar, equipment reservation, history and explicit ownership; approximately **300 events** passed through the process.
- Worked with finance/accounting, legal, procurement and technical operations to move financing requests, contract/procurement initiation, procurement-document workflows and service requests into structured digital processes.
- Led structured CRM selection through requirements discovery, market research, candidate comparison, user pilots and operational-fit testing.
- Supported launch of paid event streaming during COVID as a new digital event capability.
- Contributed product and technology direction for the new website and broader modernization intended to reposition ZIL as a modern cultural venue.
- Represented ZIL in higher-level organizations including **Moscow DIT** and chose centrally provided/shared technology where reuse was economically and operationally preferable to duplicating capability in-house.

### Directorate of Cultural Centers of Moscow
**Senior Manager / IT Architect / Analyst**  
Jan 2017 - May 2023  
*Long-running cross-institutional role held concurrently with later institutional leadership appointments.*

City-level organization coordinating more than 100 cultural institutions. My role combined product and architecture ownership, technology governance, centralized procurement coordination and indirect functional coordination of **100+ institutional IT specialists** outside my reporting line.

#### Cross-organizational leadership

- Coordinated technical requirements, operating standards, implementation decisions and priorities with IT directors, heads of IT and specialists across **100+ institutions**.
- Prepared sector-level technical requirements and represented institutional technology needs in meetings with public authorities.
- Participated in centralized procurement planning and quota allocation, consolidating institutional needs and tracking delivery.
- Hired, onboarded, adapted and mentored employees and interns and designed probation/onboarding processes.

#### AIS MosRazvitie — sector operational platform

- Owned product logic, architecture, data model, workflows, access rules, reporting, governance, implementation and adoption of **AIS MosRazvitie**.
- Turned a widely disliked legacy system into the operational source of truth across **100+ cultural institutions and libraries**.
- Reconstructed the real organizational model with stakeholders: institutions could occupy multiple buildings, buildings could contain spaces assigned to different institutions, and event/staff/section relationships required more flexible structures than the previous rigid hierarchy allowed.
- Expanded the platform into an ERP-like operational and management information system covering organizational structure, spaces, staff, vacancies, salaries/finance where appropriate, clubs and sections, events, accessibility, equipment and infrastructure, city-program participation, KPI and planning data.
- Supported an event lifecycle of **plan -> approval -> assignment of responsible staff -> delivery -> report/attendance**.
- Implemented role-based visibility so leadership, finance, event teams and section managers saw and edited only the data appropriate to their responsibilities.
- Introduced field-level data freshness and completion logic so management could distinguish current from stale information and institutions could update complex records progressively.
- Made urgent equipment/event queries answerable from centralized data rather than requiring a new manual collection from institutions.
- System data supported management planning and resource allocation; **event volume influenced planning and funding**.
- Replaced one major events report that took approximately **5 hours** and was effectively limited to one run per day with server-side reporting completing in seconds to minutes.
- After redesign, system logs showed approximately **200–300 report runs per working day** across central and institutional users; this demonstrates self-service adoption and throughput, not a high-load engineering claim.
- Institutions reused the same reporting layer with organization-level visibility restrictions, including exports for their own downstream workflows.
- Designed platform mechanisms that reduced change lead time: new fields/sections could often be added within approximately a day rather than requiring a long custom-development cycle.
- Built recurring documentation, consulting and BigBlueButton/webinar training for hundreds of users so rollout and data quality were managed together.

#### Reliability, modernization and incident response

- Modernized the live IBM Domino environment, migrated infrastructure from Windows to CentOS/nginx and strengthened authentication/access control without interrupting service.
- Restored public systems after false phishing/malware classification by coordinating remediation and delisting with **Google, Bitdefender, Quttera and Sangfor**.
- During the domain-block incident, normal domain access was impaired for roughly **1.5 days**; maintained fallback access where possible and drove external escalation/recovery.

### Moscow Social Development Agency
**Deputy Head of Digital Development & IT / Acting Head of IT**  
Sep 2019 - Mar 2020

- Helped stand up the IT function and workplace environment for approximately **100 users** in a newly created organization under an ASAP operating mandate.
- Built core end-user and operating IT from near-zero: workstations, domain and policies, network rollout/testing, printers and office hardware, software/licensing, support processes, server/directory integration and contractor coordination.
- Used standardized images, domain policies and parallel deployment methods to bring large numbers of workstations online quickly.
- Introduced HelpDesk and automated inventory to create operating visibility from the start.
- Planned departmental activity, controlled execution and participated in contractor selection and technical acceptance of major digital projects.
- Adapted an open-source internal mapping tool to solve a practical organizational problem in a large multi-floor building where teams had difficulty locating departments and staff.

### Settlement and Savings Bank
**Lead Software Developer / Systems Architect**  
Jan 2013 - Sep 2015

- Worked with executives and department heads to reconstruct document routes, ownership, deadlines, registration rules and regulatory constraints before automating them.
- When department heads disagreed about the operating process, escalated decisions to executive governance, documented the agreed route in detail and only then implemented it.
- Designed and built an internal electronic document-management system from scratch on IBM Lotus Domino with XML-based **1C integration**.
- Approximately **60 back-office users** worked with the system.
- Replaced opaque paper movement with digital copies and explicit status/ownership so multiple employees could work with the same matter without physically circulating the original.
- After rollout, documents no longer disappeared inside the internal process; management could see location, owner, transfer time and overdue status and identify bottlenecks.
- Internal courier movement was no longer required for routine document circulation; the courier remained relevant for external delivery.
- The system addressed an environment where missed document/reporting deadlines created regulatory and financial exposure for the bank.
- Owned the path from process discovery through architecture, development, testing, rollout, training and support while coordinating another developer.

## Product, Delivery & Transformation Evidence

- End-to-end product work: discovery, requirements, process reconstruction, data model, workflow states, access rules, delivery, rollout, adoption and measurement.
- Multi-actor workflow design across clients, employees, institutions, departments and external partners.
- Product adoption judgment: willing to stop a technically capable product when the user/organization fit is wrong rather than defend prior investment.
- Platform/product boundary judgment: distinguish what belongs in shared backend/platform capability from what belongs in product-specific UI or workflow.
- Stakeholder alignment: resolve contradictory process expectations before automating them.
- Scaled adoption: documentation, webinars, support and feedback loops for hundreds of users across 100+ institutions.
- Change management in resistant environments: introduced shared identity, structured HelpDesk use, centralized data, CRM/process systems and explicit operating rules despite initial user resistance.
- Business-process redesign and automation across finance, legal, procurement, service operations, customer/client workflows and regulated document processes.

## Engineering & Architecture Evidence

- Architecture designed for change and handoff rather than dependence on the original implementer.
- Production Supabase backend operating for approximately three years through a complete frontend replacement.
- Production Xano system later able to replace the full backend from architectural documentation.
- Enterprise data modeling across complex many-to-many organizational structures and role-specific access.
- PostgreSQL/Supabase, SQL, RLS, Edge Functions, REST APIs, webhooks, data migration and structured document processing.
- JavaScript/TypeScript, Python, Node.js, Docker, Linux, NGINX, Git/GitHub.
- IBM/HCL Domino, Active Directory, GPO, Windows Server, VMware/virtualization, GLPI, monitoring, VPN and access governance.
- AI-assisted engineering: task decomposition, repository instructions, bounded context, acceptance criteria, guardrails, checkpoints and review rather than unstructured code generation.

## Highlighted Projects

- **AIS MosRazvitie:** sector-wide operational source of truth for 100+ cultural institutions and libraries, combining organizational data, event workflows, planning/reporting, RBAC, data-quality controls and scaled adoption.
- **Exit Lead:** field operations and client-reporting platform with approximately 70,000 historical documents migrated into a structured backend.
- **Andronyevskaya ERP:** self-hosted operational system with role-based workflows, Telegram Mini App access, QR-linked assets, tasks and automation.
- **PromptlessPress:** AI-assisted generation platform with reproducible prompt/execution pipelines, debugging interfaces and engineering guardrails.
- **MetaFox Strengths Explorer:** assessment platform with scoring logic, PDF reporting, peer feedback and administrative tooling.

## Technical Scope

**Leadership & Operations:** team design, hiring/onboarding, performance management, mentoring, delegation, vendor management, procurement, ITSM, SLA/KPI, business continuity, incident recovery  
**Architecture & Product:** systems architecture, process discovery, workflow design, product requirements, data modeling, RBAC, integrations, adoption, reporting, governance  
**Backend / Data / Automation:** PostgreSQL, Supabase, SQL, Edge Functions, Xano, n8n, Make, REST APIs, webhooks, data migration  
**Engineering / AI:** JavaScript, TypeScript, Python, Node.js, Git/GitHub, Docker, OpenAI API, AI-assisted and agentic engineering workflows  
**Enterprise / Infrastructure:** IBM/HCL Domino, Active Directory, GPO, Windows Server, Linux, NGINX, VMware, GLPI, monitoring, VPN, endpoint/access governance  
**Frontend / Builders:** WeWeb, Bubble, Glide, Webflow

## Education

- **Bachelor in Management**, Small Business Management specialization — National Institute of Business, Moscow, 2019
- **Professional retraining in IT for Economics and Government** — Humanities Institute, Moscow, 2019
- **Accounting and Finance background** — Commercial Banking College No. 6, Moscow, 2006–2008

## Languages

- Russian — Native
- English — C1 / Fluent
- Serbian — Working proficiency

## Additional

- Based in Belgrade, Serbia
- Serbian sole proprietor; residence/work authorization evidence maintained separately
- Experience organizing events up to 10,000+ participants
- Built both public-facing products and internal operational systems
