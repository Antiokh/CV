# humanizer_russian - Source-Aware Russian Editorial Engine

## Overview

`humanizer_russian` is a Russian-language editorial system built around a stricter premise than typical AI-text “humanizers”: preserve meaning, factual content, and author voice first, then identify places where the Russian itself is unnatural, structurally weak, or stylistically mismatched.

It combines deterministic linting with a deeper editorial-review mode and keeps the provenance of recommendations instead of collapsing different editorial schools into one anonymous style score.

**Role:** Creator, systems architect, developer, and editorial/research lead  
**Repository:** https://github.com/Antiokh/humanizer_russian

## What the System Does

The project has one knowledge base and two main operating modes.

### Compact deterministic check

A CLI pass designed for ordinary editing and CI. It can report high-confidence mechanical findings, run a wider `--extended` pass, work with explicit registers, emit JSON, and fail CI when selected findings are present.

### Editorial board review

A deeper review mode evaluates text through separate normalized editorial libraries while preserving the source of each conclusion and explicit disagreement between sources.

As of August 21, 2026, the system contains eight active profiles:

- Russian language / modern norm and usage;
- Living Russian;
- Nora Gal;
- Maxim Ilyakhov / Lyudmila Sarycheva;
- Korney Chukovsky;
- Lynn Visson;
- D. E. Rosenthal;
- I. B. Golub.

A limited A. V. Velichko study on Russian as a foreign language and grammar is integrated into the Russian-language core rather than exposed as another reviewer persona.

## Architecture and Rules

The project separates hard constraints from editorial preference.

```text
USER_INTENT + SEMANTICS + NORM
              |
              v
acceptable variants
              |
              v
AUTHOR > NATIVE_USAGE > EDITING > AI_CALQUE > detector-like signals
```

This means an editorial authority cannot create a language error merely because a source dislikes a construction, and “change nothing” is a valid result when the text already works.

All active libraries use a normalized `review_v1` contract. Repeated observations can share source-independent phenomenon identifiers while keeping their source provenance. Real disagreement remains `SOURCE_CONFLICT` instead of being averaged away.

Generated capability snapshots are checked against repository manifests, and CI fails when the saved generated state diverges from its sources.

## Engineering Details

- Python CLI for compact and deep review modes.
- JSON output for machine-readable integration.
- CI-oriented exit codes and `--fail-on-findings` behavior.
- Register-aware analysis.
- A shared prose masker that preserves text length while excluding code blocks, inline code, URLs, Markdown-link destinations, and HTML comments from prose rules, keeping line numbers and ranges stable.
- Deterministic normalization and deduplication of findings.
- Separate, disabled-by-default infrastructure for contextual model evaluation.
- Optional evidence-source architecture kept separate from reviewer opinions.
- Generated human- and machine-readable capability snapshots.

## Key Design Challenges

### Formalizing editorial knowledge without turning taste into grammar

Books on editing mix norm, preference, examples, historical advice, rhetoric, and context-sensitive judgment. The system needs to preserve those distinctions instead of translating every recommendation into a blocking linter rule.

### Preserving disagreement

Nora Gal, Rosenthal, Chukovsky, Ilyakhov/Sarycheva, and contrastive-language sources do not always optimize for the same thing. The architecture keeps those differences visible rather than manufacturing false consensus.

### Controlling false positives

Many useful Russian-language phenomena are contextual: ellipsis, repetition, information structure, aspect, voice, word order, and register cannot safely be reduced to simple banned-word lists. Lower-confidence or context-dependent knowledge therefore remains outside hard gates until it has enough evidence.

### Keeping model evaluation subordinate to evidence

The repository has infrastructure for model-based contextual checks, but model output cannot promote a rule into modern linguistic norm or a hard gate by itself. External validation tasks are tracked explicitly instead of being presented as completed work.

## Result

The project is already a working editorial tool rather than a prompt collection: it has deterministic checks, normalized knowledge libraries, provenance, conflict handling, CI integration, machine-readable output, and explicit validation boundaries.

At the same time, unfinished external validation remains visible in the project status. The system does not claim completed corpus calibration, independent philological review, or model validation until those checks actually happen.

## Key Takeaway

`humanizer_russian` demonstrates how I approach an ambiguous expert domain: separate facts from preferences, formalize contracts, preserve provenance and uncertainty, automate only what can be automated safely, and build validation into the architecture instead of adding it after the system grows.

## Links

- [Repository](https://github.com/Antiokh/humanizer_russian)
- [Project status](https://github.com/Antiokh/humanizer_russian/blob/main/PROJECT_STATUS.md)
- [Capabilities snapshot](https://github.com/Antiokh/humanizer_russian/blob/main/docs/capabilities.md)
