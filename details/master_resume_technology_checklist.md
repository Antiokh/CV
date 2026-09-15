# Technology Checklist for Master Resume

Use this as a working review sheet. Mark each item as:

- `yes`: real hands-on work
- `light`: touched, evaluated, configured, or used in a limited way
- `no`: should not appear in resumes
- `details`: project, years, scale, and what exactly you did

The goal is not to include every word in the Master Resume. The goal is to know what is true, what is strong enough for ATS matching, and what should only appear for targeted vacancies.

## Current Product / Backend / Automation Stack

| Technology | Source signal | Status | Details to add |
|---|---|---:|---|
| Supabase | Upwork, project cases, profile JSON | yes | Advanced/senior hands-on. Backend core for modern projects: managed/self-hosted Docker, WeWeb/Glide/Bubble/custom frontends, Auth, RLS, Edge Functions, Realtime, cron, triggers, API, GitHub sync, AI/MCP workflows. |
| PostgreSQL | Upwork, profile JSON | yes | Strong/core. Relational modeling, functions, triggers, indexes, views, EXPLAIN, optimization, JSONB, enums, test-data generation, load-testing-like datasets. |
| Supabase Auth | Upwork backend profile | yes | Strong. Email/password, programmatic user creation, metadata, role-based patterns, Telegram/external auth context, SendPulse email integration, fake/test users. |
| Supabase RLS | Upwork backend profile | yes | Advanced. Role/owner/object/parent-entity policies, nested access checks, file/comment/task access, multi-role apps and client/admin portals. |
| Supabase Edge Functions | Upwork/backend/AI files | yes | Advanced/production. Trigger/cron/SQL-called functions, API gateways, OpenAI JSON calls, AI image flows, Telegram validation/bot routing, WordPress/WooCommerce integrations, secret-safe backend logic. |
| SQL | old CVs, profile JSON, PromptlessPress | yes | Advanced practical. Complex joins, nested queries, functions, triggers, views, indexes, EXPLAIN, optimization, migrations, imports/exports, test datasets. |
| Xano | Upwork, profile JSON | yes | Solid targeted backend skill. API endpoints, admin endpoints, backend logic, dataset/chart generation, assessment/scoring logic, Bubble-connected projects. |
| REST APIs | Upwork, profile JSON | yes | Strong/core. Supabase REST over tables/views/functions, external APIs, internal wrappers, permission checks, Postman testing, hosted/self-hosted API debugging. |
| API integrations | Upwork, LinkedIn, project cases, ChatGPT shared dictation | yes | Very strong/core. Email, accounting, legal entity lookup/INN, cadastral/object APIs, GeoJSON, geocoding/reverse geocoding, weather/forecast, road/geodata services, spelling APIs, DataMos.ru, Google services, DocsAutomator, WordPress/WooCommerce, Stripe, OpenAI/fal.ai, Telegram, Slack, GitHub, social APIs, 1C/XML. |
| n8n | Upwork, project cases, ChatGPT shared dictation | yes | Strong/core. Multi-step workflows, JS transforms, Google Docs/Sheets/Drive to Supabase migration, OpenAI validation, geocoding/reverse-geocoding flows, DocsAutomator, sub-workflows, webhooks, cron, error/retry/debug loops, self-hosting, JSON export/import and workflow versioning. |
| Make / Make.com | Upwork, project cases, ChatGPT shared dictation | yes | Strong/core. Glide webhooks, Google services, social distribution, Slack/GitHub/email, API integrations, image generation flows, scheduled jobs, routers, error handling, JSON processing, billing/operation optimization through scripts and handlers. |
| Zapier | old Upwork profile | light | Mentioned in older Upwork stack; no strong recent raw detail. Use only if a vacancy asks for Zapier-compatible automation experience. |
| DocsAutomator | Exit Lead case | targeted | Used for report/document generation workflows with n8n/Supabase/Glide in inspection/reporting systems. |
| OpenAI API | profile JSON, project cases, ChatGPT shared dictation | yes | Strong. JSON extraction/validation, document summaries/metadata, image description, rewriting, AI parsing, workflow checks, hallucination detection loops, product workflows, backend calls, resume/cover-letter agent workflows. |
| fal.ai | PromptlessPress / AI delivery, ChatGPT shared dictation | targeted | Strong for AI image-generation workflows, mockups, image variation/description, prompt testing, and cost optimization in PromptlessPress-style visual generation pipelines. |
| AI image-generation APIs | PromptlessPress | yes | PromptlessPress/generative workflows, image-generation services through API/automation pipelines. |
| AI-assisted data parsing | Exit Lead migration | yes | Exit Lead/contact data and document metadata workflows; OpenAI-assisted parsing with validation/manual-review routing. |
| Repository-level AI instructions | AI_NATIVE_DELIVERY | yes | Repository-specific guardrails, task contracts, AI-readable backend documentation, agent-assisted delivery discipline. |
| Agentic workflows / AI guardrails | AI_NATIVE_DELIVERY, raw story | yes | Structured agentic delivery: task decomposition, checkpoints, acceptance criteria, quality gates, context/architecture control. |
| Database-to-git synchronization | AI_NATIVE_DELIVERY, ChatGPT shared dictation | yes | Database-to-GitHub synchronization for Supabase/PostgreSQL: table/function/schema snapshots, update triggers/cron, scoped change descriptions, AI-readable backend documentation. |
| ActivePieces | ChatGPT shared dictation | light | Evaluated/self-hosting alternative to n8n. Less plugin coverage, potentially fewer n8n-specific failure modes; not a production headline yet. |
| SendPulse | ChatGPT shared dictation | targeted | Used inside Supabase auth/email flows for better-looking transactional/user messages. |

