# Evidence-First CV Adaptation Rules

These rules are mandatory for every tailored employment CV. They override any older brevity rule when brevity would remove evidence needed to prove fit.

## Purpose

A tailored CV must do three things in this order:

1. prove directly relevant experience for the vacancy;
2. reinforce it with analogous experience from other industries or roles when it demonstrates the same responsibility, scale, architecture, management pattern, or outcome;
3. mirror the vacancy's actual requirements and vocabulary as closely as truth allows.

The CV is not a short biography and not a keyword summary. It is an evidence document for a hiring decision.

## Evidence hierarchy

For every material vacancy requirement, search the canonical profile, full experience source, managerial/technical evidence files, and relevant project evidence before drafting.

Prioritize evidence in this order:

1. direct same-domain / same-responsibility evidence;
2. same responsibility in another domain;
3. same architectural, delivery, transformation, management, integration, scale, security, migration, or stakeholder pattern;
4. adjacent skills and tooling.

Do not replace strong experience evidence with generic competency claims or skill lists.

## Requirement coverage

Before writing, build an internal requirement-to-evidence map for the vacancy. Every important requirement should be either:

- supported by one or more concrete CV bullets;
- supported by adjacent truthful evidence;
- or left as an honest gap.

Do not hide a real gap by implying unsupported production depth.

## Numbers and outcomes

Use numbers aggressively whenever the source evidence supports them. Prefer concrete scale and change over adjectives.

Look specifically for:

- users, institutions, employees, customers, sites, assets, workstations, servers, VMs, documents, records, transactions or other scale indicators;
- team size and span of responsibility;
- time reduced, throughput improved, migration volume, adoption scope, performance changes;
- revenue, cost, operational or service outcomes;
- before/after comparisons;
- system availability, security or quality outcomes when explicitly evidenced.

A bullet with a supported number or before/after result normally outranks a generic responsibility bullet.

Never invent or extrapolate a metric.

## Experience depth

Do not cap the whole CV at a small number of proof points. Select enough evidence to prove the role.

For highly relevant roles, preserve substantive detail. A senior architect, CTO, CIO, transformation lead or similar candidate should not appear to have only three generic bullets per job when the source contains relevant architecture ownership, scale, integrations, modernization, security, migration, team leadership, rollout or measurable outcomes.

Compress irrelevant experience first. Do not compress the strongest evidence merely to satisfy an arbitrary page target.

## Length

Two pages are preferred only when the evidence still reads as complete. Three pages are acceptable for senior, executive, architecture and broad transformation profiles when the third page carries relevant proof. Page count is subordinate to evidence density and readability.

Do not create padding. Do not remove meaningful evidence just to force two pages.

## Writing quality

The CV must read as clear professional prose, not as generated resume filler.

Avoid:

- abstract bullets such as "owned architecture and delivery" without showing what was architected, at what scale, and what changed;
- repeated `Designed / Built / Led / Managed` rhythm when a more precise construction is available;
- symmetric competency taxonomies replacing experience;
- adjective-heavy claims such as `large-scale`, `complex`, `robust`, `strategic`, `high-impact` when scale or result can be stated directly;
- copied vacancy phrases with no supporting evidence;
- generic AI phrasing, inflated transitions, and resume boilerplate.

Prefer concrete nouns, verbs, systems, constraints, decisions, scale and outcomes.

## Humanizer gate

Before a tailored CV is final, load the current `Antiokh/humanizer_russian` repository, starting with its `SKILL.md`, and apply its current mechanical-first and editorial checks to the CV text wherever they are applicable.

Mandatory principles from that gate include preservation of semantics, removal of synthetic completeness and repetitive machine-like constructions, natural sentence rhythm, clear references, and preference for concrete evidence over abstract prose.

For Russian-language CVs, run the repository's current mechanical checker and extended review as documented by that repository, then fix all relevant blocking findings and review applicable soft findings.

For non-Russian CVs, the repository must still be loaded and its language-independent mechanical/editorial principles applied, but Russian-specific grammar or native-usage findings must not be treated as valid English-language corrections. Use a language-appropriate humanization pass in addition when available.

Do not claim an exact checker run if the runtime cannot execute the repository's checker. Report that tooling limitation explicitly instead of pretending a pass happened.

## Final QA

Before producing DOCX:

1. compare the final CV against the vacancy requirement-to-evidence map;
2. verify that the strongest requirements are backed by visible experience, not only the summary or skills section;
3. verify every number against a source;
4. verify that relevant experience was not lost during shortening;
5. run the applicable humanizer checks;
6. generate DOCX and perform mandatory render-to-image visual QA on every page.

The final question is not `Can this fit on two pages?` It is `Can a recruiter see, in concrete evidence, why Anton has already done enough of this job to be credible?`
