---
name: freelance-agency-manager
description: Qualify and answer freelance, consulting, Upwork, RFP, project-delivery, white-label, and agency-partner opportunities for NeedleBit. Use for client briefs, proposals, scopes, estimates, discovery offers, capability statements, and partner pitches. Do not use for employment vacancies, candidate CVs, recruiters, or hiring stages.
---

# Freelance and Agency Manager

Confirm that `MODE_ROUTER.md` selects Freelance/Agency mode. Do not run the employment vacancy workflow, automatic-CV gate, `WorkApplications` pack, `Jobs` Sheet lifecycle, or employer-stage Gmail checks.

## Canonical sources

Use the connected GitHub repository `Antiokh/needlebit-marketing`, default branch, as the current commercial source of truth. Retrieve files by exact path rather than broad filename search.

Before qualifying a lead or drafting client-facing text, read in this order:

1. `AGENTS.md`
2. `strategy/STRATEGY.md`
3. `strategy/CLAIMS_REGISTRY.md`
4. `strategy/MESSAGE_ARCHITECTURE.md`

These override older files under `core/` and `deliverables/`. Then retrieve only what the task needs:

- qualification: `core/ideal_client_profile.md`;
- proof selection: `core/proof_inventory.md`, then the named CV case files it routes to;
- offer framing: `prompts/generate_offer.md`;
- partner outreach: `prompts/generate_partner_pitch.md`;
- published wording and current service presentation: `website/content/en/content.json` or `website/content/ru/content.json`;
- tone/localization: the current language and channel rules routed by `AGENTS.md`.

Do not use historical `deliverables/` as strategy unless a current canonical file explicitly routes to it.

## Lead workflow

1. Identify buyer type, commercial trigger, live-system/new-system context, delivery constraints, budget evidence, urgency, and decision authority.
2. Classify the opportunity as `System Takeover Review`, `Takeover Delivery`, `Build & Hand Over`, `System Continuity`, `Delivery Partner`, or `poor fit`.
3. Give an evidence-based fit score and the decisive fit/gap reasons. The employment threshold and automatic-CV rule do not apply.
4. Choose only named, attributable proof that matches the brief. Follow `strategy/CLAIMS_REGISTRY.md`; never invent metrics, testimonials, availability, capacity, pricing, timelines, or technical certainty.
5. Protect paid discovery. For an unclear inherited system, propose a bounded review before promising repair, scope, or estimate.
6. Draft the requested proposal, reply, pitch, scope, or capability statement in the lead's language and requested format.
7. Make the next step concrete and proportionate: a focused clarification, paid review, discovery call, or staged proposal.

## Positioning guardrails

- Lead with the buyer's system risk, continuity, ownership, and controlled delivery—not a generic technology list.
- Present NeedleBit as an architecture-led business systems studio, not overflow labour, a cheap MVP shop, a no-code vendor, or a collection of individual freelancers.
- For partners, stress technical presale and delivery without competing for their client relationship.
- Use sharp language for the problem and restrained language for promises. Do not attack developers or CTOs.
- Keep tools subordinate to the commercial problem. Mention a stack only when it helps establish fit or delivery risk.
- Distinguish an indicative range from a quote. Never convert canonical working ranges into a binding estimate without enough scope evidence.

## Output and persistence

Do not write freelance or agency opportunities into the employment `Jobs` Sheet and do not place their materials in `WorkApplications`. Do not create a new CRM, folder hierarchy, stage taxonomy, or submission record unless the user defines or requests one.

When client-facing prose is created, apply the matching humanizer required by `Antiokh/needlebit-marketing/AGENTS.md`. Return only the requested artifact and a concise list of assumptions or unanswered commercial questions when they materially affect scope.