## Frontend / Low-Code / No-Code / Product Builders

| Technology | Source signal | Status | Details to add |
|---|---|---:|---|
| WeWeb | Upwork, LinkedIn, project cases | yes | Strong/core. Full app architecture, UI, backend connections, custom components, self-hosting, realtime/multi-user workflows, consulting/mentoring, pattern library. |
| Bubble | Upwork, project cases, OTUS | yes | Solid-to-strong practical + teaching. Zerocoder/OTUS, projects, CSS/JS workarounds, plugins/payments, rescue/migration-aware; not preferred as strategic architecture. |
| Glide | Upwork, Exit Lead, portfolio | yes | Strong practical/production. First modern low-code platform used; Exit Lead internal app, localization, custom dashboards, Make/n8n integrations, troubleshooting/mentoring. |
| FlutterFlow | old Upwork profile | light | Evaluated/interested. Not headline unless mobile-first role specifically asks for it. |
| Adalo | old Upwork profile | light | Evaluated only; not suitable for serious production positioning. |
| AppMaster | old Upwork profile | light | Evaluated/test app. All-in-one/non-standard logic, not preferred. |
| Softr | old Upwork profile | light | Evaluated only; no serious projects. |
| Webflow | old Upwork profile, ChatGPT shared dictation | targeted | Advanced targeted. Built horizontal-scroll/custom JS/CSS/animation project that others refused; strong custom-interaction skill, but WeWeb is preferred for production apps. |
| Webstudio | old Upwork profile | light | Early user/evaluated. Had website, Vercel/custom-domain publishing, self-hosting issues; not production-preferred. |
| Directual | old Upwork profile | light | Evaluated/test app. Non-standard platform logic, low confidence. |
| Airtable | Upwork, raw story, user confirmation 2026-06-02 | yes | Actively used. MetaFox migration source; connected Airtable to Supabase through a wrapper/integration layer. Not preferred as long-term relational backend, but real hands-on migration/integration experience. |
| Tilda | profile JSON tag vocabulary | targeted | Solid targeted website skill: websites, integrations, design, custom blocks, Zero Block, marketing/site work. |
| Astro | ChatGPT shared dictation | targeted | Used with Supabase/Node.js build context and custom sites; useful as modern frontend/build evidence, not the main frontend identity. |
| PWA / Progressive Web Apps | CV sources, NeedleBit, ZIL | yes | Used in NeedleBit and ZIL; browser-installable products independent of app stores. |
| Custom WeWeb components | profile JSON, special frontend | yes | Strong. Adapted/repackaged Vue components, wrappers, config/data binding, reusable components, Telegram/QR/barcode-related components. |
| Reusable UI systems | special frontend | yes | WeWeb/Supabase building blocks, UI elements, layout patterns, frontend logic patterns, component libraries. |
| Figma | old Upwork, OTUS, ChatGPT shared dictation | yes | Strong practical/design/prototyping/teaching. Multiple trainings, clickable prototypes, animations, UI reconstruction, design variations, UI kits, AI-in-Figma teaching. |
| Adobe XD | ChatGPT shared dictation | light | Currently learning/using as an alternative design editor; not yet a headline production skill. |
| After Effects | ChatGPT shared dictation | light | Light design/motion exposure; supporting creative tooling only. |

