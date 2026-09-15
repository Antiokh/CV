# Hiring Expectation Taxonomy

This file is the canonical vocabulary for translating an employment vacancy into the **signals the employer is actually screening for**.

It sits between vacancy interpretation and CV evidence selection:

`vacancy text -> hiring expectations -> hard/soft screening filters -> Anton evidence -> role-specific CV shell`

Use it with:

- `GPT/ANTON_EVIDENCE_MATRIX.md` — which verified evidence can prove each expectation;
- `GPT/ROLE_SIGNAL_PROFILES.md` — which expectations normally dominate each role family and how to order them;
- `GPT/work-application-manager/references/application-positioning-v1.md` — employer pain / changed-state framing;
- `GPT/work-application-manager/references/role-entry-strategy-v1.md` — cold-entry probability and strategic targeting.

This file does **not** replace vacancy-specific reading. A role title alone never proves what the employer means by the role.

## 1. Core distinctions

Do not collapse these into one dimension.

### 1.1 Hiring pain

Why the role probably exists: a business, product, operational, organizational or technical state the employer wants changed.

### 1.2 Expectation / screening signal

What evidence the employer uses to decide whether the candidate can create that changed state.

Examples:

- team leadership;
- manager-of-managers experience;
- architecture ownership;
- product discovery;
- budget responsibility;
- production reliability;
- domain depth;
- hands-on coding recency.

### 1.3 Hard filter

A requirement that can reject a candidate before broader evidence is considered.

Typical hard filters include:

- legal geography / work authorization;
- explicit language level;
- explicit manager-of-managers requirement;
- required recent stack/domain depth;
- minimum years in a specific function when the employer treats it literally;
- mandatory industry / regulated-domain experience;
- explicit on-site availability.

A hard filter is not automatically the most important business problem. It is a **screening gate**.

### 1.4 Strong preference

A repeated or emphasized signal that materially changes ranking but may be compensable by adjacent evidence.

### 1.5 Optional / nice-to-have

Useful evidence only when it improves confidence in the central hiring problem. Do not let a minor nice-to-have displace stronger proof.

## 2. Management-scale parsing

Management scale must always be decomposed before Fit or CV claims are written.

Record separately:

- **direct span** — people who formally reported to Anton;
- **total organizational scope** — total people in the function / department / engineering organization;
- **hierarchy depth** — whether Team Leads / Engineering Managers / managers reported upward through Anton;
- **number of teams / functions** — one team, several teams, tribes, service functions, cross-institutional network;
- **functional coordination without line authority** — people influenced through standards, governance, requirements or shared delivery but not in Anton's reporting line.

Interpret vacancy wording conservatively:

- `team of 20`, `organization of 70 engineers`, `responsible for 100 people` normally means total scope unless `direct reports` is explicit;
- `Engineering Managers report to you`, `manage managers`, `lead Team Leads` is manager-of-managers evidence;
- `8–12 engineers` for an Engineering Manager often describes one team's total size and may be close to direct span, but do not assume formal reporting unless wording supports it;
- `70+ engineers through Team Leads` is explicitly hierarchical and must not be compared with direct-report count.

Never inflate functional coordination into line management.

## 3. Evidence-strength scale

When mapping Anton's evidence, use this 0–5 scale:

- **5 — direct, memorable proof:** same expectation, clear ownership, concrete outcome/scale, defensible in interview;
- **4 — strong proof:** direct responsibility and observable result, but weaker scale/domain match or less quantified;
- **3 — credible adjacent proof:** same pattern in another context or partial ownership;
- **2 — supporting context:** useful but should not carry the claim alone;
- **1 — weak adjacency:** only mention if vacancy explicitly values it and stronger evidence is unavailable;
- **0 — no supported evidence:** leave as a gap.

A high score never authorizes changing titles, scope or authority.

## 4. Expectation classes

### E01 — People leadership

**Hiring question:** Has the candidate actually managed people, not only projects or stakeholders?

Strong signals:

- explicit direct team size;
- hiring and onboarding;
- performance management;
- role design and delegation;
- coaching / capability development;
- difficult personnel decisions;
- retention / succession / backup coverage;
- evidence the team functioned without constant personal intervention.

Weak substitutes:

- stakeholder management;
- project coordination;
- mentoring without line responsibility;
- `worked with 100 engineers` without reporting structure.

Possible hard filters:

- minimum management tenure;
- explicit team-size range;
- required engineering-management background.

### E02 — Organization design and scaling

**Hiring question:** Can the candidate design a function, not just supervise existing individuals?

Strong signals:

- defining roles and capability boundaries;
- deciding full-time vs fractional/shared capacity;
- backup coverage and succession;
- creating new teams/functions;
- scaling one team into several or redesigning responsibility boundaries;
- capacity planning and resource allocation.

Weak substitutes:

- generic hiring claims;
- adding headcount without an operating-model decision.

### E03 — Manager-of-managers / hierarchy depth

**Hiring question:** Has the candidate managed leaders who themselves manage teams?

Strong signals:

