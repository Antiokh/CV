# Role Signal Profiles

This file defines how to route Anton Nazarov's evidence into role-family CVs after a vacancy has been parsed through `EXPECTATION_TAXONOMY.md`.

It does not replace vacancy-specific analysis. A concrete vacancy always wins over generic role stereotypes.

Use sequence:

`vacancy -> Pain Map -> expectation map -> hard-filter interpretation -> evidence matrix -> role profile -> tailored CV shell -> coverage audit`

Related canonical files:

- `GPT/EXPECTATION_TAXONOMY.md`
- `GPT/ANTON_EVIDENCE_MATRIX.md`
- `GPT/work-application-manager/references/application-positioning-v1.md`
- `GPT/work-application-manager/references/role-entry-strategy-v1.md`
- `GPT/CV_EVIDENCE_FIRST_RULES.md`
- `GPT/RESUME_ADAPTATION_WORKFLOW.md`

## General routing rules

1. **The vacancy determines expectations; the role profile only supplies priors.**
2. **Hard filters outrank impressive but unrelated achievements.** If the screen is people management, show people management before architecture.
3. **Business outcome and hiring filter are separate signals.** A `~10x revenue` case is strong but does not prove manager-of-managers experience.
4. **Use the master CV as inventory, not prose source.** Select evidence; do not copy every master bullet.
5. **Keep direct span, total org scope and influence-without-authority separate.**
6. **Do not force symmetry.** Different role families need different evidence order and different depth by employer.
7. **Expose gaps internally.** Do not write around an explicit unsupported requirement with ambiguous language.

## Profile schema

Each role profile contains:

- **default shell** — closest existing canonical role CV;
- **first-screen expectations** — signals recruiters/hiring managers are likely to look for first;
- **priority order** — default expectation sequence before vacancy-specific override;
- **best Anton evidence** — preferred proof blocks from `ANTON_EVIDENCE_MATRIX.md`;
- **known risk/gaps** — what not to blur;
- **top-third rule** — what must normally be visible in Profile / Role Fit / first third;
- **de-emphasize** — evidence that can be true but weakens this particular narrative.

---

# 1. Product Manager / Technical Product Manager

**Default shell:** `RESUME_TECHNICAL_PRODUCT_MANAGER.md`

## First-screen expectations

- end-to-end product ownership;
- discovery / user and stakeholder understanding;
- prioritization and roadmap judgment;
- metrics and measurable product/business outcomes;
- cross-functional delivery with engineering/design/operations/business;
- technical fluency around APIs, integrations, data and platform constraints;
- adoption and rollout;
- domain/platform depth where explicitly requested.

## Default priority order

1. E05 Product ownership/discovery
2. E07 Business impact
3. E06 Metrics/validation
4. E04 Delivery ownership
5. E16 Adoption/change
6. E09 Architecture/technical product depth
7. E17 Stakeholder influence
8. E14 Workflow/business applications when relevant

## Best Anton evidence

Primary:

- **A14 MosRazvitie** — end-to-end product/data/workflow ownership across 100+ institutions; planning/funding relevance.
- **A01 service-business redesign** — ~10x revenue outcome and operational product redesign.
- **A09 Bitrix24 -> Pyrus** — stopped sunk-cost path after adoption testing.
- **A24 New Business Environment** — diagnosed adoption/ownership failure after technically completed ERP/CRM delivery.
- **A21 Glide -> WeWeb** — platform ceiling decision tied to product experience.

Secondary:

- A15 report performance transformation;
- A18 banking DMS/process discovery;
- A19 durable Supabase backend;
- A10 event lifecycle/workflow.

## Top-third rule

Normally show at least:

- one product-ownership case;
- one measurable business/adoption outcome;
- one technical/platform decision if the role is technical product.

Do not let CTO/CIO language push discovery, product decisions and adoption below the fold.

## Known risks / gaps

- Pure consumer-growth experimentation may be less directly evidenced than operational/B2B/platform product work.
- Do not use raw report volume as product-scale headline.
- Do not let `Founder/CTO` title obscure a continuous product lineage.

## De-emphasize