## Programming / Markup / Scripting

| Technology | Source signal | Status | Details to add |
|---|---|---:|---|
| JavaScript | many sources, ChatGPT shared dictation | yes | Strong/main language. XPages/Dojo/jQuery, browser logic, WeWeb/Vue components, n8n scripts, APIs, DOM/CSS workarounds, Node ecosystem, UserScript-style UI modifications. |
| TypeScript | ChatGPT shared dictation | yes | Practical/current. Used regularly with AI-assisted generation and manual review/control; position as practical TS in JS/Node/frontend workflows, not as a separate senior TS-only identity. |
| Vue.js | ChatGPT shared dictation / WeWeb custom components | yes | Solid practical. Main modern frontend framework exposure through WeWeb/custom components and Vue-oriented component adaptation. |
| React | ChatGPT shared dictation | light | Touched, but Vue is the stronger modern frontend framework. Use only when matching React-adjacent vacancies carefully. |
| HTML | old CVs, Upwork | yes | Strong. Early websites, IBM Domino/XPages, Bubble/WeWeb/Webflow/Tilda, templates and frontend implementation. |
| CSS | old CVs, Upwork | yes | Expert-level practical. Pixel-perfect UI, complex/non-standard layouts, overlays, shadows, responsive fixes, animations, Bubble hacks, Webflow interactions, WeWeb design. |
| Java | old CVs, Directorate | yes | Strong in IBM Domino context. Java agents and Apache POI report generation; not positioned as general Java backend engineer. |
| Python | current repo resume / project work, needs confirmation | yes | Strong practical automation/tool-building. n8n-adjacent processing, Telegram CLI/user API utility, Serbian paušal accounting automation, CV/profile GUI app, licensing system, bots/scripts. |
| Node.js | current repo resume / project work, ChatGPT shared dictation | yes | Solid and increasingly frequent practical use. Astro builds, npm/npx ecosystem, automation, JS/TS tooling, custom scripts, package-based workflows; often preferred over Python when Node libraries fit better. |
| PHP | old Senior Lotus Notes CV, basic knowledge | yes | Long-term practical, not main identity. Websites/utilities, DokuWiki plugins, Composer/debugging, AI-assisted plugin work, WordPress/DokuWiki contexts. |
| VBA | old CVs | yes | Historical/practical. Office automation and legacy enterprise integrations. |
| Visual Basic / VBS | old PDF / Head of Product CV | yes | Historical/practical. Domino/OLE/Visual Basic style integrations and old enterprise scripting context. |
| Bash / SH scripting | old CVs, raw story | yes | Solid historical/practical. MySQL imports, backups, Dropbox/cloud backup, server maintenance, exports/imports, calling Python scripts. |
| Batch / Cmd | old CVs | historical | Old CV hard skill; keep as historical Windows scripting only. |
| XML | old CVs, 1C integration | yes | Strong historical/practical. 1C integration, Domino systems, data exchange, templates. |
| JSON | old PDF / profile context | yes | Strong practical. API payloads, GeoJSON-like map data, Supabase/API/n8n/OpenAI workflows, structured outputs. |
| LotusScript | old CVs | yes | Expert legacy enterprise. Domino/Lotus workflow systems, libraries, integrations. |
| Lotus SSJS | old CVs | yes | Expert legacy enterprise. XPages/server-side JavaScript, Boss-Referent migration, web support. |
| Lotus @Formula | old CVs | yes | Historical/expert Lotus Notes development skill. |
| XPages | old CVs | yes | Expert legacy enterprise. Web apps, Domino modernization, report systems, Java/JS integration. |
| OOP | Russian CV skill lists | yes | Used in bank DMS architecture and enterprise system design. |

