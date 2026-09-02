# Evidence Map Guide

This guide explains how to use `data/evidence_map.json` when generating resumes, cover letters and role-targeted outputs from public evidence.

## What The Evidence Map Is

The evidence map is a retrieval layer on top of the canonical public profile. It does not replace the master CV or portfolio.

It helps answer:
- which experience best matches a role
- which projects should be surfaced for a vacancy
- which evidence supports management, ownership, architecture, product or AI claims
- how a project relates to its parent organization
- which adjacent roles are supported by evidence

## When To Use It

Consult the evidence map before generating tailored resumes, cover letters, interview talking points or role-specific summaries.

## How To Read It

### 1. Start with tags

Tags show the main retrieval axis, including:
- `engineering_manager`
- `product_owner`
- `systems_architect`
- `ownership`
- `leadership`
- `ai_workflow`
- `banking`
- `public_sector`
- `product_delivery`
- `architecture`
- `delivery_lead`
- `technical_product_lead`
- `fractional_cto`

### 2. Look at parent-child relationships

Some projects belong to a larger organizational context. Parent experience often carries the strongest leadership and ownership signal; child projects can provide implementation detail.

### 3. Read the evidence list

Use evidence bullets as the factual basis for resume bullets, cover-letter claims and interview examples.

### 4. Read `best_for_roles`

This is a fast evidence-to-role hint, not a private assessment of the candidate.

## Retrieval Logic

When matching a vacancy:

1. identify the dominant role type
2. identify adjacent plausible roles
3. find the top tags matching the vacancy
4. surface entities whose `best_for_roles` match
5. prioritize parent experiences for leadership or ownership vacancies
6. prioritize child projects for product, AI or implementation detail
7. keep the final narrative tied to factual public evidence

## Role-Adjacent Thinking

Do not search only for the exact job title. For example:
- Engineering Manager may also use Head of Engineering, Delivery Lead, Platform Lead and Fractional CTO evidence.
- Product Owner may also use Technical Product Lead and Product Operations evidence.
- Systems Architect may also use Solutions Architect and Platform Lead evidence.
- AI workflow roles may also use Product Builder and Technical Product Lead evidence.

## Important Rules

- Do not treat every project as standalone if it belongs to a larger organizational context.
- Do not treat a technical project as mere development if evidence shows PM or ownership.
- Prefer the combination of role + parent context + evidence over title alone.
- Keep claims traceable to public evidence.
- Do not add private psychometric analysis, compensation strategy, draining-zone analysis or internal role-avoidance logic to this public retrieval layer.

## Practical Examples

For an Engineering Manager vacancy, surface ZIL IT leadership, Directorate reform, bank document-system work and NeedleBit where delivery leadership is useful.

For a Product Owner vacancy, surface MetaFox, Dobri Visarun, PromptlessPress and bank workflow ownership when relevant.

For a Senior AI Workflow Engineer vacancy, surface PromptlessPress, NeedleBit and AI-assisted product evidence.

For a Fractional CTO vacancy, surface NeedleBit, Directorate reform, bank systems work and ZIL IT leadership.

## Output Guidance

- use the evidence map to choose facts to emphasize
- do not repeat every possible fact
- keep one dominant narrative per application
- preserve factual accuracy and source traceability
