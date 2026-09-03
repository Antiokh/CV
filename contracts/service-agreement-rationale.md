# Service Agreement Rationale

This note explains why the service agreement template was tightened. It is intentionally separate from the contract text. The agreement should remain clean legal/business language; this file records the practical reasoning and project experience behind the changes.

The framework agreement is now positioned primarily around **maintenance, configuration, administration, integration, support and optimization of a client's web portal and related web-facing business systems**. Development, scripting, automation and implementation remain expressly permitted where they are needed to perform those services. A separate Serbian-law review note explains the legal reasoning for that distinction: [`service-agreement-serbian-law-review.md`](./service-agreement-serbian-law-review.md).

## Background

The template is designed for software-enabled, no-code/low-code, automation and business-system projects where the real work is not limited to writing code. These projects often involve unclear initial scope, evolving client expectations, third-party platforms, paid development environments, hosting, APIs, deployment, handover, and post-delivery support.

A recent problematic project exposed several recurring risks:

- the client delayed testing and disappeared for long periods;
- the specification described broad functionality but did not define detailed behaviour for many workflows;
- the client later treated undefined behaviour and new preferences as free fixes;
- the project used third-party platforms whose paid plans, export rules and availability mattered;
- development/export tools expired while client-side testing was delayed;
- the project was moved to the client's server, then feedback continued after deployment in the client's environment;
- an external messenger/API integration that had worked earlier later required debugging after regional restrictions, throttling, server/network issues or API behaviour may have changed;
- the contractor used paid AI-assisted development tools internally and did not always pass those costs through, which created a misleading expectation that tooling costs were invisible or free;
- messenger/email history contained important evidence of demos, approvals, delays, testing and acceptance.

The revised agreement tries to prevent the same commercial and evidentiary ambiguity.

## Main changes and why they matter

### 1. Scope must live in the SOW or Change Order

The agreement now states that only work expressly included in an SOW or approved Change Order is in scope. Conversations, examples, demos, wishes, roadmaps and assumptions do not expand the scope by themselves.

Reason: vague functional descriptions are dangerous. If the behaviour of files, notifications, roles, QR flows, filters, comments, mobile states or edge cases was never described, the client should not be able to call their later preference a defect.

### 2. Undefined behaviour is not automatically a defect

A new undefined-behaviour clause says that if a feature, screen, role, notification, integration or edge case is not defined in the SOW, later definition of that behaviour is a Change Request unless objectively required by a written acceptance criterion.

Reason: this protects against open-ended product discovery being smuggled into warranty work.

### 3. Defect versus new requirement is explicit

The agreement distinguishes a defect from new or changed requirements. A valid defect must be a reproducible failure against the written scope and acceptance criteria. New preferences, business rules, integrations, platform behaviour or data structures are Change Requests.

Reason: the contractor should fix broken promised behaviour, not build every later-discovered desired behaviour for free.

### 4. Client delay and remobilisation are priced risks

The agreement now lets the contractor pause after overdue client responses and treat long inactivity as a reason to reschedule, terminate, or require remobilisation.

Remobilisation may include re-reading context, restoring environments, renewing subscriptions, checking changed APIs, checking server state, reproducing issues, re-validating deployments and updating documentation.

Reason: a project that sleeps for weeks or months is not free to restart. Context expires, dependencies change, platform versions move, credentials break, and the contractor's schedule changes.

### 5. Included infrastructure periods do not extend because the client delays

The agreement distinguishes production hosting from development, editing, export and handover environments. It also states that fixed paid periods do not extend at the contractor's expense because the client delayed testing, feedback or payment.

Reason: if a contract includes two months of WeWeb/Supabase/server time and the client waits months to test, the contractor should not keep paying for the development/export environment indefinitely.

### 6. Development/export environments are project expenses

The agreement now covers paid seats, agency workspaces, export plans, build services, repository services, AI-assisted coding tools and similar tooling required to modify, rebuild, export, transfer or hand over the editable project.

Reason: a self-hosted production app can still require a paid development or export account. The client is not just paying for hosting; they may need a paid toolchain to receive an editable project, new build or export package.

### 7. AI-assisted development is allowed but bounded

