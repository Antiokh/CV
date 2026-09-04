# Pain-first application positioning contract

This is the canonical content-strategy contract for Anton Nazarov's candidate-side employment applications. It governs vacancy interpretation, tailored CV positioning, cover letters, recruiter/application answers, and short motivation fields. It does not replace tracker, salary, artifact, or lifecycle contracts.

## Core principle

An application is not a description of Anton and not a summary of the vacancy.

Its job is to make the hiring manager conclude:

**"He understands the problem we need solved, he has solved the same or a structurally similar problem before, and the proof is credible."**

Treat the vacancy as a compressed description of a business problem. Responsibilities describe the changed state the employer wants. Requirements and nice-to-haves are mostly risk filters: signals the employer uses to estimate whether the candidate can create that changed state.

Do not let the application degenerate into either extreme:

- external research, company praise, market commentary, generic "successful company" language, or citations that do not help prove Anton can solve the hiring problem;
- candidate-centered self-description such as "I am strategic / technical / collaborative / a strong fit" without a concrete problem, action, and result.

## Mandatory pre-draft analysis: Pain Map

Before writing a CV adaptation, cover letter, or substantive application answer, build an internal Pain Map from the vacancy itself.

### 1. Hiring pain

Identify the 1-3 problems that most plausibly explain why this role exists.

Use only evidence from the vacancy and company/application context. Distinguish internally between:

- **explicit pain**: the vacancy directly states the problem, failure mode, bottleneck, goal, or responsibility;
- **strongly implied pain**: repeated responsibilities/requirements make the problem clear enough to infer;
- **unknown**: do not invent a business problem merely to create a clever narrative.

Examples of pain classes include:

- weak product discovery causing the wrong work to be built;
- slow or chaotic delivery;
- poor adoption after implementation;
- manual operations that do not scale;
- fragmented ownership or unclear accountability;
- technical debt / architecture preventing change;
- unreliable operations, support, security, or infrastructure;
- inability to turn user signals and data into priorities;
- a team that needs leadership, technical judgment, or clearer operating rules;
- founder dependency / key-person dependency;
- need to move from ad-hoc service delivery to a repeatable product/operating system.

Do not write these generic labels into the application unless the vacancy itself uses them. Translate them into the employer's concrete situation.

### 2. Desired changed state

For each major pain, state internally what success would look like for the employer.

Examples: faster decisions, higher adoption, fewer manual handoffs, clearer ownership, better unit economics, measurable service operations, reliable delivery, scalable booking flow, improved conversion, resilient infrastructure, or a product team that ships and learns faster.

### 3. Hiring-risk filters

Extract requirements, experience thresholds, nice-to-haves, domain/tooling constraints, geography/work authorization, company-size preference, title/seniority signals, and management/technical scope.

These are important, but they are **not automatically the narrative structure** of the application. Use them to test whether the proposed proof actually removes hiring risk.

### 4. Select the strongest proof

Search the canonical evidence repository before drafting. For product and managerial roles, use `RESUME_FRACTIONAL_CTO.md` as the default business-evidence baseline, then deepen with canonical experience/case files as needed.

Select normally **two or three strongest proof cases**, not a biography dump.

Rank evidence by:

1. same pain + same domain/customer/business model;
2. same pain in another domain;
3. same management/product/technical pattern with comparable scale or constraints;
4. adjacent tools/skills only when the vacancy explicitly filters for them.

A strong case may close several requirements at once. Prefer one memorable, quantified case over five weak competency statements.

### 5. Build a solution thesis

Form one internal sentence that connects the employer's problem to Anton's pattern of solving it:

**"This looks like [problem pattern]. I have dealt with it by [relevant approach], with [proof/result]."**

The application may express this idea directly, but do not pretend to know the company's internal solution before joining. Offer pattern recognition and a credible approach, not a free consulting diagnosis based on thin evidence.

## Evidence unit

The preferred proof unit is:

**Pain / situation -> Anton's decision or action -> measurable or observable result -> why it matters here.**

Use named cases, systems, employers, customers, scale, before/after changes, and supported metrics.

Examples of strong evidence structure:

- a service business had fragmented manual lead handling -> Anton talked to customers, redesigned booking/registration/communication and automated the operating flow -> routine handling fell from hours to minutes and revenue grew roughly 10x / up to 13x depending on the canonical source -> directly relevant to a service-business product struggling to scale customer operations;
- technically completed ERP/CRM implementations were not being adopted -> Anton diagnosed ownership and post-launch responsibility rather than adding features -> implementation success was reframed around adoption and business impact -> relevant to roles where delivery quality is measured by actual use, not shipment;
- an institution ran support through calls and personal messages -> Anton introduced managed HelpDesk queues, priorities and ownership and extended the model to seven additional services -> workload and accountability became visible -> relevant to operational leadership roles with chaotic service delivery.

Do not manufacture the final "why it matters here" when the analogy is weak.

## Output architecture

### Cover letter / application message

Default structure:

