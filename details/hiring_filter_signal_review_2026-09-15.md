# Hiring-filter signal review — 2026-09-15

Purpose: distinguish strong career evidence from the signals that are actually used as first-screen filters in the current vacancy pool. This is an internal routing note for CV selection, not resume copy.

## Core observation

A strong outcome and a hard hiring filter are not the same thing. Management scale also needs to be parsed correctly: **team / organization size is not the same as direct-report count**.

Examples:

- `~10x revenue growth` is a strong business result, but it does not satisfy a vacancy that explicitly requires a particular management layer, manager-of-managers experience, or ownership of a larger engineering organization.
- `100+ IT specialists across 100+ institutions` is strong cross-organizational leadership evidence, but it must not be presented as 100+ line reports.
- A vacancy saying `lead 20`, `lead 35+`, `70+ engineers` or `127-person engineering organization` normally describes **total organizational scope unless the wording explicitly says direct reports**. At Head / Director level, large organizations are normally managed through leads and managers.
- `200–300 report runs/day` is useful adoption/throughput context for MosRazvitie, but it is not credible high-load evidence and should not be used to answer production-scale distributed-systems requirements.

## Engineering Manager / Head / Director filters seen repeatedly in the tracker

Current vacancy examples repeatedly make management scope explicit, but the scope is not always direct-report count:

- Tide Engineering Manager: team of 8–12 engineers.
- DataHub Engineering Manager, Ingestion: team of 10–11 engineers.
- Kanpla Engineering Manager: about 10 engineers.
- JustMarkets Head of Corporate IT: distributed IT Administration / Help Desk organization of 20+; this is organizational scope, not evidence that 20+ report directly to one person.
- Maze Engineering Director: scale an engineering organization from roughly 20 toward 35+ engineers / technical leads.
- Made of Storm Head of Frontend Engineering: roughly 70+ frontend engineers **through Team Leads**.
- Greencastle Head of Engineering Delivery: delivery ownership across a 127-person engineering organization.
- Xapo Head of Engineering: engineering leadership across three product tribes; explicit manager-of-managers evidence is a screening issue.
- Paymentology Director of Engineering: lead Engineering Managers and multiple teams.
- Tide Director of Mobile and Web Platform: manage Engineering Managers and Staff Engineers.

The recurring first-screen signals are therefore:

1. **Management scope and org shape.** How large was the whole team/function, how many people reported directly, how many teams existed, and whether Team Leads / Engineering Managers sat underneath. These are separate numbers and must not be conflated.
2. **Span of control.** For an ordinary people manager, a direct span materially above roughly one team is unusual and should not be inferred from total org size. A 20–70+ person scope at Head/Director level normally implies a hierarchy rather than 20–70 direct reports.
3. **Manager-of-managers / hierarchy depth** for Head/Director roles. Indirect coordination helps but does not replace formal management of leads/managers when the vacancy explicitly asks for it.
4. **People-management tenure.** Hiring, performance management, coaching, difficult personnel decisions, team growth, role design and retention.
5. **Delivery scope.** One team vs multiple teams / product tribes / function-level ownership.
6. **Technical credibility appropriate to the role.** Some EM jobs are management-led; others explicitly require 20–70% coding, code review or current cloud-native depth.
7. **Production-domain scale when explicitly required.** Distributed systems, high-volume payments, CDN/DNS, cloud/Kubernetes or specific backend scale can be a hard technical filter.

### Anton's strongest truthful evidence against these filters

- Direct management: **5 IT staff + 2 installation engineers** at ZIL.
- Team design: differentiated specialist ownership, fractional senior DevOps, shared physical-infrastructure capacity, backup coverage and explicit handoffs.
- Hiring/onboarding/training/mentoring and performance management, including personnel changes when inherited performance failed the operating model.
- Operating model remained functional for approximately **18 months after Anton left**.
- Indirect functional coordination: **100+ institutional IT specialists across 100+ institutions** without line authority.
- Vendors/contractors and cross-functional stakeholders managed alongside internal staff.

### Honest limitation

The current evidence supports a **7-person verified direct span** and a much larger **100+ specialist functional-coordination scope**, but not a conventional large software-engineering hierarchy with several Engineering Managers / Team Leads reporting upward through Anton.

That distinction matters more than raw headcount. A vacancy asking for ownership of a 20–70+ person organization may still be plausible if the real filter is function-level leadership, org design and management through leads. A vacancy explicitly requiring prior management of Engineering Managers, several team leads, or a comparable formal reporting hierarchy remains a genuine first-screen risk.

## CTO / Head of Engineering signals

Across current Head/Director vacancies, the strongest recurring signals are:

- org design and scaling;
- hiring and development of engineers / managers;
- resourcing and capacity planning;
- technical strategy and architecture trade-offs;
- delivery predictability and quality;
- reliability / incidents / operational ownership;
- technical debt and platform evolution;
- executive planning and stakeholder work;
- budget / vendor / build-buy judgment where the role is broader than pure product engineering;
- sometimes current hands-on coding or review depth.

Anton has stronger evidence in **operating-model design, technology economics, architecture, vendor/build-buy judgment, cross-functional transformation and business continuity** than in a conventional multi-layer software-engineering reporting hierarchy.

High-value CTO evidence to prefer over low-level implementation detail:

- approximately **RUB 22m** potential replacement/licensing cost avoided through lifecycle and licensing strategy;
- willingness to stop Bitrix24 after approximately **RUB 90k** sunk cost when adoption fit was wrong;
- fractional/shared capability design under tight payroll constraints;
- 160+ stale former-employee accounts found and identity lifecycle rebuilt;
- service transformation with explicit SLAs and large reduction in recurring support demand;
- technology operating model surviving leadership handoff;
- production architectures designed for portability and handoff;
- sector-wide management platform supporting planning/funding across 100+ institutions.

