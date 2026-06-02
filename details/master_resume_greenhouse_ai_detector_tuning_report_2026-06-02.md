# English Greenhouse Master Resume AI Detector Tuning Report

Date: 2026-06-02

Tuned file:

- `details/master_resume_greenhouse.md`

Preserved tuned version:

- `details/versions/master_resume_greenhouse_2026-06-02_ai_detector_tuned.md`

Raw retest attempt:

- `details/master_resume_greenhouse_ai_detector_results_2026-06-02_tuned.json`
- `details/master_resume_greenhouse_ai_detector_results_2026-06-02_tuned_rerun.json`
- `details/master_resume_greenhouse_ai_detector_results_2026-06-02_tuned_final.json`

## Previous Detector Risk

The earlier English master resume audit found these high-risk blocks:

| Block | AI Text Detector | AIDetego |
|---|---:|---:|
| Summary | 45% / Likely Human | 100% |
| Core Skills | 75% / Likely AI | 49% |
| Technical Stack | blocked | 49% |
| NeedleBit | 25% / Human Written | 96% |
| Directorate of Cultural Centers of Moscow | 25% / Human Written | 85% |
| ZIL Cultural Center | blocked | 96% |

The main issue was not hidden Unicode. The earlier scan found no zero-width or directional-control characters. The risk came from polished resume phrasing, symmetrical lists, compact technology taxonomy, and repeated bullet rhythm.

## What Was Tuned

The English version was rewritten using the same pattern that lowered the Russian HH detector scores:

- `Summary` was rewritten as a first-person career trajectory instead of a balanced executive profile.
- `Core Skills` was rewritten as "what I usually take ownership of" instead of a generic skill list.
- `Technical Stack` was changed from a dense taxonomy into project-context paragraphs while keeping ATS keywords.
- `NeedleBit` intro and several bullets were made more specific to real client situations.
- `Directorate` intro and access/support bullets now show institutional and adoption context.
- `ZIL` intro and department-reorganization bullet now include the operational messiness behind the role.

## Confirmed Retest Results

AI Text Detector retest was attempted through the same public `aitd_detect` endpoint used earlier.

After the first tuned pass, the endpoint became available again for most sections. `Core Skills` was still high, so it was rewritten again and retested with the other high-signal blocks.

Confirmed final scores:

| Block | Before | After | Status |
|---|---:|---:|---|
| Summary | 45% / Likely Human | 25% / Human Written | confirmed |
| Core Skills | 75% / Likely AI | 35% / Human Written | confirmed |
| Technical Stack | blocked / no AI Text score | 25% / Human Written | confirmed |
| Professional Experience | not scored as one full block before | 25% / Human Written | confirmed |
| Header | 10% / Human Written | 10% / Human Written | confirmed |
| Education | 25% / Human Written | 25% / Human Written | unchanged / confirmed in rerun |
| Professional Development | 25% / Human Written | 25% / Human Written | unchanged / confirmed in rerun |
| Languages | 10% / Human Written | 10% / Human Written | unchanged / confirmed in rerun |
| Additional Experience | 25% / Human Written in old run | not rerun in final pass | skipped to avoid another 429 |

The first retest attempt after tuning returned `429 Too Many Requests` for all checked sections. A later rerun succeeded for most blocks, and a targeted final rerun confirmed the main tuned sections.

## Interpretation

The English text is now structurally closer to the tuned Russian HH version, where the same approach reduced high-risk blocks:

- profile / summary-like block: 75% -> 25%;
- competencies: 75% -> 25%;
- technical stack: 85% -> 25%;
- languages: 95% -> 10%.

For English, the improvement is now detector-confirmed for the main high-risk AI Text Detector blocks. AIDetego has not been rerun in this pass, so its earlier high scores should not be treated as resolved until that browser-local detector is checked again.