The agreement expressly permits AI-assisted development rather than pretending modern delivery does not use it. Project code, technical context and confidential project information may be used where reasonably necessary, but only in a private, non-public project/workspace/account configuration with persistent and cross-session shared memory disabled for the project, or in an isolated single-session coding-agent run that does not retain or reuse project context after the session.

AI chats, prompts, coding-agent transcripts and generated outputs containing Client Confidential Information must not be intentionally published or made public. The SOW can impose stricter restrictions for regulated, specially restricted or AI-excluded data. Personal-data processing remains subject to applicable DPA requirements.

Reason: the useful distinction is not "AI versus no AI". It is controlled private processing without persistent shared memory versus public publication, unintended sharing or retained context. The contract should allow normal private development workflows while defining the confidentiality boundary clearly.

### 8. Acceptance is based on agreed review mechanics and affirmative use

The acceptance clause includes explicit confirmation, expiration of the agreed review period after an express invitation to inspect and accept the Deliverable, production or material business use, requesting new features based on the delivered version, and third-party continuation from the delivered version.

Testing, acceptance testing and feedback during the review period do not by themselves constitute acceptance.

Reason: the client must have a real opportunity to test and reject a nonconforming Deliverable without that testing itself triggering acceptance. At the same time, the acceptance process cannot remain open indefinitely when the contractor has expressly invited inspection and acceptance, the agreed review period has passed without a valid rejection or justified obstacle, or the client has moved on to production use or further development.

The Serbian-law review note records the legal basis for keeping this mechanism, including Article 614 of the Law on Obligations.

### 9. Acceptance is milestone-based and final for accepted scope

The agreement says acceptance and invoicing can apply separately to milestones, and that accepted scope cannot be reopened later merely because the client prefers another implementation.

Reason: one unpaid final handover/testing stage should not reopen already accepted database, interface, integration or business-logic stages.

### 10. IP and handover follow payment for the relevant Deliverable or milestone

The agreement now makes ownership transfer and Contractor-controlled handover materials subject to payment of the applicable Deliverable or milestone rather than every later amount under the entire SOW. Client-owned production accounts, data and credentials are not held hostage to an unrelated payment dispute.

Reason: transferring unpaid Contractor-controlled editable assets weakens the contractor's position, but an unpaid later milestone should not prevent the client from receiving rights in an earlier accepted and paid milestone. The payment condition should track the asset or milestone it protects.

### 11. Third-party services are outside the warranty unless misimplemented

The agreement excludes provider outages, API changes, pricing changes, regional blocks, throttling, policy changes, changed environments and insufficient client infrastructure from warranty coverage.

Reason: the contractor is not an insurer for Telegram, WeWeb, Supabase, Bubble, cloud providers, app stores, email providers, regional blocks, sanctions, DNS, firewalls, or hosting limits.

### 12. Client-owned infrastructure is the client's risk unless expressly assigned

The agreement requires the client to own or have administrator access to critical production accounts where the provider permits it, unless a temporary exception is documented in the SOW with owner, access and transfer details. The client remains responsible for client-controlled infrastructure, network access, firewalls, DNS, hosting capacity, server availability, provider restrictions and credentials unless the SOW expressly assigns a specific duty to the contractor.

Reason: business-critical production infrastructure should not depend on the contractor's personal account, but once the project runs on the client's infrastructure, issues in that environment must not automatically be treated as defects in the contractor's code.

### 13. Warranty is not unlimited post-delivery support

The warranty section now states that warranty correction covers qualifying defects in accepted Deliverables. It does not by itself include feature development, product changes, monitoring, operational support, on-call work, third-party adaptation or an SLA.

Recurring maintenance, administration, configuration, integration or optimization can still be part of the principal paid Services during an active SOW. Those services are governed by the SOW's scope and fees rather than being transformed into free warranty work.

Reason: after delivery, clients often blur warranty, support, QA, product management and new development. The contract should separate them without contradicting the framework's principal web-portal service model.

### 14. Valid defect reports require reproduction details

The agreement now requires the affected user/role, environment, device, browser/app/server, reproduction steps, expected result under the SOW, actual result, and available screenshots/logs/video.

Reason: vague statements like "it doesn't work" can consume unlimited unpaid time. Defect reports must be actionable.

### 15. Messenger and email communications can be evidence