1. **Open on the employer's problem**, not on Anton's biography or enthusiasm. When the best evidence is an exact domain/nice-to-have match, it can serve as the opening because it proves pain recognition immediately.
2. **Give 2-3 strong proof cases**. Each case should show the problem, what Anton changed, and the result. Use the vacancy's own language where truthful.
3. **Close material filters compactly** only when the proof cases do not already close them: years, management scope, technical depth, company size, geography, work authorization, specific tooling, etc.
4. End without generic enthusiasm. A short role-specific next step is enough.

The letter should usually be shorter than a full requirement checklist. Requirements are a QA layer, not a demand to write one bullet per line item.

### Tailored CV

The CV should preserve chronology, but its **Profile, Role Fit, bullet selection, and depth** must support the Pain Map.

- Profile: frame the recurring problem class Anton solves for this role.
- Role Fit: normally 4-6 proof points connecting major hiring pains/risks to evidence.
- Experience: provide the detailed facts behind those proof points.
- Technical Scope: close ATS/tooling filters without competing with the business evidence.

Do not turn Role Fit into a generic requirement paraphrase. The strongest business evidence from `RESUME_FRACTIONAL_CTO.md` should survive adaptation unless a more relevant verified case replaces it.

### Short application questions

For prompts such as `Why this company?`, `What interests you?`, `Why are you a fit?`, or `Tell us about relevant experience`, do not answer the literal prompt with generic motivation.

Use the same compression:

**their problem -> matching proof -> why that makes the work interesting/relevant.**

Only include genuine company-specific motivation when it is supported and useful.

## Nice-to-have handling

Nice-to-haves are high-information signals, not a mechanical opening rule.

Surface a nice-to-have early when it provides unusually strong proof of the employer's core problem, exact domain, customer type, workflow, or tool. Do not lead with a minor nice-to-have merely because the vacancy labels it preferred.

Exact-domain evidence with business impact can outrank a generic essential requirement because it reduces uncertainty faster.

## Requirements as QA, not prose skeleton

After drafting, run a requirement-coverage audit:

- every hard filter must be explicitly or implicitly closed by visible evidence;
- every central responsibility must have at least one credible proof or be recognized internally as a gap;
- nice-to-haves with strong evidence should be visible;
- unsupported requirements remain gaps; do not imply experience that is not evidenced.

If a requirement is already convincingly covered by a proof case, do not repeat it in a separate generic sentence.

## External research rule

External company/market research is useful only when it materially improves one of these:

- understanding the hiring pain;
- confirming that the vacancy is current or interpreting role/company context;
- identifying a concrete product/business constraint relevant to the application;
- verifying a fact that changes positioning.

Do **not** put web citations, market statistics, company praise, funding/revenue trivia, or "successful growth" commentary into a normal cover/application merely to sound researched. The application should primarily cite Anton's lived evidence, not the internet.

If external research reveals a pain hypothesis that is not stated in the vacancy, treat it cautiously and do not present speculation as internal company fact.

## Candidate-centered language to delete

Delete or rewrite sentences whose main content is "Anton is good" rather than "Anton solved this kind of problem."

Weak patterns include:

- `My background is...`
- `I am a strong fit...`
- `I am strategic / technical / data-driven / collaborative...`
- `I have extensive experience...`
- `I am comfortable with...`
- `I bring X years...` without immediate proof
- `I am excited / passionate / interested...` as an opening
- `Your impressive company / growth / mission...` unless genuine motivation is unusually specific and relevant

Prefer verbs tied to evidence: `diagnosed`, `mapped`, `redesigned`, `prioritized`, `built`, `shipped`, `measured`, `reduced`, `increased`, `restored`, `migrated`, `hired`, `restructured`, `automated`, `trained`, `recovered`, `stabilized`.

## Management-role rule

For managerial, product-leadership, CTO/Head/CIO/EM roles, do not sell personal virtues. Managers are hired to change systems through decisions, people, ownership, process, and prioritization.

Show:

- what was broken, slow, opaque, risky, unowned, or not scaling;
- what Anton decided or reorganized;
- how people/teams/vendors/stakeholders were aligned;
- what business or operational state changed;
- what evidence shows the change persisted or mattered.

`RESUME_FRACTIONAL_CTO.md` is the preferred starting evidence layer for this framing because it already emphasizes revenue, operating cost, throughput, continuity, dependency, risk, management control, adoption, and measurable service outcomes.

## Final QA

Before finalizing any substantive application artifact, ask:

1. What are the 1-3 hiring pains I believe this vacancy is trying to solve?
2. Which words in the vacancy support that interpretation?
3. What are Anton's 2-3 strongest verified cases for those pains?
4. Does the opening speak to the employer's problem, or merely introduce Anton?
5. Does every proof contain an action/decision and an outcome or observable change?
6. Are hard filters covered without turning the letter into a checklist?
7. Did a nice-to-have surface early only because it is genuinely high-value evidence?
8. Did I preserve supported business-result evidence from the master CV where relevant?
9. Did I add internet/company trivia that does not help prove solution fit? Remove it.
10. Did I write adjectives about Anton where a fact could do the job? Replace them.
11. Could this paragraph be sent by hundreds of applicants after changing the company name? If yes, delete or rewrite it.
12. Is every metric, title, responsibility, tool, domain claim, and causal statement supported by canonical evidence?

The target is not "a polished application." The target is a compact, credible argument that Anton has already solved the kind of problem the employer is hiring someone to solve.
