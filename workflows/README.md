# Workflows

This folder contains process and agent-oriented guidance for turning the repository into tailored application materials.

## Who This Is For

This folder is primarily for:

- AI agents working inside this repository
- humans preparing tailored applications from the canonical profile

## Why This Exists

These files explain how to use the repository as a working system, not just as a public CV.

They answer questions like:

- how to prepare a job-specific resume without polluting canonical files
- how to choose the right narrative for a vacancy
- how to position the profile for different role types
- how to generate application materials from the repository safely

## Agent Modes

Agents working in this repository should assume one of two main modes:

### 1. Application Mode

Use this mode when the task is about:

- tailored resumes
- cover letters
- job targeting
- profile positioning
- vacancy-specific narrative selection

Start here:

1. [Application Agent Guide](./application_agent_guide.md)
2. [Application Workflow](./application_workflow.md)
3. [Job Targeting Guide](./job_targeting_guide.md)
4. [AI Profile Suggestions](./ai_profile_suggestions.md)
5. [Evidence Map Guide](./evidence_map_guide.md)
6. [Role Market Fit Matrix](../data/role_market_fit.md)
7. [Career Strategy](../data/career_strategy.md)
8. [Pack Template](../data/pack_template.md)
9. [Public Summary](../data/public_summary.md)
10. [Application Tracker](../data/application_tracker.md)

Expected output:

- tailored materials in `applications/`
- improved positioning logic when broadly useful

Do not use this mode for:

- rewriting portfolio case studies
- adding screenshots or portfolio media
- restructuring project folders

### 2. Portfolio Mode

Use this mode when the task is about:

- adding a new project case
- rewriting an existing project `README.md`
- improving screenshots, covers, or media naming
- strengthening portfolio evidence

Start here:

1. [Portfolio Agent Navigator](../portfolio/agent_portfolio_navigator.md)
2. [Portfolio Index](../portfolio/README.md)
3. [Agent Project Intake Guide](../portfolio/agent_project_intake_guide.md)
4. [Agent Case Study Format](../portfolio/agent_case_study_format.md)

Expected output:

- stronger project case-study files in `portfolio/`
- cleaner media references
- updated portfolio index when needed

Do not use this mode for:

- vacancy-specific resumes
- cover letters
- role targeting logic

## Switching Rule

If a task starts with one mode but requires the other, split the work explicitly:

- first update canonical portfolio evidence in `portfolio/`
- then use `workflows/` to build application materials from that evidence

## When To Read This Folder

Use `workflows/` when the task is about:

- tailored resumes
- cover letters
- job targeting
- profile positioning
- agent behavior for application work

Do not start here when the task is about:

- understanding Anton's public profile -> start with `README.md`
- reading detailed experience -> go to `details/`
- reading structured machine data -> go to `data/`
- adding or rewriting project case studies -> go to `portfolio/agent_portfolio_navigator.md`

## Read Order For Agents

1. [Application Agent Guide](./application_agent_guide.md)
2. [Application Workflow](./application_workflow.md)
3. [Job Targeting Guide](./job_targeting_guide.md)
4. [AI Profile Suggestions](./ai_profile_suggestions.md)
5. [Evidence Map Guide](./evidence_map_guide.md)
6. [Role Market Fit Matrix](../data/role_market_fit.md)
7. [Career Strategy](../data/career_strategy.md)
8. [Pack Template](../data/pack_template.md)
9. [Public Summary](../data/public_summary.md)
10. [Application Tracker](../data/application_tracker.md)

## Included

- [AI Profile Suggestions](./ai_profile_suggestions.md)
- [Application Workflow](./application_workflow.md)
- [Application Agent Guide](./application_agent_guide.md)
- [Job Targeting Guide](./job_targeting_guide.md)
- [Evidence Map Guide](./evidence_map_guide.md)
- [Role Market Fit Matrix](../data/role_market_fit.md)
- [Career Strategy](../data/career_strategy.md)
- [Pack Template](../data/pack_template.md)
- [Public Summary](../data/public_summary.md)
- [Application Tracker](../data/application_tracker.md)

These files are internal working documents, not the main public profile surface.
