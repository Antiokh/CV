# LinkedIn Recruiter Outreach Helper

This workflow is intentionally safe:

- no LinkedIn scraping;
- no automated DM sending;
- no bypassing login, browser restrictions, or LinkedIn limits.

It uses the official LinkedIn Connections CSV export, stores likely HR/recruiter/talent contacts in SQLite, prepares message drafts, and opens profiles for manual sending.

## Get the CSV

In LinkedIn:

1. Settings & Privacy
2. Data privacy
3. Get a copy of your data
4. Select `Connections`
5. Download the CSV when LinkedIn prepares it

## Commands

Initialize database:

```powershell
python workflows\linkedin_recruiter_outreach.py init
```

Import connections:

```powershell
python workflows\linkedin_recruiter_outreach.py import-csv "C:\path\Connections.csv"
```

List queued contacts:

```powershell
python workflows\linkedin_recruiter_outreach.py list --status queued --limit 25
```

Regenerate unsent drafts after changing the default message rules:

```powershell
python workflows\linkedin_recruiter_outreach.py refresh-drafts
```

Open next profile and copy draft message:

```powershell
python workflows\linkedin_recruiter_outreach.py open-next --copy
```

Run a local helper server for the LinkedIn userscript:

```powershell
python workflows\linkedin_recruiter_outreach.py serve
```

Install the userscript:

```text
workflows/sctipts/linkedin_recruiter_next.user.js
```

Usage inside LinkedIn:

1. Start the local server with `serve`.
2. Open LinkedIn.
3. Click `Next` in the bottom-right panel.
4. The script opens the next queued profile and copies the message draft.
5. Open the LinkedIn message box manually, paste, review, and send manually.
6. Click `Mark sent` or `Sent + Next`.

The userscript does not click LinkedIn's Send button and does not send messages automatically.

## Alternative: Local List Page Without LinkedIn API Calls

If the `Next` userscript cannot reach the local API from LinkedIn, use the list-page workflow.

Start the local page:

```powershell
python workflows\linkedin_recruiter_outreach.py serve-list
```

Open:

```text
http://127.0.0.1:8766
```

Install this separate userscript:

```text
workflows/sctipts/linkedin_recruiter_opened_draft.user.js
```

Usage:

1. Open the local list page.
2. Click `Copy draft + open LinkedIn`.
3. The local page copies the draft from the contact card, marks that contact as `opened` in SQLite, and opens the LinkedIn profile.
4. The separate userscript runs on LinkedIn profile pages and opens the `Message` dialog when it sees LinkedIn's send-privately icon.
5. Click LinkedIn `Message` manually, paste, review, and send.
6. Return to the local list page and click `Mark sent`.

This mode does not make any HTTP requests from LinkedIn back to the local server. The draft is copied on the local list page before LinkedIn opens.

## If LinkedIn Export Has No Positions

LinkedIn's official archive may omit current positions from the Connections CSV. In that case, use this people-search page helper:

```text
workflows/sctipts/linkedin_people_search_export.user.js
```

Open your first-degree people search:

```text
https://www.linkedin.com/search/results/people/?origin=MEMBER_PROFILE_CANNED_SEARCH&network=%5B%22F%22%5D
```

The userscript adds `Export visible people`.

Use it like this:

1. Wait until the current results page is loaded.
2. Click `Export visible people`.
3. It copies CSV to clipboard and downloads a CSV for the visible page.
4. Manually click LinkedIn's `Next`.
5. Repeat.

This helper intentionally does not auto-click `Next` and does not scrape through pages automatically.

Run a terminal-only manual campaign:

```powershell
python workflows\linkedin_recruiter_outreach.py manual-campaign --copy --min-delay 0 --max-delay 0 --limit 20
```

This mode does not send messages automatically. It opens each profile, copies the draft, waits for manual sending, records the status after confirmation, and only then waits before the next profile.

After sending manually in LinkedIn:

```powershell
python workflows\linkedin_recruiter_outreach.py mark 123 sent --notes "Sent manually in LinkedIn"
```

Export queue:

```powershell
python workflows\linkedin_recruiter_outreach.py export data\linkedin_recruiter_queue.csv
```

## Database

Default DB:

```text
data/linkedin_recruiter_outreach.sqlite
```

Tables:

- `contacts`
- `outreach`

## Custom Message Template

Create a UTF-8 text file and pass it with `--template`.

Without a custom template, the helper chooses the default message language by name:

- Cyrillic name without Serbian `ћ` / `Ћ`: Russian draft.
- Name with Serbian `ћ` / `Ћ`: English draft.
- All other names: English draft.

Available placeholders:

- `{first_name}`
- `{full_name}`
- `{company}`
- `{position}`

Example:

```text
Hi {first_name},

I’m checking whether you might have roles where my background could be relevant...
```

## Filtering

The script marks a contact as recruiting-related when position/company contains terms like:

- recruiter
- recruiting
- talent
- talent acquisition
- sourcer
- HR
- human resources
- people operations
- staffing
- headhunter

The filter is deterministic and does not use AI.