- workstation/asset/server inventory;
- CCTV/physical security;
- generic infrastructure operations unless the product is infra/platform.

---

# 2. AI Product / AI Transformation

**Default shell:** `RESUME_AI_PRODUCT_TRANSFORMATION.md`

## First-screen expectations

- applied AI tied to a real workflow/product problem;
- product or transformation ownership;
- safe/repeatable AI delivery practices;
- automation/integration architecture;
- business/adoption outcome;
- ability to distinguish useful AI from novelty;
- stakeholder/change management.

## Default priority order

1. E20 AI/agentic delivery
2. E05 Product ownership
3. E07 Business impact
4. E18 Transformation
5. E09 Architecture
6. E16 Adoption/change
7. E06 Validation/measurement

## Best Anton evidence

Primary:

- **A29 applied AI / agentic engineering discipline**.
- **A20 Xano architecture -> later agentic full-backend replacement**.
- **A01 service-business redesign** when AI/automation is relevant to the vacancy.
- **A24 adoption diagnosis** for transformation-heavy roles.

Secondary:

- A19 durable backend/decoupling;
- A02 hours-to-minutes automation;
- PromptlessPress evidence within A29.

## Top-third rule

Current AI delivery evidence must appear before older enterprise infrastructure experience.

## Known risks / gaps

- Do not imply ML research, model training, deep data science or MLOps if vacancy expects them and evidence is absent.
- Applied AI + architecture + product/transformation is the strongest story.

## De-emphasize

- older corporate-IT detail unless it proves transformation/governance pattern.

---

# 3. Applied AI Engineer / AI Principal

**Default shell:** choose technical/AI shell according to vacancy; `RESUME_AI_PRODUCT_TRANSFORMATION.md` may supply business context but must not hide technical proof.

## First-screen expectations

- recent hands-on applied AI work;
- agent/workflow architecture;
- APIs, integrations, data and automation;
- debugging/review/guardrails;
- production usefulness and auditability;
- senior technical judgment.

## Default priority order

1. E20 AI/automation
2. E10 Current technical depth
3. E09 Architecture
4. E04 Delivery ownership
5. E11 Production/reliability where relevant
6. E07 Business impact

## Best Anton evidence

- **A29 agentic engineering discipline**.
- **A20 Xano replacement/handoff**.
- **A19 Supabase backend durability**.
- **A22 70k document migration**.
- A02 automation outcome where implementation details support it.

## Top-third rule

Open with current technical work, not management biography.

## Known risks / gaps

Explicitly check:

- Python depth expected;
- ML/model-training requirement;
- vector/search/RAG requirements;
- cloud/Kubernetes/MLOps depth;
- percentage of coding expected.

Do not use 18+ years of technology work to paper over a current-stack gap.

---

# 4. Engineering Manager

**Default shell:** `RESUME_ENGINEERING_MANAGER_HEAD.md`

## First-screen expectations

- actual people leadership;
- team size / span / shape;
- hiring, performance, coaching and role design;
- delivery ownership;
- technical judgment and architecture credibility;
- prioritization/capacity planning;
- cross-functional work;
- current coding depth if explicitly required.

## Default priority order

1. E01 People leadership
2. E02 Org design
3. E04 Delivery ownership
4. E10 Technical depth appropriate to vacancy
5. E09 Architecture
6. E17 Stakeholder influence
7. E18 Operating model
8. E11 Production/reliability

## Best Anton evidence

Primary:

- **A03 ZIL 5+2 direct team**.
- **A04 operating model durable ~18 months after departure**.
- **A06 support operating model + measurable SLA/demand result**.
- **A13 100+ specialist coordination** as secondary scale/influence, never direct span.

Technical reinforcement:

- A29 current AI-assisted engineering;
- A19/A20 architecture portability/handoff;
- A14 platform ownership.

## Top-third rule

The first third must answer `Has he actually managed people?` explicitly.

Show:

- `managed 5 IT staff + 2 installation engineers`;
- hiring/performance/role design/delegation;
- operating result from that management.

Architecture or 100+ coordination must not appear as substitutes for this.

## Known risks / gaps

