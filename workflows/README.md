# Workflows

Public agent utilities for turning the repository's verified evidence into tailored application materials.

## Application Mode

Use for tailored resumes, cover letters and vacancy-specific evidence selection.

Start here:
1. [Application Agent Guide](./application_agent_guide.md)
2. [Application Workflow](./application_workflow.md)
3. [HH Application Agent Workflow](./hh_application_agent_workflow.md)
4. [Evidence Map Guide](./evidence_map_guide.md)
5. [Pack Template](../data/pack_template.md)
6. [Public Summary](../data/public_summary.md)
7. [Portfolio Index](../portfolio/README.md)
8. [Full Professional Experience](../details/anton_nazarov_experience_full.md)
9. [Management Cases](../details/anton_nazarov_management_cases_full.md)
10. [Recommendations Dataset](../data/anton_nazarov_recommendations.json)
11. [Strengths Reference](../details/metafox_strengths_report.md)

Expected output: tailored materials in the local ignored `applications/` workspace.

## Portfolio Mode

Use when adding or improving project case studies.

Start here:
1. [Portfolio Agent Navigator](../portfolio/agent_portfolio_navigator.md)
2. [Portfolio Index](../portfolio/README.md)
3. [Agent Project Intake Guide](../portfolio/agent_project_intake_guide.md)
4. [Agent Case Study Format](../portfolio/agent_case_study_format.md)

## Public/private boundary

This public repository is an evidence and presentation surface. Agents must not commit:
- psychometric weaknesses or development recommendations
- compensation strategy
- draining-zone analysis
- internal role-avoidance logic
- private application tracking or negotiation notes

Those materials belong in the private marketing/positioning workspace.

## Switching Rule

If a task requires both portfolio and application work, first update canonical public evidence in `portfolio/`, then generate application-specific materials locally without committing them.