## Databases / Data / Enterprise Systems

| Technology | Source signal | Status | Details to add |
|---|---|---:|---|
| IBM/HCL Domino | all old CVs, master profile | yes | Expert legacy enterprise/full-stack foundation: backend, frontend, reports, integrations, admin, migration, performance, training, stakeholders. |
| Lotus Notes | all old CVs | yes | Expert legacy enterprise. Document/workflow systems from Domodedovo, Firm IT, Bank, Synergy/Beluga, Directorate. |
| IBM Lotus Sametime | Bank CV source | yes | Historical/practical administration in bank/enterprise context. |
| Lotus Enterprise Integrator / LEI | old CVs | yes | Historical/practical. Studied/used in Lotus environment; later often bypassed with direct XPages/custom integrations. |
| Boss-Referent | old CVs | yes | Strong historical. Modified Boss-Referent, translated libraries to JS/SSJS, web adaptation, modules/databases. |
| 1C / 1C:Enterprise | old CVs, Bank integration | yes | Practical integration/user setup. 1C XML exchange, HR structure integration requirements, employee data export. |
| MySQL | old CVs, freelance | yes | Solid historical/practical. Private servers, CMS/web contexts, imports, backups, PHP utilities. |
| MS SQL / MSSQL | old CVs/profile skill list, ChatGPT shared dictation | yes | Practical integration/infrastructure experience. Firm IT integration contour through Lotus Enterprise Integrator/AccessApp; ZIL/Octagram ran on MS SQL, and internal protected databases/library-fund data were moved into that MS SQL contour. |
| MongoDB | old management CV skill list | light | Touched/evaluated. NoSQL/document-oriented logic is familiar through deep IBM Domino background, but MongoDB itself should not be a headline skill. |
| Firebase | enterprise_it_path_raw | light | Touched/evaluated; not a core skill. Use only as broad NoSQL/backend exposure if relevant. |
| MS Access | old Lotus Notes CV | light | Old CV user/database skill; not current/core. |
| NoSQL databases | old PDF / Domino context | yes | Strong conceptual/practical document-oriented background through IBM Domino; MongoDB/Firebase touched but not headline. |
| Apache POI | Directorate case, ChatGPT shared dictation | yes | Strong in Directorate. Java/Apache POI Excel/report generation: exports reduced from about 5 hours to 1.5 seconds-1.5 minutes; up to about 40k styled rows, streaming mode beyond that. |
| FTSearch | old CV hard skills | historical | Old Lotus Notes hard skill; keep in legacy Domino/Lotus context only. |
| CSV exports | Cashdesk raw story | yes | Cashdesk/accounting and data export workflows; also general migration/import/export experience. |

## Infrastructure / Operations / ITSM