- Formal management of Engineering Managers / several Team Leads is not established.
- Recent conventional coding depth may be a hard filter for some EM roles.
- ZIL team was IT/mixed technology, not a conventional SaaS product-engineering team; use architecture/delivery evidence to bridge only where truthful.

## De-emphasize

- procurement and asset detail unless role includes them;
- product revenue case before people-management evidence.

---

# 5. Head of Engineering / Engineering Director

**Default shell:** `RESUME_ENGINEERING_MANAGER_HEAD.md`, but run a stricter hierarchy check than for ordinary EM.

## First-screen expectations

- total org scope;
- manager-of-managers / hierarchy depth;
- org design and scaling;
- hiring/development of managers and senior engineers;
- portfolio/multi-team delivery;
- architecture/technical strategy;
- capacity/resource planning;
- reliability and executive stakeholder ownership.

## Default priority order

1. E03 Manager-of-managers / hierarchy depth
2. E02 Org design/scaling
3. E01 People leadership
4. E04 Multi-team delivery
5. E09 Technical strategy/architecture
6. E17 Executive stakeholders
7. E11 Reliability
8. E08 Resourcing/economics

## Best Anton evidence

- A03 direct team and differentiated capability design;
- A04 durable operating model;
- A13 large functional coordination scope;
- A14 multi-institution platform governance;
- A05/A08 for resource/economic judgment;
- A19/A20/A29 for technical strategy/current credibility.

## Top-third rule

If vacancy explicitly asks for management of Engineering Managers/Team Leads, surface the gap internally before drafting. Do not make A13 look like a reporting hierarchy.

## Known risks / gaps

This is the highest management-scale risk family:

- no strong current evidence of several Engineering Managers reporting to Anton;
- no conventional 20–70+ software-engineering org hierarchy established;
- cold-entry probability depends heavily on whether the vacancy values function-level leadership and architecture versus a standard scaled SaaS engineering ladder.

A strong Fit can still exist for transformation/architecture-heavy Head roles, but hierarchy requirements must be interpreted literally.

---

# 6. CTO / Technology Director

**Default shell:** `RESUME_FRACTIONAL_CTO.md`

## First-screen expectations

- business/technology ownership;
- technology economics and resource allocation;
- team/org design;
- architecture and platform strategy;
- delivery and operating control;
- reliability/security risk;
- vendor/build-buy choices;
- executive stakeholder work;
- product/business impact;
- current technical credibility appropriate to company stage.

## Default priority order

1. E07 Business impact
2. E08 Technology economics/resource allocation
3. E02 Organization design
4. E09 Architecture strategy
5. E04 Delivery ownership
6. E11 Reliability/continuity
7. E12 Security/risk
8. E13 Vendor/build-buy
9. E17 Executive influence
10. E01 People leadership
11. E20 AI where relevant

## Best Anton evidence

Primary:

- **A05 ~RUB22m potential cost avoidance**.
- **A03 team/org design**.
- **A04 durability after handover**.
- **A09 stop sunk-cost CRM decision**.
- **A19/A20 portable production architecture**.
- **A14 sector-wide platform/data governance**.
- **A01 ~10x service-business growth**.

Secondary:

- A08 procurement/TCO;
- A11 continuity under COVID;
- A12 key-person risk;
- A07 identity risk;
- A29 AI delivery when strategic.

## Top-third rule

Top section should answer:

- What business/economic decisions did he own?
- What organization did he lead/design?
- What architecture/risk decisions survived production?

Do not headline SSDs, servers, blocklists or helpdesk tools. Translate them into economics, continuity, risk or operating control.

## Known risks / gaps

- External trust/career-shape issue remains for some CTO screens.
- For startup CTO roles expecting recent deep IC coding, current stack requirement must be checked separately.
- Formal manager-of-managers evidence is limited.

## De-emphasize

- raw endpoint/server counts;
- narrow operational incidents unless they prove decision quality;
- implementation tool catalogues.

---

# 7. CIO / IT Director / Head of IT

**Default shell:** `RESUME_CIO_HEAD_OF_IT.md`

## First-screen expectations