The old draft treated messengers as having no legal status. The revised text treats designated channels as valid for operational approvals, acceptance, Change Orders, expense approvals, scheduling, feedback, issue reports and delivery confirmations.

Reason: in small projects, real decisions happen in Telegram, email, GitHub, shared docs and task trackers. Excluding them destroys the evidence trail that proves approvals, delays and acceptance.

### 16. Formal legal notices remain separate

Material breach, termination, legal claims and legal-address changes still go to a legal email. Paper courier/registered mail can be additional but is not the default requirement unless mandatory law or the SOW says so.

Reason: operational speed and legal clarity are different problems. The contract should support both.

### 17. Personal-data processing needs explicit terms

If Contractor processes personal data on Client's behalf, the parties must identify their roles and execute any legally required data-processing terms before that processing. The SOW now records data categories, data subjects, processing roles, subprocessors, international-transfer restrictions and special retention/deletion/incident requirements.

Reason: personal-data access should not be left to a vague Yes/No checkbox when the project may place Contractor in a processor role.

### 18. High-risk production changes need a recovery path

Before a high-risk production intervention, the parties must confirm a backup or rollback method. If the client expressly directs the contractor to proceed without one after the risk is identified, that instruction is recorded.

Reason: the liability allocation around backups is meaningful only if the recovery path is discussed before a risky production change.

### 19. Exposed credentials must be rotated

Passwords, API keys, access tokens, private keys and similar authentication secrets should not be intentionally published or stored or transmitted in plaintext outside an intended secure secret-storage or secret-transfer channel. If a project secret becomes publicly accessible or is handled in plaintext outside such a secure channel, the responsible account/environment owner must promptly revoke or rotate it and update affected configurations.

Reason: once a secret is exposed, trying to prove whether somebody actually copied it is the wrong security test. Rotation is cheaper and more reliable than treating an exposed credential as trustworthy.

### 20. The contract avoids employer-style control language

The client can review progress, outcomes and agreed project artifacts, but the agreement now makes clear that Contractor independently organizes working time, place, staffing, tools and internal working methods. The 10:00-19:00 period is expressly a communication window, not prescribed working hours.

Reason: this better reflects an independent business relationship and avoids unnecessary contractual indicators of employer-style control. The real working relationship still has to match the contract; wording alone does not determine the Serbian test of independence.

### 21. Convenience termination cannot silently erase reserved capacity

The agreement still allows convenience termination, but an SOW may expressly define a minimum commitment, reserved-capacity term or amount earned upon reservation and surviving early convenience termination.

Reason: if the contractor reserves capacity or rejects other work for the project, a generic ten-day termination right should not automatically make that commercial commitment worthless.

## Practical SOW checklist

For every future project, the SOW should explicitly define:

- principal web-portal service category: maintenance, configuration, administration, integration, support or optimization;
- project boundary: what is being maintained, configured, optimized, integrated, reviewed or changed;
- implementation, scripting, automation, coding or development that is included as necessary technical work;
- included deliverables and explicit exclusions;
- acceptance criteria by milestone;
- client dependencies and feedback deadlines;
- production accounts, administrator access and any temporary ownership exception;
- development/editing/export/handover environments;
- paid subscriptions and included paid period, if any;
- whether self-hosting includes editable project transfer or only deployment/export;
- whether support after handover is included;
- warranty period and warranty boundary;
- third-party/API/regional restrictions known at signing;
- personal-data roles, data-processing terms, subprocessors and transfer restrictions where applicable;
- AI-assisted-tool restrictions or approval of the default private/isolated no-shared-memory modes;
- backup and rollback owner and recovery method for high-risk interventions;
- designated messenger/email/workspace channels;
- billing currency, rate or project price, billing triggers and payment-before-handover rule;
- minimum commitment or reserved-capacity treatment, if applicable.

## Commercial principle

The contractor should fix broken promised functionality. The contractor should not provide unlimited free product discovery, QA, DevOps, platform-risk insurance, API adaptation, infrastructure payments, re-onboarding after client delays, or support for undefined behaviour.

A clean project needs three separate buckets:

1. agreed paid Services and delivery;
2. warranty defects against written acceptance criteria;
3. paid changes, continuing support, remobilisation and third-party adaptation.

The revised agreement exists to keep those buckets separate.
