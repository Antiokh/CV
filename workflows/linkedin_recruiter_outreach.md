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

Open next profile and copy draft message:

```powershell
python workflows\linkedin_recruiter_outreach.py open-next --copy
```

Run a manual campaign with random 1-5 minute pauses:

```powershell
python workflows\linkedin_recruiter_outreach.py manual-campaign --copy --min-delay 60 --max-delay 300 --limit 20
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