- IT organization and service-desk leadership;
- IAM/onboarding/offboarding;
- service levels/KPI;
- security/compliance;
- infrastructure/workplace continuity;
- vendor/procurement and budget/cost control;
- business applications and process automation;
- executive stakeholder management;
- incident/recovery ownership;
- transformation beyond IT.

## Default priority order

1. E01 People leadership
2. E18 Operating-model transformation
3. E11 Reliability/service operations
4. E12 Security/IAM
5. E08 Technology economics
6. E13 Procurement/vendors
7. E14 Business applications/workflow
8. E17 Executive stakeholders
9. E04 Delivery
10. E02 Org design

## Best Anton evidence

Primary:

- **A03 5+2 direct team**.
- **A06 300–600 -> ~150 tickets; 10–15 min routine resolution; SLA**.
- **A07 160+ stale accounts -> controlled identity lifecycle**.
- **A08 223-FZ procurement/TCO**.
- **A11 100+ remote employees during COVID**.
- **A17 ~100-user greenfield IT function**.
- **A05 ~RUB22m potential avoided cost**.

Secondary:

- A26 license/certificate planned cycle;
- A10 cross-department workflows;
- A12 privileged-access/key-person continuity;
- A27 physical security only when relevant;
- A28 asset/workstation/service inventory only for corporate-IT filters.

## Top-third rule

People-management scope, service transformation, security/IAM and economics should be visible before technical inventory.

## Known risks / gaps

- Large annual budget figure is not yet canonical.
- 20+ IT organization claims must not be invented; verified direct span is 7, wider scale is functional coordination.

---

# 8. Solutions / Systems Architect

**Default shell:** `RESUME_SOLUTIONS_ARCHITECT.md`

## First-screen expectations

- architecture ownership from discovery to production;
- data/API/integration design;
- security/access boundaries;
- migration/modernization;
- platform/vendor trade-offs;
- customer/stakeholder-facing design;
- production reliability and handoff;
- relevant cloud/stack depth.

## Default priority order

1. E09 Architecture
2. E19 Client-facing solution design
3. E04 Delivery ownership
4. E13 Platform/build-buy
5. E10 Technical depth
6. E11 Reliability
7. E15 Data/control
8. E12 Security

## Best Anton evidence

Primary:

- **A19 Supabase backend survived full frontend rewrite ~3 years**.
- **A20 Xano backend fully replaceable from architecture/docs**.
- **A14 MosRazvitie data model/RBAC/source of truth**.
- **A22 ~70k-document migration**.
- **A18 bank DMS/process/data workflow**.

Secondary:

- A30 Odoo TCO rejection;
- A21 Glide -> WeWeb;
- A15 report architecture/performance;
- A25 live incident recovery;
- A23 3,000+ user Domino environment.

## Top-third rule

Lead with durable architecture and production handoff, not management generalities.

## Known risks / gaps

Vacancy-specific cloud/Kubernetes/hyperscale requirements can remain hard gaps even when general architecture evidence is strong.

---

# 9. Delivery / Transformation Manager

**Default shell:** `RESUME_DELIVERY_TRANSFORMATION_MANAGER.md`

## First-screen expectations

- rescue / stabilization;
- end-to-end delivery;
- cross-functional stakeholder alignment;
- operating-model redesign;
- measurable throughput/service/adoption improvement;
- process ownership and handoff;
- vendor/team coordination;
- change management.

## Default priority order

1. E18 Transformation
2. E04 Delivery ownership
3. E17 Stakeholder influence
4. E16 Adoption/change
5. E06 Operational metrics
6. E14 Workflow/business applications
7. E01 People leadership
8. E11 Continuity/risk

## Best Anton evidence

Primary:

- **A06 support transformation**.
- **A10 event workflow across 4+ functions / ~300 events**.
- **A18 bank DMS and stakeholder governance**.
- **A14 MosRazvitie platform transformation**.
- **A24 ERP/CRM adoption diagnosis**.

Secondary:

- A17 greenfield agency IT;
- A11 COVID remote rollout;
- A04 durable handover;
- A16 support capacity redesign.

## Top-third rule

Show a before/after operating state, not `managed projects` prose.

