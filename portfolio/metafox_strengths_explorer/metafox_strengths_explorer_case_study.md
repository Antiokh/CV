# MetaFox Strengths Explorer — Project Case Study

## Overview

**MetaFox Strengths Explorer** is a browser-based strengths assessment platform built for coaching and personal development. The product combines **self-assessment**, **peer feedback**, and a **generated strengths report** to help users better understand how they use their strengths, where they may be underusing them, and how they are perceived by others.

The public product positioning focuses on strengths coaching, self-awareness, and structured feedback as part of a broader emotional intelligence and personal development ecosystem.

From an implementation perspective, this was not a simple questionnaire app. It required building a full product from scratch around a changing psychometric model, multi-user feedback flows, result normalization, report generation, and an admin layer that allowed the client to inspect results and refine the scoring model over time.

---

## My Role

I built and delivered the product end-to-end on the technical side.

I was responsible for:

- full product implementation from scratch
- backend architecture in **Xano**
- business logic and scoring logic
- data model design
- frontend implementation and visual interaction design
- report generation and delivery flow
- admin tooling for result inspection and model debugging
- iteration support while the client evolved the assessment model

The only area I did not own was the original product idea and German-language content authoring.

---

## Product Goal

The platform was designed to turn an assessment and coaching methodology into a scalable digital product.

A user can:

1. complete a self-assessment
2. receive calculated and normalized results
3. invite friends, colleagues, or other people to provide feedback
4. compare internal self-perception with external perception
5. receive a final visual report
6. download the report as PDF and use it as a basis for coaching work

This created a bridge between a paper-based or facilitator-led methodology and a structured digital product that could be used repeatedly, consistently, and at scale.

---

## Tech Stack

- **Frontend:** WeWeb
- **Backend:** Xano
- **Logic:** Xano functions, backend business logic, and some custom code where needed
- **Analytics:** Google Analytics integration
- **Output:** PDF generation, storage, and email delivery

The project intentionally used a **non-AI architecture**. All scoring, normalization, rankings, and categorization were deterministic and explicitly modeled.

---

## Core Functionalities

### 1. Self-Assessment
Users complete a structured questionnaire to assess their own strengths profile.

### 2. Peer Feedback
Users can invite other people to evaluate them. Feedback participants can identify their relationship to the person they are evaluating, such as friend, sibling, colleague, or another role.

### 3. Scoring and Normalization
Results are not taken at face value. The system calculates raw scores and then normalizes them to reduce distortion from highly optimistic or highly negative answer patterns.

### 4. Strength / Weakness Classification
The system determines strong and weak areas mathematically, while also handling edge cases where a user’s profile is skewed toward extremes.

### 5. Visual Report
The platform generates a visual results report, including radar-chart-based presentation.

### 6. PDF Export and Delivery
The final report can be generated as a PDF, stored for the user, and sent by email.

### 7. Admin Interface
Administrators can inspect sessions, answers, and results to identify model issues, validate calculations, and support future model refinements.

---

## Assessment and Feedback Model

The product evolved while it was being built.

Originally, the questionnaire contained **36 questions**. Later, the model was changed and expanded to **64 questions**. This significantly affected both implementation and user behavior.

In addition to the core assessment, the feedback model was expanded so external reviewers could evaluate:

- which qualities a person demonstrates
- how well they demonstrate them
- how frequently they demonstrate them
- broader qualitative feedback

This meant the application had to support not only a changing number of questions, but also a changing scoring model and additional dimensions inside the feedback process.

---

## Data Architecture

The backend was structured around multiple dedicated entities rather than a single flat results table.

Key concepts included:

- **Users**
- **Base assessment sessions**
- **Feedback sessions**
- **Question and answer data**
- **Calculation tables for derived parameters**
- **Normalization tables**
- **Ranking tables**
- **Strength classification logic**
- **Generated report artifacts**

This separation was important because the system had to support:

- raw responses
- post-processing
- normalization
- ranking
- final interpretation
- inspection and re-evaluation when the model changed

Instead of treating “result” as a single static value, the architecture allowed the system to move through several transformation stages.

---

## Scoring Logic

One of the most important technical problems was that self-reported data is often biased.

Some users rate themselves as if everything is going great.
Some users rate themselves as if everything is going terribly.
That produces distorted raw outputs, especially in psychometric or reflective tools.

To address this, the platform introduced a **normalization layer**.

### Normalization approach
A key part of the logic was to anchor each user’s internal scale more meaningfully. In practice, the system normalized results so that the lowest point in the user’s own profile could be treated as a baseline, allowing the explored range to be brought into a more useful comparative frame.

This improved the representativeness of the final graph and made the output more interpretable for both users and coaches.

### Rankings and weighted parameters
The platform also used:

- parameter weights
- rankings
- derived calculations across multiple tables
- mathematical rules to classify strengths and under-realized areas

### Edge-case handling
An especially important part of the logic was handling extreme distributions.

Examples:

- If a user appeared to have “too many strengths,” some items still needed to be reclassified into less-realized areas to preserve interpretive value.
- If nearly everything looked strong, naive thresholding could incorrectly force some items into “weakness” territory.

The model therefore needed more than simple threshold checks. It required logic based on **relative position, extremums, and profile shape**.

---

## Multi-User Flow Design

The product had to support two distinct session types:

### A. Self-assessment sessions
These were allowed to persist so the user could continue later from where they stopped.

### B. Feedback sessions for other people
Initially, continuation was also considered here, but real-world usage showed a different pattern: multiple people would often complete feedback from the same device. Persisting unfinished feedback sessions caused conflicts and confusing behavior.

The solution was pragmatic:

- keep continuation for the main self-assessment flow
- remove continuation for external feedback flows
- clean up unfinished feedback sessions when necessary rather than preserving problematic state

This is a good example of adapting architecture to observed behavior instead of defending an originally “cleaner” but less practical approach.

---

## Frontend and UX Challenges

The most difficult implementation area was the visual and interactive frontend.

The client came with the methodology and concept, but the product itself had to be designed and built from zero.

### Complex interaction model
A particularly difficult UI problem was implementing a **two-dimensional input matrix**.

This was not just a standard one-axis slider. The interface needed to capture two independent dimensions at once:

- an **energy dimension** — whether an action energizes the user or drains energy
- a **usage dimension** — how often or how rarely that behavior is used

Creating a workable square-based interaction model for this inside a no-code frontend environment was substantially harder than building standard forms.

### Radar visualization
The results also had to be presented in a visually convincing way through a radar-chart-based interface that later had to survive PDF rendering as well.

That added another layer of complexity:

- interactive browser rendering
- export-safe rendering
- stable output inside generated reports

---

## PDF Generation Pipeline

The report flow was a meaningful product component, not an afterthought.

The system produced a final report that:

- visualized the user’s results
- was generated as a PDF
- was stored for later access
- could be emailed automatically to the user

This required aligning frontend rendering, backend session data, chart output, and document lifecycle management.

---

## Admin and Model-Inspection Layer

Because the scoring model changed over time, an admin layer was essential.

The admin interface allowed administrators to:

- review user results
- inspect individual answers
- spot inconsistencies or model weaknesses
- validate whether the scoring behaved as intended
- refine the model over time

This mattered because the client changed the methodology more than once. Without admin inspection tools, every scoring change would have been much harder to validate and maintain.

In practice, this turned the platform into both:

- a user-facing assessment product
- an internal model-observation environment

---

## Main Technical Challenges

### 1. Building around a moving model
The psychometric model changed multiple times during implementation.

That meant the system had to remain flexible enough to support:

- changes in question count
- changes in feedback dimensions
- changes in scoring logic
- changes in interpretation rules

### 2. Making self-reported data usable
Raw answers alone did not produce reliable enough output. A normalization layer had to be introduced to compensate for response style bias.

### 3. Handling profile-shape edge cases
Simple “top = strengths, bottom = weaknesses” logic was not sufficient. Extreme or compressed profiles created interpretive errors unless the model accounted for them explicitly.

### 4. Implementing advanced UI in a no-code environment
The two-axis matrix interaction was much more demanding than standard sliders or forms.

### 5. Preserving a smooth user journey
Longer questionnaires improved model depth but also reduced willingness of feedback participants to complete the process. This is a classic product tension between methodological richness and conversion.

### 6. Keeping reporting stable across browser and PDF contexts
Charts and visual summaries needed to look good both interactively and in exported documents.

---

## Product Trade-Offs and Lessons

### Questionnaire depth vs completion rate
When the questionnaire increased from 36 to 64 questions, feedback participation dropped. The richer model came with a real usability cost.

### Elegant persistence vs real-world behavior
Saving unfinished feedback sessions looked reasonable at first, but real usage patterns made that approach less reliable. Simplifying the logic produced a better operational result.

### Mathematical rigor vs interpretability
A scoring model is not useful if the final output feels obviously wrong to users. Good assessment software needs both formal logic and psychologically believable output.

### No-code speed vs interaction complexity
WeWeb and Xano were sufficient to build the platform, but certain interaction patterns and visual behaviors required extra effort, custom logic, and careful architectural decisions.

---

## Why This Project Matters in My Portfolio

This project demonstrates more than CRUD implementation.

It shows my ability to:

- translate a conceptual methodology into a working digital product
- design backend architecture for evolving scoring systems
- implement deterministic scoring and normalization logic
- build multi-user workflows with different session behaviors
- solve difficult UI problems in a low-code / no-code environment
- generate polished user-facing outputs such as PDFs
- create admin tooling that supports model validation and iteration

In short, this was a **full product engineering case**, not just a front-end build and not just a form-based backend.

---

## Suggested Portfolio Summary

**MetaFox Strengths Explorer** is a strengths assessment and peer-feedback web application for coaching and personal development. I built the product end-to-end using WeWeb and Xano, including backend architecture, scoring and normalization logic, multi-user session flows, radar-chart reporting, PDF generation, and an admin interface for inspecting answers and refining the assessment model. One of the main technical challenges was implementing a changing psychometric model in a deterministic system while keeping the user experience understandable and the final output psychologically credible.

---

## Suggested One-Line Version

Built a full-stack strengths assessment platform with peer feedback, custom scoring and normalization logic, advanced visual reporting, PDF generation, and admin tooling using WeWeb and Xano.

---

## Suggested Screenshots to Add

To make this case study stronger in a portfolio, I would add 2–4 screenshots:

1. **Assessment interface** — especially the two-dimensional input matrix if available
2. **Radar chart results screen**
3. **PDF report page**
4. **Admin panel / session inspection view**

