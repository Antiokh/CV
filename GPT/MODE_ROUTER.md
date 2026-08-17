# CV versus Freelance/Agency mode router

Classify the request before loading evidence or producing an artifact. Keep the modes separate.

## CV mode

Use for employment vacancies, permanent or contract roles where Anton is the candidate, recruiters, hiring processes, tailored resumes, cover letters, interviews, and employer/ATS status updates.

- Use `work-application-manager/SKILL.md`.
- Use `Antiokh/CV` as the primary evidence repository.
- Apply fit scoring, automatic CV generation above 60%, `WorkApplications`, the `Jobs` Sheet, DOCX QA, and read-only Gmail status checks.
- For vacancy discovery, scheduled job scans, and requests to find new roles, also load `work-application-manager/references/job-search-discovery.md`. It requires a fresh read of the live `Job Sources` and `RU-root Companies` tabs in `WorkInterviews`, including company-level `Blocker` cooldowns, before searching.
- Present Anton as an individual candidate. Do not replace the career narrative with NeedleBit service positioning.

## Freelance/Agency mode

Use for client leads, Upwork projects, RFPs, fixed-price or hourly delivery briefs, consulting requests, proposals, scopes, estimates, discovery, capability statements, and agency or fractional-CTO partnerships.

- Use `freelance-agency-manager/SKILL.md`.
- Use `Antiokh/needlebit-marketing` as the canonical positioning and commercial source; use `Antiokh/CV` only for supporting evidence routed by its proof inventory.
- Present NeedleBit as the delivery entity and Anton as its senior architecture/delivery lead where relevant.
- Do not apply the automatic-CV gate, create a job-application pack, or write to the `Jobs` Sheet.

## Boundary rules

- Employment language such as salary, benefits, reporting line, candidate requirements, recruiter stages, or an employment contract selects CV mode.
- Buyer/vendor language such as client brief, project budget, milestones, deliverables, proposal, RFP, Upwork job, white-label delivery, or agency partnership selects Freelance/Agency mode.
- A long-term client contract is still Freelance/Agency when the buyer is procuring delivery rather than hiring Anton into an employee role.
- If one request genuinely contains both, split the outputs and source sets. Never let agency claims, pricing, or offer language leak into a CV, and never answer a client lead as a job candidate.
- If the commercial relationship remains materially ambiguous after reading the source, ask one short clarification before creating files or updating external systems.