## CIO / Corporate IT filters

Current corporate-IT leadership roles commonly emphasize:

- total IT organization / service-desk scope and reporting structure;
- IAM / joiner-mover-leaver processes;
- SLAs/KPIs and support/service management;
- security, endpoint governance and compliance;
- vendor and procurement ownership;
- budgets / cost control;
- business applications and automation;
- onboarding/offboarding;
- distributed workplace / EUC operations;
- executive stakeholder management.

Anton has direct evidence for nearly all of these. The main scale caveat is that the verified line-management span is 7, while broader scale came through cross-organizational functional coordination rather than a 20+ direct-report structure.

Particularly useful evidence:

- 5+2 direct team;
- 300–600 -> ~150 monthly requests over ~6–12 months;
- routine support often ~10–15 minutes after redesign;
- response and resolution SLAs;
- 160+ stale former-employee accounts -> controlled offboarding;
- licenses/certificates -> planned renewal cycle;
- 100+ remote-work migration during COVID;
- approximately 100-user greenfield IT launch at the Social Development Agency;
- full-cycle 223-FZ procurement responsibility and total-cost decision-making;
- finance/legal/procurement/technical workflows digitized beyond IT.

## Product / Technical Product filters

Team size is much less often the decisive filter for Senior Product roles. Current product vacancies repeatedly emphasize:

- end-to-end product ownership;
- strategy / roadmap / prioritization;
- customer discovery and user research;
- product metrics and measurable outcomes;
- experimentation / validation;
- technical fluency around APIs, integrations, data models and platform constraints;
- cross-functional work with Engineering, Design, Analytics, Sales, Customer Success, Finance or Operations;
- adoption and GTM / rollout depending on the product;
- AI-assisted prototyping / agent workflows in newer technical-product roles.

Anton is strongest where the product is operational / B2B / platform / workflow-heavy rather than pure consumer growth.

High-value product evidence:

- service-business redesign associated with ~10x revenue growth in ~3 months;
- MosRazvitie: product/data/workflow ownership across 100+ institutions; data used for planning and funding;
- event lifecycle: plan -> approval -> responsible staff -> delivery -> report/attendance;
- field-level data freshness and role-based views;
- Bitrix24 -> Pyrus decision after adoption testing;
- Glide -> WeWeb because customization ceiling blocked maps/themes/auth/desktop UX;
- Supabase backend remaining in production ~3 years through full frontend replacement;
- ERP/CRM adoption diagnosis at New Business Environment;
- banking process discovery and workflow transparency.

## Architecture / Solutions filters

Recurring strong signals:

- architecture ownership from discovery through production;
- APIs/integrations/data models/security boundaries;
- customer/stakeholder-facing design;
- migration and legacy modernization;
- production reliability and handoff;
- build/buy/platform trade-offs;
- sometimes explicit cloud/Kubernetes/hyperscale expertise.

Anton's strongest architecture signals:

- production Supabase backend surviving complete frontend rewrite for ~3 years;
- entire production Xano backend later replaceable from Anton's documentation;
- ~70k historical documents migrated into structured backend;
- MosRazvitie enterprise/sector data model and RBAC;
- bank DMS + 1C integration;
- live IBM Domino -> Linux/nginx modernization;
- repeated TCO/portability/supportability platform decisions.

## Scale metrics: how to use them

### Strong as headline when relevant

- 5 IT + 2 installation engineers direct management.
- 100+ institutional IT specialists indirect coordination.
- 100+ institutions served by MosRazvitie.
- ~RUB 22m potential cost avoidance.
- ~10x revenue growth case.
- 300–600 -> ~150 support requests/month.
- 160+ stale accounts/remnant mailboxes remediated.
- 100+ employee remote rollout.
- ~100-user greenfield IT environment.
- ~60 back-office bank users where documents stopped disappearing and deadlines became traceable.
- ~70k historical documents migrated.
- ~3-year backend durability through a frontend replacement.

### Supporting context, not headline scale

- 200–300 report runs/day: good proof of self-service adoption / reporting throughput, **not high-load**.
- server/workstation counts: useful only for a corporate-IT vacancy asking for endpoint/infrastructure scope; otherwise usually weaker than business and management outcomes.
- raw asset counts: useful for asset-management / IT operations roles, weak for CTO/Product/Engineering leadership.

## Routing rule for future CVs

When a vacancy contains an explicit management-scale gate, parse the wording before deciding that Anton does or does not satisfy it:

- `team of X`, `organization of X`, `responsible for X engineers` = normally **total scope**, not automatically direct reports;
- `X direct reports`, `Engineering Managers report to you`, `manage managers / team leads` = explicit hierarchy evidence;
- `lead multiple teams / tribes` = multi-team scope, but reporting structure must be checked rather than invented.

Do not reject a vacancy simply because its total organization is larger than Anton's 7-person direct team. Conversely, do not use the 100+ functional-coordination figure to imply a reporting hierarchy that did not exist.

Suggested evidence priority:

1. explicit hard filter as actually written: direct span, hierarchy depth, total org scope, specific production domain, hands-on share;
2. business result;
3. ownership / decision authority;
4. scope and scale;
5. architecture / operating model;
6. implementation detail.

The master resume should intentionally keep more evidence than any targeted CV. Targeted CVs should cut from this inventory according to vacancy filters rather than re-inventing claims.