# Infostud / HelloWorld Profile Automation Guide

Updated: 2026-06-07

This guide is for future agent work on `https://profil.infostud.com/moj-nalog/profil`, including the HelloWorld.rs / Infostud candidate profile. Treat it as a practical MCP-level runbook: browser access, GraphQL schema fragments, update patterns, known pitfalls, and verification steps.

## Scope

Use this workflow when editing the candidate profile on Infostud / HelloWorld:

- basic profile visibility and profile fields
- work experience descriptions
- computer skills, levels, and years
- additional education / courses
- links, education, languages, licenses, and related profile sections

Prefer direct GraphQL updates through the authenticated browser session over fragile DOM automation. The site is a Next.js / React app using Apollo-style GraphQL calls. UI buttons and Radix/Ant dialogs can be unreliable through CDP click automation, while GraphQL updates are stable if the auth token is fresh.

## Browser Access

The active browser is usually exposed through Chrome DevTools Protocol:

```text
http://127.0.0.1:9222
```

Find the Infostud tab:

```js
const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port: 9222, path }, response => {
        let data = '';
        response.on('data', chunk => (data += chunk));
        response.on('end', () => resolve(JSON.parse(data)));
      })
      .on('error', reject);
  });
}

(async () => {
  const tabs = await get('/json');
  console.log(
    tabs
      .filter(tab => tab.url.includes('profil.infostud.com'))
      .map(tab => ({ id: tab.id, title: tab.title, url: tab.url, ws: tab.webSocketDebuggerUrl }))
  );
})();
```

Minimal CDP helper:

```js
const WebSocket = require('ws');

function send(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1e9);
    const onMessage = message => {
      const payload = JSON.parse(message);
      if (payload.id === id) {
        ws.off('message', onMessage);
        payload.error ? reject(Error(JSON.stringify(payload.error))) : resolve(payload.result);
      }
    };
    ws.on('message', onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
```

## Authentication Refresh

GraphQL can return:

```json
{
  "title": "The access token has been expired, needs to be refreshed.",
  "status": 401,
  "type": "token_expired"
}
```

Before direct GraphQL writes, refresh the token from inside the page context:

```js
const form = new FormData();
form.append('client_name', (document.cookie.match(/(?:^|; )client_name=([^;]+)/) || [])[1] || 'helloworld');

await fetch('https://api.profil.infostud.com/api/auth/refresh-token', {
  method: 'POST',
  credentials: 'include',
  body: form
});
```

If refresh fails or returns a login page, reload the profile tab and let the app refresh:

```js
await send(ws, 'Page.reload', { ignoreCache: true });
```

Then wait several seconds and retry.

## GraphQL Endpoint

Use:

```text
https://graphql.profil.infostud.com/graphql
```

Always call from the page context with:

```js
fetch('https://graphql.profil.infostud.com/graphql', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ operationName, variables, query })
});
```

Do not call this endpoint from a separate unauthenticated process unless you also reproduce the browser cookies and token handling.

## Core Profile Fields

Use this field fragment for read/update work. It matches the app's `ProfileFields` fragment and avoids missing required fields:

```graphql
id
oauthId
firstName
lastName
phoneNumber
birthday
countryId
cityId
address
profilePicturePath
occupation
shortDescription
managerialPositionExperienceId
workExperiences {
  id
  employmentStatus
  standardizedPositionId
  categoryId
  companyId
  companyName
  employmentTypeId
  employmentFromDate
  employmentToDate
  industryId
  positionTitle
  description
}
skills {
  id
  skillId
  skillTitle
  ranking
}
links {
  id
  url
  title
  description
  ranking
}
languages {
  id
  languageId
  languageProficiencyLevelId
  ranking
}
education {
  id
  stillStudying
  educationLevelId
  educationalInstitutionId
  educationalInstitutionName
  educationCategoryId
  graduationYear
  acquiredTitle
  additionalInfo
}
driversLicenses {
  id
  licenseTypeId
  ranking
}
licenses {
  id
  licenseId
  filePath
  ranking
}
additionalEducation {
  id
  additionalEducationId
  additionalEducationFieldId
  title
  filePath
  acquisitionDate
  description
  ranking
}
computerSkills {
  id
  computerSkillId
  computerSkillTitle
  experienceId
  proficiencyLevelId
  ranking
}
hasNoWorkExperience
hasNoComputerSkills
hasNoAdditionalEducation
hasNoLicense
hasNoLinks
hasNoDriversLicense
hasFinishedOnboarding
version
isVisible
onboardedOnSite
creationMethod
```

Read:

```graphql
query GetProfile {
  profile {
    ...fields above...
    completeness {
      total
      workExperience
      computerSkill
      additionalEducation
    }
  }
}
```

