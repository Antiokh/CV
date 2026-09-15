# LinkedIn connections import

Use the bundled script instead of asking the model to parse or normalize `Connections.csv`.

## Command

Prepare only:

```powershell
powershell -ExecutionPolicy Bypass -File GPT/work-application-manager/scripts/import-linkedin-connections.ps1 `
  -SourcePath '<Connections.csv, extracted export directory, or ZIP>' `
  -OutputDirectory '<private temporary output directory>'
```

The script recognizes the LinkedIn preamble, preserves every source field, infers `Exported On` from `Basic_LinkedInDataExport_MM-DD-YYYY` when possible, normalizes dates and companies deterministically, classifies contact type, and writes:

- `LinkedInConnections.prepared.csv`
- `LinkedInConnections.manifest.json`
- `batches/batch-NNNN.json`

Read the small manifest for validation; do not load the full CSV into model context.

Direct Google Sheets upload is preferred when a scoped OAuth token is already available:

```powershell
$env:GOOGLE_SHEETS_ACCESS_TOKEN = '<temporary OAuth token>'
powershell -ExecutionPolicy Bypass -File GPT/work-application-manager/scripts/import-linkedin-connections.ps1 `
  -SourcePath '<export>' `
  -OutputDirectory '<private temporary output directory>' `
  -SpreadsheetId '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao'
```

Never print, persist, or commit the token. If direct API authorization is unavailable, prepare the files and send the generated batch payloads through the connected Google Sheets tool without re-deriving their values.

## Canonical sheet

- Spreadsheet: `WorkInterviews`
- Spreadsheet ID: `1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`
- Hidden tab: `LinkedIn Connections`
- Columns A:J: `First Name`, `Last Name`, `LinkedIn URL`, `Email Address`, `Company`, `Position`, `Connected On`, `Company Key`, `Contact Type`, `Exported On`
- Header frozen; basic filter enabled; data written as raw values.

Replace the full snapshot rather than appending. Preserve the tab's hidden state. Clear stale surplus rows from the previous export.

## Validation

Confirm from the manifest and Sheet readback:

1. `sourceRows + 1 = sheetRowsIncludingHeader`.
2. Sheet A1:J1 exactly matches `columns`.
3. The last prepared row exists at `sourceRows + 1`.
4. `sourceSha256` and `preparedSha256` are present.
5. `companiesPresent`, `companyKeysPresent`, email count, and Recruiting/HR count are plausible.
6. Representative exact company keys return the expected rows; reject substring-only false positives.
7. Both `LinkedIn Connections` and `Agent Instructions` remain hidden.

The export and generated outputs contain personal data. Keep them outside the repository. Hidden Sheets tabs are not an access-control boundary.