---

# 10. ERP / Business Applications Manager

**Default shell:** `RESUME_ERP_BUSINESS_APPLICATIONS_MANAGER.md`

## First-screen expectations

- workflow/process discovery;
- ERP/CRM/DMS/business-app ownership;
- integrations/data model/RBAC;
- adoption and rollout;
- source-of-truth/reporting;
- stakeholder/process governance;
- vendor/platform decisions;
- measurable operational result.

## Default priority order

1. E14 Business applications/workflow
2. E16 Adoption/change
3. E15 Data/reporting/control
4. E04 Delivery ownership
5. E17 Stakeholder governance
6. E09 Architecture
7. E13 Vendor/platform decision
8. E06 Metrics

## Best Anton evidence

Primary:

- **A18 bank DMS ~60 users / documents stopped disappearing**.
- **A14 MosRazvitie ERP-like operational platform**.
- **A10 event workflow**.
- **A09 Bitrix24 -> Pyrus sunk-cost decision**.
- **A24 ERP/CRM adoption diagnosis**.

Secondary:

- A22 70k-document migration;
- A21/A30 platform selection;
- A26 lifecycle tracking as service-management extension.

## Top-third rule

System/tool names are secondary. Lead with process ownership, adoption and management control.

---

# 11. Cross-role evidence visibility rules

Some evidence is strong but should be routed differently by role.

| Evidence | CTO | CIO | EM | Product | Architect | Delivery | ERP |
|---|---|---|---|---|---|---|---|
| A03 5+2 direct team | TOP | TOP | TOP | supporting | supporting | strong | supporting |
| A13 100+ functional specialists | strong | strong | supporting | strong | strong | TOP | supporting |
| A05 ~RUB22m avoidance | TOP | TOP | supporting | optional | supporting | strong | optional |
| A06 service transformation | strong | TOP | TOP | optional | optional | TOP | supporting |
| A14 MosRazvitie | TOP/strong | strong | supporting | TOP | TOP | TOP | TOP |
| A19 durable Supabase backend | TOP/strong | optional | supporting | strong | TOP | supporting | supporting |
| A18 bank DMS | supporting | strong | optional | strong | strong | TOP | TOP |
| A09 sunk-cost CRM stop | TOP | strong | optional | TOP | supporting | strong | TOP |
| A29 applied AI | TOP if relevant | optional | strong if relevant | strong if relevant | strong | supporting | optional |

`TOP` means normally visible in first third when relevant to the concrete vacancy.

## 12. Role-profile selection algorithm

For each vacancy:

1. Choose the closest role family **only as a starting shell**.
2. Extract all material expectations from the actual vacancy.
3. Mark each as `MUST / STRONG / OPTIONAL` and hard-filter status.
4. Map each expectation to evidence blocks and strength scores.
5. If a `MUST` expectation has no evidence above 2, preserve it as an explicit internal gap.
6. Rank top-third proof by:
   - exact hard-filter closure;
   - same problem/domain evidence;
   - measurable business/operating outcome;
   - ownership/authority;
   - scale appropriate to the expectation.
7. Populate the role shell from the evidence inventory.
8. Run final evidence-coverage audit against every MUST expectation.

## 13. Coverage failure patterns to catch

Reject the draft internally when any of these occur:

- vacancy screens for people management but first third contains only architecture/product evidence;
- vacancy screens for product ownership but CV opens on IT operations;
- vacancy asks manager-of-managers and CV substitutes `100+ specialists coordinated`;
- vacancy asks high-scale production engineering and CV uses `200–300 reports/day`;
- vacancy asks budget/resource allocation and CV gives only tools/procurement administration;
- vacancy asks adoption/change and CV describes only software implementation;
- vacancy asks current AI engineering and CV leads with 2017–2022 enterprise work;
- strong evidence exists in `RESUME.md`/matrix but a weaker generic bullet is used instead;
- the same proof is repeated in Profile, Role Fit and Experience while another MUST expectation is invisible.

The objective is not a universally impressive resume. It is a vacancy-specific document where the **first-screen expectations are visible and proved with the strongest truthful evidence Anton actually has**.