| Technology | Source signal | Status | Details to add |
|---|---|---:|---|
| Windows Server 2000-2016 / 2012 R2 | old CVs, ZIL | yes | Historical/practical infrastructure administration, ZIL/old CVs. |
| Windows 95-10 | old CVs | historical | Broad historical Windows support/admin experience; not a current headline. |
| Windows 7-10 migration | ZIL raw sources | yes | ZIL modernization work. |
| Linux | old CVs, Upwork | yes | Strong practical/historical. Private servers, Domino migration, self-hosting, n8n/Supabase/Docker contexts. |
| Ubuntu | old CVs, ZIL | yes | Historical/practical server/desktop support and ZIL infrastructure. |
| CentOS | old CVs, Directorate/ZIL | yes | Strong in Directorate/ZIL; Domino migration from Windows to CentOS/Linux. |
| Linux Mint / Lubuntu | old CVs | historical | Old CV Linux distro exposure; not headline. |
| nginx | Directorate/PDF | yes | Directorate reverse proxy/caching/security; Domino behind nginx. |
| nginx reverse proxy | Directorate/PDF | yes | Directorate production setup, caching, SSL/security improvement. |
| A+ SSL hardening | Directorate/PDF | yes | Directorate nginx reverse-proxy/security setup; exact scanner can be confirmed if needed. |
| Docker | old CVs, Upwork | yes | Self-hosted Supabase/n8n and modern infrastructure contexts. |
| Hyper-V | old CVs, ZIL | yes | ZIL infrastructure: HP ProLiant/Hyper-V servers and virtual machines. |
| VMware ESXi | old CVs / experience full | yes | Directorate development/replica VMware VM and old infra context. |
| DNS | old CV hard skills | yes | Old infra hard skill; likely practical in server/network administration. |
| DHCP | old CV hard skills | yes | Old infra hard skill; likely practical in server/network administration. |
| Active Directory | Agency/ZIL sources | yes | Strong IT operations. Full AD rollout as central infrastructure layer: accounts, groups, access lifecycle, Synology/resources, GLPI, Octagram/access control, departmental directory synchronization. |
| GPO | Agency/ZIL sources | yes | Strong. Automatic browser/software/basic workstation settings, restrictions, and security policies through Group Policy. |
| LDAP | old CV hard skills | historical | Old infrastructure hard skill; keep as supporting infra exposure. |
| OCS Inventory | old CV hard skills | historical | Old infra hard skill; GLPI automatic inventory is stronger/current evidence. |
| GLPI | Agency/ZIL sources | yes | Strong ITSM/asset lifecycle. HelpDesk + automatic inventory + AD/domain integration + inventory numbers + equipment lifecycle + licensing/support processes. |
| Zabbix | ZIL sources | yes | ZIL monitoring: switches, cameras, Octagram, Synology and other critical infrastructure components. |
| SoftEther VPN | ZIL sources | yes | Remote access/VPN for users outside office during COVID remote-work transition. |
| Zentyal | old CV hard skills | historical | Old infra hard skill; not current/headline. |
| NethServer | ZIL sources | yes | ZIL infrastructure stack. |
| SSH | old CV hard skills | yes | Practical Linux/server administration. |
| RDP | old CV hard skills | yes | Practical Windows/server administration. |
| Synology NAS | ZIL sources | yes | Strong ZIL infrastructure. Domain-integrated file storage with AD accounts/groups, file/folder permissions, site/services modules, centralized access model. |
| IP PBX / SIP telephony | Agency/ZIL sources | yes | Agency/ZIL architecture and telephony/account control. |
| Ethernet / optical network | old Senior Lotus Developer CV | yes | ZIL/old Senior Lotus Developer infrastructure scope. |
| Wi-Fi infrastructure | Agency source | yes | Agency new organization architecture. |
| CCTV | ZIL sources | yes | Strong ZIL infrastructure. Full CCTV restart/stabilization, Hikvision rebuild, disk replacement, RAID/mirroring, recovery behavior after link loss. |
| Hikvision | ZIL sources | yes | Strong ZIL CCTV stack: rebuilt Hikvision-based system, storage/RAID/recovery stabilization. |
| AxxonNext | ZIL sources | yes | ZIL CCTV stack. |
| Kaspersky / endpoint security | enterprise_it_path_raw | yes | ZIL infrastructure: licensing checks, endpoint/security context, domain-linked control environment. |
| PACS / access control | ZIL sources | yes | ZIL access-control infrastructure tied to Active Directory, Octagram, employee accounts, passes, domain groups and centralized access lifecycle. |
| Octagram | ZIL sources | yes | Strong ZIL access-control experience: access points, passes, synchronization, employee/account alignment with staffing structure, XML/integration/support, tied into AD/domain infrastructure. |
| Koha | old Senior Lotus Developer CV | needs confirmation | Listed in old Senior Lotus Developer CV; no detail in new tech-path log. |

