# New Project Workflow

This guide explains how to add a new project case study to the portfolio in a way that stays consistent with the rest of the repository.

Use this together with:
- [agent_case_study_format.md](./agent_case_study_format.md)

## Goal

Add a project as a strong case study, not as a random note dump.

## Required Inputs

Before creating a new case, collect as much of this as possible:

- product or project name
- what it is
- target user or customer
- your role
- stack
- core problem
- what you built
- technical or product complexity
- business or operational result
- screenshots, demo files, public links, Upwork links, references

## Folder Rules

Each project should have:

- `portfolio/project_name/README.md`
- `portfolio/project_name/media/` for screenshots, demos, and visual assets

Use lowercase folder names with underscores only.

## Media Rules

- Put public-facing assets into `media/`
- Prefer clean, descriptive filenames
- Avoid raw export names if the file is referenced in README
- Keep only the media that supports the story

Examples of good names:

- `dashboard.png`
- `mobile-view.png`
- `client-portal-map.png`
- `demo.webm`
- `architecture.png`

## Writing Rules

- Write in English
- Keep the case public-facing
- Be concrete, but do not turn it into a technical dump
- Prefer explaining system value over tool lists
- If no strong metric exists, describe:
  - scope
  - complexity
  - ownership
  - workflow improvement
  - architectural challenge

## Recommended Structure

1. Overview
2. My Role
3. Context / Problem
4. What the System Does
5. Key Features or Architecture
6. Tech Stack
7. Challenges
8. Result
9. Key Takeaway
10. Screenshots / Media
11. Additional Notes

## Quality Check

Before finalizing a case, ask:

- Is this clearly more than a tool list?
- Is my role explicit?
- Is the business or operational context understandable?
- Is there at least one concrete challenge?
- Does the project prove something important about how I work?
- Are the screenshots named and linked cleanly?

## Index Update

When a new case is added:

- update [portfolio/README.md](./README.md)
- put the project in `Ready`
- use the public-facing project title, not the raw folder name

## Preferred Framing

The strongest framing in this repository is usually one of these:

- operational system
- internal platform
- workflow-heavy product
- automation layer
- assessment platform
- role-based business tool
- AI-assisted product

## Avoid

- “I made a website” framing for a system-like project
- generic freelancer language
- vague outcome claims
- unstructured screenshot dumps
- keeping internal drafts mixed with the public case unless they serve a purpose
