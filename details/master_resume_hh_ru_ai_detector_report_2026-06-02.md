# Russian HH Master Resume AI Detector Report

Date: 2026-06-02

Checked file:

- `details/master_resume_hh_ru.md`

Raw detector result file:

- `details/master_resume_hh_ru_ai_detector_results_2026-06-02.json`

## Detector Sources and Limits

AI Text Detector:

- URL: https://aitextdetector.ai/
- Endpoint used: public WordPress AJAX action `aitd_detect`
- Result: usable scores captured for most sections; one section hit `429 Too Many Requests`.

AIDetego:

- URL: https://aidetego.com/
- Result: not rerun for the Russian HH version in this pass.
- Note: the public page says analysis runs locally in the browser, uses 16 modules, and includes Unicode/artifact scanning. This makes it useful, but less straightforward to call through a server-side API.

AiDetector.com:

- URL: https://aidetector.com/
- Result: not rerun for the Russian HH version in this pass.
- Previous pass did not capture a usable score because discovered backend routes returned `404`/`401`.

## AI Text Detector Scores by Block

Percent means AI-generated score as reported by the detector. These scores are screening signals, not proof.

| Block | Score | Label | Confidence | Notes |
|---|---:|---|---|---|
| Header | 10% | Human Written | High | Contact/header block is treated as human-written. |
| Профессиональный профиль | 75% | Likely AI | Medium | Formal, polished summary style is high-risk. |
| Ключевые компетенции | 75% | Likely AI | Medium | List-heavy competencies read as structured/generic. |
| Технический стек | 85% | AI Generated | High | Dense technology taxonomy is high-risk for detector, but useful for ATS. |
| Опыт работы | 25% | Human Written | High | Main experience block is read as human-written. |
| Образование | blocked | - | - | Request hit `429 Too Many Requests`. |
| Дополнительное обучение | 15% | Human Written | High | Low-risk. |
| Языки | 95% | AI Generated | High | False-positive-looking result on a very short list. |
| Дополнительный опыт | 25% | Human Written | High | Low-risk. |

## Interpretation

The Russian HH version is better than the English version in the largest and most important block: `Опыт работы` is scored as 25% / Human Written.

The highest-risk blocks are:

- `Технический стек`: 85%
- `Профессиональный профиль`: 75%
- `Ключевые компетенции`: 75%
- `Языки`: 95%, but this is likely a detector artifact because the block is only a short factual language list

Most of the risk comes from resume mechanics rather than hidden characters: dense lists, symmetrical bullet rhythm, formal wording, and high technology density. The technology stack should probably remain dense for HH/ATS matching, but the profile and competencies can be rewritten into a more uneven, human, less taxonomy-like style if we want a lower detector score.
