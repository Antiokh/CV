# Russian HH Master Resume AI Detector Tuning Report

Date: 2026-06-02

Tuned file:

- `details/master_resume_hh_ru.md`

Preserved tuned version:

- `details/versions/master_resume_hh_ru_2026-06-02_ai_detector_tuned.md`

Related previous files:

- `details/master_resume_hh_ru_ai_detector_report_2026-06-02.md`
- `details/master_resume_hh_ru_ai_detector_results_2026-06-02.json`
- `details/master_resume_hh_ru_ai_detector_results_2026-06-02_tuned.json`

## What Changed

The first Russian HH master resume had three high-risk detector blocks:

- `Профессиональный профиль`: 75% / Likely AI
- `Ключевые компетенции`: 75% / Likely AI
- `Технический стек`: 85% / AI Generated

There was also a false-positive-looking result:

- `Языки`: 95% / AI Generated, despite being only a short factual language list

The tuned version keeps the same facts, but changes the form:

- summary rewritten from polished role-description style into a first-person career trajectory;
- competencies rewritten from a symmetrical capability list into a "what I usually take on" block;
- technical stack rewritten from a dense taxonomy into project-context paragraphs;
- languages changed from a three-line list into a short practical-language-use sentence.

## Confirmed Retest Results

AI Text Detector retests were run through the public `aitd_detect` endpoint.

| Block | Before | After | Status |
|---|---:|---:|---|
| Профессиональный профиль | 75% / Likely AI | 25% / Human Written | confirmed |
| Ключевые компетенции | 75% / Likely AI | 25% / Human Written | confirmed |
| Технический стек | 85% / AI Generated | 25% / Human Written | confirmed in isolated block test |
| Языки | 95% / AI Generated | 10% / Human Written | confirmed in isolated block test |

## Full-Retest Limit

A full rerun was attempted after the edits. The service accepted the first blocks, then started returning:

- `429 Too Many Requests`

Because of that, `details/master_resume_hh_ru_ai_detector_results_2026-06-02_tuned.json` contains a partial full-pass result rather than a complete full-document retest.

## Interpretation

The measurable high-risk blocks were reduced without removing core ATS keywords. The biggest practical improvement is:

- top-of-resume detector risk is much lower;
- the technical stack still contains search-relevant keywords, but no longer looks like a perfectly symmetrical generated taxonomy;
- the previous `Языки` result was almost certainly a detector artifact caused by a very short structured list.

Remaining caution:

- AI detectors are inconsistent and can change results between runs.
- Dense technology lists are inherently risky for detectors because they look structured and predictable.
- For final HH submission, the tuned version is preferable to the first Russian HH version.