## APIs / Integrations / External Services

| Technology | Source signal | Status | Details to add |
|---|---|---:|---|
| Telegram bots | project cases/raw story | yes | Strong. Supabase Edge Functions bot/router logic, Telegram APIs, Python utilities, internal alerts. |
| Telegram Mini Apps | Andronyevskaya ERP | yes | Andronyevskaya ERP and WeWeb/Supabase Telegram validation/login workflows. |
| Telegram channel integration | Serbia Networking App | yes | Serbia Networking App and automation workflows. |
| QR code workflows | Andronyevskaya ERP / QR Cloud | yes | Andronyevskaya ERP equipment access and QR Cloud digital business card/product workflows. |
| Barcode workflows | profile JSON custom components | yes | Profile/custom component practice; likely in WeWeb/custom component context. |
| Yandex Maps API | Directorate sources, ChatGPT shared dictation | yes | Directorate public object map; JSON/GeoJSON-like map data from IBM Domino/XPages with organization/director/public-data display. |
| DataMos.ru | ChatGPT shared dictation | targeted | Moscow open-data/institutional data integration context in Directorate-era systems. |
| Geocoding / reverse geocoding | ChatGPT shared dictation | yes | Used in API/n8n workflows for geodata validation, object lookup, address checks and hallucination detection loops. |
| Weather / forecast APIs | ChatGPT shared dictation | targeted | Used in API integrations and Glide-style applications requiring live weather/geolocation data. |
| Legal entity / INN lookup APIs | ChatGPT shared dictation | targeted | Used for legal entity and taxpayer/INN information lookups in integration workflows. |
| Spelling / text-check APIs | ChatGPT shared dictation | targeted | Integrated spelling/text-check services in broader API workflows. |
| Bing Translate integration | Educate Online raw story | yes | Educate Online multilingual scaling/base translation. |
| Google Drive migration | Exit Lead | yes | Exit Lead: approx. 70,000 historical documents to Supabase. |
| Google Sheets migration/workflows | raw story / Exit Lead | yes | n8n/Make/Exit Lead workflows and migration patterns. |
| Microsoft Office OLE integration | Domodedovo / old CVs | yes | Domodedovo/Lotus enterprise integrations. |
| 1C XML exchange | Bank sources | yes | Bank DMS integration with 1C employee/HR data and XML exchange. |
| Social/messenger links | QR Cloud | yes | QR Cloud public profiles and contact/social links. |
| Make.com social distribution | Dobri Tours | yes | Dobri Tours/social distribution and Make workflows. |

## CMS / Web / Design / Office Tools