- Engineering Managers / Team Leads / department managers as formal reports;
- several teams managed through leaders;
- performance and org design at manager layer.

Weak substitutes:

- 100+ people coordinated without line authority;
- vendors/contractors;
- one direct team of senior specialists.

This is a real gap when explicitly required and unsupported.

### E04 — Delivery ownership

**Hiring question:** Can the candidate make complex work reach production / operating use reliably?

Strong signals:

- end-to-end responsibility from problem/requirements to rollout;
- prioritization and sequencing;
- dependency management;
- rescue of stalled/broken delivery;
- rollout, adoption, support and handover;
- predictable execution across multiple functions/vendors.

Weak substitutes:

- participation in a project without accountability;
- technical implementation with no adoption/operating result.

### E05 — Product ownership and discovery

**Hiring question:** Can the candidate identify the right problem and turn it into product decisions?

Strong signals:

- user/stakeholder interviews;
- process discovery;
- product/data/workflow model ownership;
- prioritization and roadmap decisions;
- feature rejection / product simplification;
- metrics and adoption feedback shaping decisions;
- end-to-end product lifecycle responsibility.

Weak substitutes:

- implementing someone else's fixed requirements;
- `worked with users` without a product decision.

### E06 — Product metrics / experimentation / validation

**Hiring question:** Does the candidate measure whether product changes work?

Strong signals:

- defined success metrics;
- before/after usage, throughput, revenue, conversion, MAU, ticket volume or time;
- pilots and user tests before commitment;
- experiments that changed roadmap/investment decisions.

Weak substitutes:

- raw traffic or report counts with no decision context;
- dashboards without a management action.

### E07 — Business impact / revenue / unit economics

**Hiring question:** Does technology/product work change business economics?

Strong signals:

- revenue growth;
- operating-cost reduction;
- CAPEX/OPEX avoidance;
- reduced manual effort tied to capacity;
- monetizable channel launch;
- improved throughput or conversion tied to business value.

Weak substitutes:

- technical performance gains with no business consequence;
- unsupported attribution of organization-wide financial results.

### E08 — Technology economics / budget / resource allocation

**Hiring question:** Can the candidate decide where technology money and capacity should go?

Strong signals:

- budget or spend responsibility;
- TCO decisions;
- build/buy/reuse choices;
- licensing strategy;
- lifecycle decisions;
- sunk-cost stopping decisions;
- vendor negotiation;
- full-time vs fractional capability economics.

Weak substitutes:

- `worked with procurement`;
- cost estimates without decision authority.

### E09 — Architecture ownership

**Hiring question:** Can the candidate define system boundaries and make architectural trade-offs that survive change?

Strong signals:

- end-to-end architecture responsibility;
- data models and access boundaries;
- platform selection and exit strategy;
- integration architecture;
- modularity / portability;
- long-lived core surviving interface/platform changes;
- explicit handover and recoverability.

Weak substitutes:

- technology lists;
- isolated coding tasks;
- diagrams without operating consequences.

### E10 — Technical depth / hands-on credibility

**Hiring question:** Can the candidate still inspect, challenge or implement technical work at the depth required by this role?

Strong signals depend on vacancy:

- current coding / debugging;
- code review;
- SQL/data work;
- infrastructure/cloud operations;
- API/integration implementation;
- AI-agent/repository engineering;
- production troubleshooting.

Do not use broad 18+ year experience to imply recent depth in an unpracticed stack.

### E11 — Production scale / reliability / incident ownership

**Hiring question:** Has the candidate operated systems whose failure matters, at the scale/domain relevant here?

Strong signals:

- availability / continuity responsibility;
- incident response and recovery;
- high-volume or large-user production systems where documented;
- business-continuity decisions;
- monitoring / observability tied to operations;
- safe migrations of live systems.

Important guardrail:

- `200–300 reports/day` is adoption/throughput context, **not high-load evidence**;
- user/institution counts are only relevant to the specific kind of scale being screened.

### E12 — Security / compliance / access governance

**Hiring question:** Can the candidate make risk, access and compliance manageable?

Strong signals:

- IAM / joiner-mover-leaver controls;
- RBAC;
- personal-data/security remediation;
- privileged-access governance;
- endpoint / policy controls;
- auditability;
- regulated workflow design;
- recovery from access/key-person failure.

Weak substitutes:

- naming security tools;
- generic `security-minded` claims.

### E13 — Vendor / procurement / build-buy-reuse judgment

**Hiring question:** Can the candidate manage external technology and avoid bad lock-in/spend decisions?

Strong signals:

- vendor selection and negotiation;
- pilots before commitment;
- procurement ownership;
- TCO analysis;
- build vs buy vs reuse;
- platform exit / portability;
- stopping a purchased tool when adoption/economics fail.

### E14 — Business applications / workflow / ERP/CRM ownership

**Hiring question:** Can the candidate turn business processes into usable systems?

Strong signals:

- workflow discovery and redesign;
- CRM/ERP/DMS/service-management implementations;
- data ownership and role model;
- integration with finance/HR/1C/other systems;
- rollout and adoption;
- source-of-truth design;
- visible ownership/status/deadlines.

