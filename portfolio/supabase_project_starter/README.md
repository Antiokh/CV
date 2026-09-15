# Supabase Project Starter - Agent-Ready Backend Engineering Baseline

## Overview

`supabase-project-starter` is a reusable baseline for Supabase projects designed for both human developers and AI coding agents.

Its purpose is not to provide another empty scaffold. It packages the operating rules, source-of-truth boundaries, shared helpers, SQL patterns, and task-routing documentation needed to work safely across Supabase Cloud, local CLI environments, and self-hosted deployments.

**Role:** Creator, systems architect, and developer  
**Repository:** https://github.com/Antiokh/supabase-project-starter

## What the System Does

- Provides a runtime-facing Supabase project scaffold.
- Separates project-owned runtime SQL from reusable starter templates and generated snapshots.
- Includes shared and optional Edge Function helpers.
- Defines SQL function versioning and schema/DDL export workflows.
- Documents cloud, local, hybrid, and self-hosted operating modes.
- Gives AI agents an explicit entry point, decision tree, task routing, and source-of-truth rules before they modify a project.

## Key Features

### Agent-oriented operating model

The repository tells an agent to identify deployment mode, auth context, SQL source-of-truth policy, and file ownership before editing. Task-specific routing then limits how much documentation needs to be loaded for a given change.

### Explicit source-of-truth boundaries

Runtime files, reusable starter templates, generated artifacts, and read-only snapshots are treated as different categories instead of being mixed into one SQL folder.

### Reusable backend helpers

The starter includes shared Edge Function infrastructure plus optional utilities for debugging, authentication reference, CORS checks, environment inspection, text diffs, Git publication, and identity inspection.

### Multiple deployment modes

The same engineering baseline is designed to remain usable across managed Supabase, local CLI work, and self-hosted or offline-sensitive environments.

## Tech Stack

- **Backend platform:** Supabase
- **Database:** PostgreSQL
- **Serverless runtime:** Edge Functions / TypeScript / Deno
- **Security model:** Supabase Auth and RLS-oriented project rules
- **Tooling:** Supabase CLI, SQL, Git
- **Development model:** human + AI-agent workflows

## Challenges

### Making agentic development constrained rather than improvisational

AI coding agents can move quickly but easily edit generated files, cross deployment boundaries, or make incorrect assumptions about auth and database ownership. The starter addresses this by putting repository-specific decisions ahead of code generation.

### Supporting incompatible operating environments

Cloud, local, and self-hosted Supabase projects do not share every operational assumption. The project therefore separates common project structure from deployment-specific rules instead of pretending that one workflow fits all environments.

### Keeping reusable patterns distinct from application state

Starter-source SQL, generated schema snapshots, and project-owned runtime SQL need different lifecycle rules. The repository makes those distinctions explicit so copied projects remain maintainable after initialization.

## Result

A reusable Supabase engineering baseline that packages architecture, helper code, documentation, source-of-truth rules, and agent operating constraints in one repository.

It reduces the amount of project-specific infrastructure that has to be rediscovered each time a new Supabase system is started while preserving room for different deployment models.

## Key Takeaway

This project demonstrates platform engineering and agentic-development discipline: reusable infrastructure is useful only when the rules around ownership, deployment, security, and modification are as explicit as the code itself.

## Additional Notes

Public repository: https://github.com/Antiokh/supabase-project-starter