| Technology | Source signal | Status | Details to add |
|---|---|---:|---|
| WordPress | old Upwork profile / freelance raw story | yes | Practical. WordPress/WooCommerce integrations, PHP/web context. |
| Other CMS platforms | old CVs | yes | Historical freelance website work across CMS platforms. |
| Web servers | old Lotus Notes CV / freelance | yes | Historical/practical web server support and self-hosting context. |
| Bootstrap | Directorate old CV | yes | Directorate old CV/web UI context. |
| jQuery | raw/PDF Directorate | yes | Directorate/XPages era and JavaScript history. |
| Dojo | raw/PDF Directorate | yes | XPages/IBM Domino JavaScript history. |
| Photoshop | old CV hard skills | yes | Significant design background. |
| Illustrator | ChatGPT shared dictation | light | Supporting design-tool exposure alongside Photoshop/Adobe XD; not a resume headline unless design tooling is relevant. |
| Paint.NET | old CV hard skills | light | Old design tool exposure. |
| GIMP | old CV hard skills | light | Old design tool exposure. |
| Inkscape | old CV hard skills | light | Old design/vector tool exposure. |
| CorelDRAW | old CV hard skills | light | Old design/vector tool exposure. |
| Microsoft Office | old CV hard skills | yes | Very advanced. User training across companies, documents, spreadsheets, templates, reporting, standard operations, plus VBA/OLE/document workflows. |
| LibreOffice | old CV hard skills | yes | Very advanced office-suite/user-training context; include only when office-suite breadth matters. |
| OpenOffice | old CV hard skills | yes | Very advanced office-suite/user-training context; include only when office-suite breadth matters. |
| KOffice | old CV hard skills | yes | Very advanced office-suite/user-training context historically; rarely resume-relevant. |
| Information security training | enterprise_it_path_raw | yes | Trained employees on access discipline, account safety, remote work, internal systems, and basic security behavior. |
| OnlyOffice | old CV hard skills | yes | Very advanced office-suite/user-training context; include only when office-suite breadth matters. |

## Delivery / Process / Management Methods

| Method / practice | Source signal | Status | Details to add |
|---|---|---:|---|
| ITIL | old CVs, ZIL/Agency | yes | IT support/service-management training and ZIL/Agency support operations. |
| ITSM | old CV skill lists | yes | GLPI/HelpDesk/service discipline, ITSM skill-list context. |
| DevOps service thinking | education sources | yes | Education/training and service-management perspective. |
| Kanban | old Senior Lotus Developer CV | yes | Project management method used/claimed in ZIL/old CV context. |
| Agile | old Senior Lotus Developer CV | yes | Bank weekly agile-like schedule and project-management context. |
| Waterfall | old Senior Lotus Developer CV | yes | Project management method used/claimed in old CV context. |
| SMART tasking | raw AI-management notes | yes | Raw AI-management notes: tasking, decomposition, control. |
| FAST tasking | raw AI-management notes | yes | Raw AI-management notes. |
| Acceptance criteria | AI_NATIVE_DELIVERY | yes | AI-assisted delivery and implementation quality control. |
| Quality gates | AI_NATIVE_DELIVERY | yes | AI-assisted delivery and managed execution. |
| Repository guardrails | AI_NATIVE_DELIVERY | yes | AI_NATIVE_DELIVERY and repo-level agent workflows. |
| DISC / DISK | old CV / management sources | light | Old management/soft-skill source; not a technical stack item. |

## Items to Be Careful With

These are not strong headline skills yet, or the latest raw sources still do not give enough detail for broad Master Resume use:

- Koha — was present somewhere in the infrastructure, but details are not remembered well enough to describe as a separate skill.
- MongoDB — touched/evaluated; NoSQL logic is strong through IBM Domino, but MongoDB itself is not a headline skill.
- Firebase — touched/evaluated only.
- React — touched/light only.
- FlutterFlow — evaluated/light, interested, not headline.
- AppMaster — evaluated only.
- Directual — evaluated only.
- Webstudio — evaluated/early user, not preferred.
- Adalo — evaluated only.
- Softr — evaluated only.
- Activepieces — evaluated only.
- Adobe XD — learning/emerging.
- C++ / C# — historical modification only.
- KOffice / LibreOffice / OpenOffice / OnlyOffice — real advanced office-suite experience, but rarely resume-relevant unless the role explicitly involves user training, document workflows, or office migration/support.