### E15 — Data / reporting / management control

**Hiring question:** Can the candidate make operational data useful for decisions?

Strong signals:

- canonical data model / source of truth;
- governance and data freshness;
- role-based visibility;
- self-service reporting;
- management questions answerable without new manual collection;
- data connected to planning, funding or prioritization.

Weak substitutes:

- number of dashboards;
- raw report throughput without decision use.

### E16 — Adoption / change management

**Hiring question:** Can the candidate get people to use the system/process after it ships?

Strong signals:

- user pilots;
- training and rollout;
- process/ownership correction when adoption fails;
- handling resistance to transparency or policy changes;
- changing tool/platform when fit is wrong;
- measurable demand/adoption changes.

### E17 — Executive stakeholder management / influence without authority

**Hiring question:** Can the candidate align leaders, peers, clients, vendors or distributed institutions without relying on hierarchy?

Strong signals:

- work with founders/board/directors/public authorities;
- cross-institution standards/governance;
- conflicting stakeholder resolution;
- executive escalation to obtain a process decision;
- representing the organization externally;
- delivery through people outside direct reporting lines.

### E18 — Transformation / operating-model redesign

**Hiring question:** Can the candidate move an organization from ad-hoc/opaque work to a controlled operating model?

Strong signals:

- explicit before/after process state;
- ownership, queues, SLA, data and rules introduced together;
- transformation beyond the IT department;
- trust/mandate expansion after initial stabilization;
- results surviving handoff or leadership change.

### E19 — Customer / client-facing solution design

**Hiring question:** Can the candidate discover customer needs and turn them into workable technical/product solutions?

Strong signals:

- direct founder/client discovery;
- requirements negotiation;
- explaining trade-offs;
- architecture/product decisions tied to client operating constraints;
- post-launch adoption/support loop.

### E20 — AI / automation / agentic delivery

**Hiring question:** Does the candidate have current applied-AI evidence rather than generic interest?

Strong signals:

- AI-assisted engineering workflows;
- bounded agent tasks and repository guardrails;
- reproducible prompt/execution systems;
- AI automation integrated with business workflows;
- human review / auditability / checkpoints;
- agent-enabled handoff or development with explicit architecture.

Do not imply ML research/model-training expertise without evidence.

### E21 — Domain / regulatory fit

**Hiring question:** Has the candidate worked in the industry/regulatory environment the role treats as important?

Examples:

- banking / financial regulation;
- public sector;
- cultural institutions;
- service/booking businesses;
- enterprise document management.

Domain match can be a hard filter or a useful risk reducer. Do not over-generalize one regulated domain into another.

### E22 — Geography / language / work authorization

**Hiring question:** Can the candidate legally and practically work in the stated model?

Treat explicit location, time-zone, on-site, language and work-authorization requirements as filters. These are not evidence of competence and should be handled compactly.

## 5. Vacancy expectation map

Before drafting a tailored CV, create an internal map with one row per material expectation:

| Expectation | Vacancy evidence | Priority | Hard filter? | Best Anton evidence | Strength 0–5 | Gap / caveat | Must be visible where? |
|---|---|---|---|---|---:|---|---|
| Example: people leadership | `lead a team of 8–12 engineers` | MUST | likely | ZIL 5+2 direct team + hiring/performance | 4 | team was IT, not modern product engineering | Profile/Role Fit + ZIL |

Priority values:

- `MUST` — material first-screen gate or central responsibility;
- `STRONG` — materially affects ranking / expected success;
- `OPTIONAL` — useful but not worth displacing stronger proof.

Visibility values:

- `TOP` — must appear in first third of CV / Role Fit;
- `EXPERIENCE` — detailed proof can sit in relevant job block;
- `TECHNICAL_SCOPE` — mainly ATS/filter closure;
- `OMIT` — do not include unless space remains.

## 6. Fit versus evidence coverage

Always keep two internal judgments separate.

### Fit

How much Anton's actual experience covers the work/problem.

### CV evidence coverage

How much of the vacancy's important expectations are **visibly and credibly proved in the actual CV draft**.

A role can have high Fit and weak CV evidence coverage if the document hides the relevant proof.

Example failure:

- actual people-management evidence exists;
- the CV leads with architecture and technical details;
- the recruiter concludes `no people management`.

That is a **document coverage failure**, not necessarily a Fit failure.

## 7. Mandatory final coverage audit

For every `MUST` expectation ask:

1. Is the expectation interpreted correctly rather than inferred from title alone?
2. Is there direct or adjacent verified evidence?
3. Is the strongest available evidence being used, or did a weaker metric displace it?
4. Is the evidence visible early enough for a first-screen reader?
5. Does the wording prove the exact expectation rather than a neighboring one?
6. Are direct reports, total org scope and functional coordination kept separate?
7. Are we using a throughput/user/report count as the wrong kind of scale?
8. Is a real gap stated internally rather than hidden through ambiguous wording?

A tailored CV is not ready until all `MUST` rows are either visibly covered or explicitly recorded as gaps.