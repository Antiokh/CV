# Evidence Map Guide

This guide explains how to use `data/evidence_map.json` when generating resumes, cover letters, negotiation notes, and role-targeted outputs.

## What The Evidence Map Is

The evidence map is a retrieval layer on top of the canonical profile.
It does not replace the master CV or portfolio.
It helps the agent quickly answer:

- which experience best matches a role
- which projects should be surfaced for a vacancy
- which evidence supports management, ownership, architecture, product, or AI claims
- how a project relates to its parent organization

## When To Use It

Always consult the evidence map before generating:

- tailored resumes
- cover letters
- negotiation strategies
- interview talking points
- role-specific summaries

Use it especially when the vacancy could plausibly fit more than one narrative, for example:

- Engineering Manager
- Product Owner
- Systems Architect
- Technical Product Lead
- Senior AI / Workflow Engineer

## How To Read It

### 1. Start with tags

Tags show the main retrieval axis:
- `engineering_manager`
- `product_owner`
- `systems_architect`
- `ownership`
- `leadership`
- `ai_workflow`
- `banking`
- `public_sector`
- `product_delivery`
- `feedback_loops`

### 2. Look at parent-child relationships

Some projects belong to a larger organizational context.

Example:
- `AIS MosRazvitie` belongs to `directorate_reform`
- `metafox` and `dobri_visarun` belong to `needlebit`

This matters because the parent experience often carries the strongest role-fit signal.

### 3. Read the evidence list

Each entity includes short evidence bullets.
Use these bullets as the factual basis for:
- resume bullets
- cover letter claims
- interview examples
- compensation justification

### 4. Read the best_for_roles field

This is the fast role-fit hint.
It tells the agent which roles should surface this entity first.

## Retrieval Logic

When matching a vacancy:

1. identify the dominant role type
2. find the top tags that match the vacancy
3. surface all entities whose `best_for_roles` match
4. give priority to parent experiences when the vacancy is about leadership or ownership
5. give priority to child projects when the vacancy is about product, AI, or implementation detail

## Important Rules

- Do not treat every project as standalone if it belongs to a larger organizational context.
- Do not treat a technical project as mere development if the evidence shows PM or ownership.
- Do not overuse weak but flashy signals if the map shows stronger fit elsewhere.
- Prefer the combination of role + parent context + evidence over title alone.

## Practical Example

For an Engineering Manager vacancy:
- surface `zil_it_leadership`
- surface `directorate_reform`
- surface `bank_document_system`
- include `needlebit` only if team collaboration and delivery leadership are useful

For a Product Owner vacancy:
- surface `metafox`
- surface `dobri_visarun`
- surface `promptlesspress`
- include `bank_document_system` if the role needs process ownership and product logic

For a Senior AI Workflow Engineer vacancy:
- surface `promptlesspress`
- surface `needlebit`
- surface `metafox` if AI-assisted workflows or product logic are relevant

## Output Guidance

When generating final materials:

- use the evidence map to choose which facts to emphasize
- do not repeat every possible fact
- keep one dominant narrative per application
- preserve factual accuracy and source traceability