Update:

```graphql
mutation UpdateProfile($profile: ProfileInput) {
  UpdateProfile(profile: $profile) {
    ...fields above...
    completeness {
      total
      workExperience
      computerSkill
      additionalEducation
    }
  }
}
```

Important: do not send `completeness`, `applicationValidation`, `activeUserProfileApplicationsCount`, `updateSource`, or `__typename` inside `ProfileInput`. The server rejects fields not defined by `ProfileInput`.

Safe update pattern:

```js
const profile = { ...readResult.data.profile };
delete profile.completeness;
delete profile.applicationValidation;
delete profile.activeUserProfileApplicationsCount;
delete profile.updateSource;

// edit profile.workExperiences / profile.computerSkills / etc.

await post({
  operationName: 'UpdateProfile',
  variables: { profile },
  query: updateProfileMutation
});
```

## Lists / Dictionaries

Useful list query:

```graphql
query Lists {
  lists {
    computerSkills {
      id
      srName
      enName
      isIt
    }
    skillLevels {
      id
      srName
      enName
    }
    positionExperiences {
      id
      srName
      enName
    }
    additionalEducationFields {
      id
      srName
      enName
      hasLicense
    }
    additionalEducations {
      id
      additionalEducationFieldId
      srName
      enName
    }
    companies {
      id
      companyId
      companyName
    }
    jobCategories {
      id
      name
      englishName
    }
    employmentTypes {
      id
      srName
      enName
    }
    industries {
      id
      srName
      enName
    }
    standardizedPositions {
      id
      name
      category
    }
  }
}
```

Known `positionExperiences` values:

| id | Serbian label | Meaning |
| --- | --- | --- |
| 1 | bez radnog iskustva | no working experience |
| 2 | manje od jedne godine | less than 1 year |
| 3 | 1 godina | 1 year |
| 4 | 2 godine | 2 years |
| 5 | 3 godine | 3 years |
| 6 | 4 godine | 4 years |
| 7 | 5 godina | 5 years |
| 8 | 6 godina | 6 years |
| 9 | 7 godina | 7 years |
| 10 | 8 godina | 8 years |
| 11 | 9 godina | 9 years |
| 12 | 10 godina | 10 years |
| 13 | više od 10 godina | more than 10 years |

Known `skillLevels` values:

| id | Serbian label | Meaning |
| --- | --- | --- |
| 1 | Osnovni | Beginner |
| 2 | Srednji | Intermediate |
| 3 | Napredni | Advanced |

## Work Experience Descriptions

The profile stores rich text as HTML strings. Use compact lists:

```html
<ul><li>First point.</li><li>Second point.</li></ul>
```

This preserves line breaks and avoids the site flattening pasted text. Do not use literal separators such as `#$`.

Infostud UI appears to limit some description fields to 1000 characters. Keep both visible text and HTML under 1000 characters for safety:

```js
const visibleLength = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().length;
const htmlLength = html.length;
```

When editing work experience:

- preserve existing `id`, dates, company, category, industry, employment type, and standardized position
- change only `description` unless the user asked for more
- set `hasNoWorkExperience: false`
- verify `completeness.workExperience` after saving

## Computer Skills

Computer skill object:

```js
{
  id: existingIdOrNull,
  computerSkillId: dictionaryIdOrNull,
  computerSkillTitle: customTitleOrNull,
  experienceId: positionExperienceId,
  proficiencyLevelId: skillLevelId,
  ranking: null
}
```

Rules:

- If a dictionary skill exists, use `computerSkillId` and `computerSkillTitle: null`.
- If it does not exist, use `computerSkillId: null` and `computerSkillTitle`.
- Always set `experienceId` and `proficiencyLevelId`; otherwise the UI can show incomplete required fields.
- Avoid fuzzy dictionary matches that change meaning. Example: `Canva` can accidentally match dictionary item `Canvas`; add `Canva` as a custom skill instead.
- Normalize names carefully when checking duplicates, but do not rely on approximate matching for final writes.

After saving, verify:

```js
profile.computerSkills.filter(skill => skill.experienceId == null).length === 0
profile.computerSkills.filter(skill => skill.proficiencyLevelId == null).length === 0
```

## Additional Education / Dodatna Usavršavanja

Additional education object:

```js
{
  id: existingIdOrNull,
  additionalEducationId: dictionaryIdOrNull,
  additionalEducationFieldId: fieldId,
  title: title,
  filePath: null,
  acquisitionDate: 'YYYY-01-01',
  description: '<ul><li>Short description.</li></ul>',
  ranking: numberOrNull
}
```

Important lesson from the current profile: do not combine several courses into one title. Use one course per row, as in resume sources.

Current source-backed rows used on 2026-06-07:

