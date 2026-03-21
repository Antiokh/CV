# PromptlessPress — AI Product Generation Platform

## Overview

PromptlessPress is a platform for generating ready-to-sell digital products using AI (e.g. printable cards, wall art, planners).

The system allows users to configure product parameters, generate visuals, create mockups, and export complete product packages.

The main challenge of the project was building a system that works reliably with **non-deterministic AI outputs** while keeping the user experience structured and usable.

---

## What the System Does

- Generate product visuals based on structured inputs  
- Produce multiple previews and variations  
- Create realistic mockups (lifestyle, flat lay, etc.)  
- Generate product metadata (titles, descriptions, tags)  
- Export ready-to-sell product bundles  

---

## Key Features

### Flexible Product Configuration
Users can define:
- product type  
- style  
- format and size  
- custom input parameters  

---

### AI-Powered Generation
- automated image generation  
- multiple preview variations  
- regeneration and refinement workflow  

---

### Mockups & Packaging
- automatic mockup generation  
- multiple presentation formats  
- export as ready-to-use product bundles  

---

### Dashboard & Workflow
- history of generated products  
- quick access to previews and assets  
- ability to regenerate or refine outputs  

---

### Debug & Iteration Tools
- internal interface for reviewing failed or rejected generations  
- ability to inspect and refine generation inputs  
- designed to support continuous improvement of results  

---

## Tech Stack

- **Frontend:** WeWeb  
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)  
- **AI:** OpenAI, fal.ai  
- **Payments:** Stripe  

---

## Challenges

### AI Output Variability
AI results are not deterministic, which required building a system that supports iteration and refinement instead of relying on one-shot generation.

---

### Prompt Iteration
A significant part of the work involved refining inputs to achieve consistent visual quality. This process is experimental and cannot be fully automated.

---

### Realtime UX Limitations
Handling asynchronous generation and keeping the UI in sync with backend state required additional workarounds.

---

## Result

A working platform that combines AI generation, product preparation, and export into a single workflow.

The system is designed to scale and evolve, while acknowledging that final output quality depends on iterative refinement rather than strict automation.

---

## Key Takeaway

This project demonstrates how to build a structured product system on top of probabilistic AI, balancing automation with human-driven refinement.

---

## Screenshots

_Add screenshots here_