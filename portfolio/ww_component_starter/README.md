# WeWeb Component Starter - Agent-Ready Custom Component Engineering Kit

## Overview

`ww-component-starter` is a reusable engineering starter and documentation pack for building custom WeWeb components as real Vue-based platform extensions rather than isolated snippets.

It packages a minimal component scaffold together with a consolidated guide to WeWeb's schema, runtime, platform APIs, editor orchestration, form integration, repeated content, embedded child elements, and agent-assisted development workflows.

**Role:** Creator, systems architect, and developer  
**Repository:** https://github.com/Antiokh/ww-component-starter

## What the System Does

- Provides a minimal `ww-config.js` + Vue runtime component baseline.
- Documents the contract between editor schema, Vue runtime behavior, `wwLib`, and WeWeb editor state.
- Covers platform-facing state, events, actions, variables, forms, collections, bindings, and repeated content.
- Defines safe patterns for hidden embedded elements, editor-side mutation, front-document access, and floating UI.
- Gives coding agents a canonical entry point and curated reference path instead of relying on generic Vue assumptions.

## Key Features

### Four-layer component model

The project treats a serious WeWeb component as four connected layers: schema, runtime, platform APIs, and editor orchestration. This prevents the common mistake of treating a WeWeb component as ordinary Vue with a few props.

### Platform-specific engineering rules

The guide formalizes constraints around reactive `content`, editor-only blocks, `wwLib` DOM access, root sizing, workflow events, internal variables, and WeWeb's build assumptions.

### Advanced data and editor patterns

The starter documents Formula-based mapping, normalized collection access, form registration, platform-visible internal state, bound properties, side-panel state, repeated item context, compound components, dropzones, and editor automation.

### Agent-oriented reference pack

Instead of asking an AI agent to rediscover WeWeb architecture from examples, the repository provides a canonical master guide, API matrices, pattern indexes, official reference-component pointers, and explicit implementation constraints.

## Tech Stack

- **Frontend:** Vue
- **Platform:** WeWeb custom component system
- **Language:** JavaScript
- **Platform APIs:** `wwLib`, component variables, workflows, form APIs, editor state
- **Tooling:** WeWeb CLI, Git
- **Development model:** human + AI-agent workflows

## Challenges

### Bridging code and a visual builder

A custom WeWeb component must work simultaneously as Vue code, a configurable no-code element, an editor object, and a participant in platform workflows. The architecture has to respect all four surfaces.

### Preserving editor behavior

Bindings, hidden child trees, side-panel state, copy operations, repeated contexts, and derived editor-managed structures can break even when the runtime Vue component appears correct. The starter makes these editor contracts explicit.

### Avoiding generic Vue assumptions

Raw DOM access, static prop initialization, custom bundler configuration, or simplistic data mapping can all produce subtle failures inside WeWeb. The guide turns those recurring failure modes into concrete constraints and decision rules.

## Result

A reusable starting point for building production-oriented WeWeb custom components with a much clearer engineering model than a bare component template.

The repository also acts as a knowledge-transfer layer for AI-assisted component work, reducing the amount of platform-specific context that has to be reconstructed for each new component.

## Key Takeaway

This project demonstrates depth below the no-code surface: extending WeWeb reliably requires platform-aware Vue engineering, editor-state design, API knowledge, and explicit development guardrails.

## Additional Notes

Public repository: https://github.com/Antiokh/ww-component-starter