| Title | Field id | Date |
| --- | --- | --- |
| Domodedovo - obuka za Lotus Notes programere | 1 | 2008-01-01 |
| KudaGo Lectures - event management i promocija | 10 | 2016-01-01 |
| Ekaterina Pavlova Concert Agency - event management, promocija i SMM | 10 | 2016-01-01 |
| Andrey Zakharyan - How to become a rock star in your field | 10 | 2017-01-01 |
| KudaGo Lectures - menadžment u muzičkom biznisu | 7 | 2017-01-01 |
| Specialist Training Center - Java fundamentals | 1 | 2018-01-01 |
| Specialist Training Center - ITIL / DevOps service thinking | 1 | 2018-01-01 |
| Specialist Training Center - IT management | 13 | 2018-01-01 |
| SoloLearn - Java Tutorial | 1 | 2018-01-01 |
| SoloLearn - JavaScript Tutorial | 1 | 2018-01-01 |
| Igor Ryzov Academy - Tough negotiations | 13 | 2020-01-01 |
| Igor Ryzov Academy - Negotiation and working under pressure | 13 | 2020-01-01 |
| Igor Ryzov Academy - How to stay calm under pressure | 50 | 2021-01-01 |
| Zerocoder University - Zero-code / western-market product building | 1 | 2022-01-01 |
| PlanFix - implementation courses | 1 | 2022-01-01 |

The API returns additional education in reverse chronological display order. That is expected.

Serbian date reminder from the user: visible Serbian date format is like Russian/German with a trailing dot: `dd.mm.yyyy.`. GraphQL API uses ISO-like dates such as `2022-01-01`.

## Current Profile Values To Preserve

Known profile values as of 2026-06-07:

- `firstName`: Anton
- `lastName`: Nazarov
- `countryId`: 434
- `cityId`: 35
- `occupation`: `Tehnički direktor / Šef inženjeringa / Sistemski arhitekta`
- `isVisible`: true
- `managerialPositionExperienceId`: 6
- profile completeness: 100%

Do not overwrite unrelated fields when editing a section.

## Verification Checklist

After any write:

1. Read the profile again from GraphQL.
2. Confirm `errors` is absent.
3. Confirm `completeness.total` remains 100 unless the user knowingly changed required data.
4. Confirm the section-specific completeness remains valid:
   - `workExperience`
   - `computerSkill`
   - `additionalEducation`
5. Confirm no section item has missing required fields.
6. For rich text descriptions:
   - no `#$`
   - HTML uses `<ul><li>...`
   - visible text is under UI limits
7. Reload the page with `Page.reload` so the UI reflects saved server state.

Useful final verification shape:

```graphql
query Verify {
  profile {
    version
    completeness {
      total
      workExperience
      computerSkill
      additionalEducation
    }
    computerSkills {
      id
      experienceId
      proficiencyLevelId
    }
    additionalEducation {
      title
      additionalEducationFieldId
      acquisitionDate
    }
    workExperiences {
      companyName
      description
    }
  }
}
```

## UI Automation Notes

The profile page has edit controls like:

```js
document.querySelectorAll('a[aria-label="Izmeni"]')
```

Work item edit buttons can be found by closest timeline item:

```js
[...document.querySelectorAll('a[aria-label="Izmeni"]')]
  .find(anchor => anchor.closest('.ant-timeline-item')?.innerText.includes('NeedleBit'));
```

However, direct `element.click()`, CDP mouse click, and focus+Enter were unreliable for opening the edit dialog. Prefer GraphQL.

If UI automation is required, inspect the app hash/dialog state. The app uses hash-driven dialog state such as:

```text
#dialog=...
```

But GraphQL is still safer for bulk updates.

## Source Files In This Repository

Useful local profile sources:

- `details/linkedin/description.md`
- `details/master_resume_technology_checklist.md`
- `details/master_resume_greenhouse.md`
- `details/master_resume_hh_ru.md`
- `data/anton_nazarov_profile.json`
- `RESUME_RU_EN_SR.md`
- `portfolio/**/README.md`
- `details/job_board_registration_tracker.md`

Use `rg` first when searching:

```powershell
rg -n "Zerocoder|PlanFix|ITIL|Supabase|OpenAI|Office|Lotus|Domino" details data GPT portfolio -S
```

## Do Not

- Do not paste long plain text into rich text fields and hope line breaks survive.
- Do not send GraphQL `ProfileInput` with read-only fields such as `completeness`.
- Do not mark weak/touched technologies as advanced unless the source confirms real work.
- Do not fuzzy-match dictionary skills where a different skill has a similar name.
- Do not reset unrelated profile arrays when editing one section.
- Do not delete user changes or unrelated data unless explicitly requested.

