# English Greenhouse Master Resume AI Detector Tuning Report

Date: 2026-06-02

Tuned file:

- `details/master_resume_greenhouse.md`

Preserved tuned version:

- `details/versions/master_resume_greenhouse_2026-06-02_ai_detector_tuned.md`

Raw retest attempt:

- `details/master_resume_greenhouse_ai_detector_results_2026-06-02_tuned.json`

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

## Retest Status

AI Text Detector retest was attempted through the same public `aitd_detect` endpoint used earlier.

Result:

- every checked section returned `429 Too Many Requests`;
- no fresh usable AI score was captured for the tuned English version in this pass.

The raw JSON records the failed retest attempt block by block.

## Interpretation

The English text is now structurally closer to the tuned Russian HH version, where the same approach reduced high-risk blocks:

- profile / summary-like block: 75% -> 25%;
- competencies: 75% -> 25%;
- technical stack: 85% -> 25%;
- languages: 95% -> 10%.

For English, that improvement is stylistic and likely, but not yet detector-confirmed because the endpoint was rate-limited. A fresh detector run should be repeated later, preserving this tuned version and recording real scores instead of inferring them.
