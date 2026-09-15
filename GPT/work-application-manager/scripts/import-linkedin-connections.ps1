[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SourcePath,

    [string]$OutputDirectory,

    [ValidatePattern('^\d{4}-\d{2}-\d{2}$')]
    [string]$ExportedOn,

    [ValidateRange(100, 2000)]
    [int]$BatchSize = 800,

    [string]$SpreadsheetId,

    [string]$AccessToken = $env:GOOGLE_SHEETS_ACCESS_TOKEN,

    [string]$SheetName = 'LinkedIn Connections'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Resolve-ConnectionsCsv {
    param([string]$Path)

    $resolved = Resolve-Path -LiteralPath $Path
    $item = Get-Item -LiteralPath $resolved

    if ($item.PSIsContainer) {
        $candidate = Join-Path $item.FullName 'Connections.csv'
        if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
            throw "Connections.csv was not found in $($item.FullName)"
        }
        return [pscustomobject]@{ CsvPath = $candidate; TemporaryDirectory = $null }
    }

    if ($item.Extension -ieq '.csv') {
        return [pscustomobject]@{ CsvPath = $item.FullName; TemporaryDirectory = $null }
    }

    if ($item.Extension -ine '.zip') {
        throw 'SourcePath must be Connections.csv, an extracted export directory, or a LinkedIn ZIP export.'
    }

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $temporaryDirectory = Join-Path ([IO.Path]::GetTempPath()) ("linkedin-connections-" + [guid]::NewGuid().ToString('N'))
    [IO.Directory]::CreateDirectory($temporaryDirectory) | Out-Null
    $archive = [IO.Compression.ZipFile]::OpenRead($item.FullName)
    try {
        $entry = $archive.Entries | Where-Object { $_.Name -ieq 'Connections.csv' } | Select-Object -First 1
        if ($null -eq $entry) {
            throw 'Connections.csv was not found in the ZIP export.'
        }
        $candidate = Join-Path $temporaryDirectory 'Connections.csv'
        [IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $candidate, $true)
    }
    finally {
        $archive.Dispose()
    }
    return [pscustomobject]@{ CsvPath = $candidate; TemporaryDirectory = $temporaryDirectory }
}

function Get-ExportDate {
    param([string]$OriginalPath, [string]$CsvPath, [string]$ExplicitDate)

    if ($ExplicitDate) { return $ExplicitDate }
    if ($OriginalPath -match 'Basic_LinkedInDataExport_(\d{2})-(\d{2})-(\d{4})') {
        return ('{0}-{1}-{2}' -f $Matches[3], $Matches[1], $Matches[2])
    }
    return (Get-Item -LiteralPath $CsvPath).LastWriteTime.ToString('yyyy-MM-dd')
}

function ConvertTo-CompanyKey {
    param([AllowEmptyString()][string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) { return '' }
    $source = $Value.ToLowerInvariant().Replace('&', ' and ').Normalize([Text.NormalizationForm]::FormD)
    $builder = [Text.StringBuilder]::new()
    foreach ($character in $source.ToCharArray()) {
        $category = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($character)
        if ($category -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$builder.Append($character)
        }
    }
    $clean = [regex]::Replace($builder.ToString(), '[^\p{L}\p{Nd}]+', ' ').Trim()
    if (-not $clean) { return '' }
    $tokens = [Collections.Generic.List[string]]::new()
    foreach ($token in ($clean -split '\s+')) { $tokens.Add($token) }
    $legalSuffixes = @('doo', 'llc', 'ltd', 'limited', 'inc', 'incorporated', 'corp', 'corporation', 'company', 'co', 'plc', 'gmbh', 'ag')
    while ($tokens.Count -gt 1 -and $legalSuffixes -contains $tokens[$tokens.Count - 1]) {
        $tokens.RemoveAt($tokens.Count - 1)
    }
    return ($tokens -join '')
}

function Get-ContactType {
    param([AllowEmptyString()][string]$Position)

    if ($Position -match '(?i)(recruit|talent\s+acquisition|talent\s+partner|(^|[\s/,&-])sourc(er|ing)([\s/,&-]|$)|people\s+partner|human\s+resources|(^|[\s/,&-])hr([\s/,&-]|$)|\u0440\u0435\u043a\u0440\u0443\u0442|\u043f\u043e\u0434\u0431\u043e\u0440|\u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b)') {
        return 'Recruiting/HR'
    }
    if ($Position -match '(?i)(chief|head|director|vice\s+president|(^|[\s/,&-])vp([\s/,&-]|$)|manager|lead|cto|cio|ceo|founder|owner|\u0440\u0443\u043a\u043e\u0432\u043e\u0434|\u0434\u0438\u0440\u0435\u043a\u0442\u043e\u0440|\u043d\u0430\u0447\u0430\u043b\u044c\u043d\u0438\u043a|\u043e\u0441\u043d\u043e\u0432\u0430\u0442\u0435\u043b\u044c)') {
        return 'Leadership'
    }
    return 'Employee'
}

function ConvertTo-IsoDate {
    param([AllowEmptyString()][string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) { return '' }
    $culture = [Globalization.CultureInfo]::GetCultureInfo('en-US')
    foreach ($format in @('dd MMM yyyy', 'd MMM yyyy', 'yyyy-MM-dd')) {
        try {
            $parsed = [datetime]::ParseExact($Value.Trim(), $format, $culture, [Globalization.DateTimeStyles]::None)
            return $parsed.ToString('yyyy-MM-dd')
        }
        catch [FormatException] {
            continue
        }
    }
    throw "Unrecognized Connected On date: $Value"
}

function Get-JsonSha256 {
    param([string]$Json)

    $bytes = [Text.Encoding]::UTF8.GetBytes($Json)
    $sha = [Security.Cryptography.SHA256]::Create()
    try {
        $hash = $sha.ComputeHash($bytes)
    }
    finally {
        $sha.Dispose()
    }
    return (($hash | ForEach-Object { $_.ToString('x2') }) -join '')
}

function Invoke-SheetsRequest {
    param(
        [ValidateSet('Get', 'Post', 'Put')][string]$Method,
        [string]$Uri,
        [object]$Body,
        [string]$Token
    )

    $parameters = @{
        Method = $Method
        Uri = $Uri
        Headers = @{ Authorization = "Bearer $Token" }
        ContentType = 'application/json; charset=utf-8'
    }
    if ($null -ne $Body) {
        $parameters.Body = $Body | ConvertTo-Json -Depth 20 -Compress
    }
    return Invoke-RestMethod @parameters
}

$resolvedSource = Resolve-ConnectionsCsv -Path $SourcePath
try {
    $csvPath = $resolvedSource.CsvPath
    $exportDate = Get-ExportDate -OriginalPath $SourcePath -CsvPath $csvPath -ExplicitDate $ExportedOn
    $sourceLines = Get-Content -LiteralPath $csvPath -Encoding UTF8
    $headerIndex = -1
    for ($index = 0; $index -lt $sourceLines.Count; $index++) {
        if ($sourceLines[$index] -eq 'First Name,Last Name,URL,Email Address,Company,Position,Connected On') {
            $headerIndex = $index
            break
        }
    }
    if ($headerIndex -lt 0) { throw 'The expected LinkedIn Connections.csv header was not found.' }

    $sourceRows = @($sourceLines[$headerIndex..($sourceLines.Count - 1)] | ConvertFrom-Csv)
    $headers = @('First Name', 'Last Name', 'LinkedIn URL', 'Email Address', 'Company', 'Position', 'Connected On', 'Company Key', 'Contact Type', 'Exported On')
    $values = [Collections.Generic.List[object]]::new()
    $values.Add([object[]]$headers)

    $preparedRows = [Collections.Generic.List[object]]::new()
    foreach ($row in $sourceRows) {
        $prepared = [pscustomobject][ordered]@{
            'First Name' = [string]$row.'First Name'
            'Last Name' = [string]$row.'Last Name'
            'LinkedIn URL' = [string]$row.URL
            'Email Address' = [string]$row.'Email Address'
            'Company' = [string]$row.Company
            'Position' = [string]$row.Position
            'Connected On' = ConvertTo-IsoDate ([string]$row.'Connected On')
            'Company Key' = ConvertTo-CompanyKey ([string]$row.Company)
            'Contact Type' = Get-ContactType ([string]$row.Position)
            'Exported On' = $exportDate
        }
        $preparedRows.Add($prepared)
        $values.Add([object[]]@($prepared.'First Name', $prepared.'Last Name', $prepared.'LinkedIn URL', $prepared.'Email Address', $prepared.Company, $prepared.Position, $prepared.'Connected On', $prepared.'Company Key', $prepared.'Contact Type', $prepared.'Exported On'))
    }

    if (-not $OutputDirectory) {
        $originalItem = Get-Item -LiteralPath (Resolve-Path -LiteralPath $SourcePath)
        $outputParent = if ($originalItem.PSIsContainer) { $originalItem.FullName } else { Split-Path -Parent $originalItem.FullName }
        $OutputDirectory = Join-Path $outputParent 'linkedin-connections-prepared'
    }
    [IO.Directory]::CreateDirectory($OutputDirectory) | Out-Null
    $batchDirectory = Join-Path $OutputDirectory 'batches'
    [IO.Directory]::CreateDirectory($batchDirectory) | Out-Null

    $preparedCsv = Join-Path $OutputDirectory 'LinkedInConnections.prepared.csv'
    $preparedRows | Export-Csv -LiteralPath $preparedCsv -NoTypeInformation -Encoding utf8

    $batchManifest = [Collections.Generic.List[object]]::new()
    for ($offset = 0; $offset -lt $values.Count; $offset += $BatchSize) {
        $count = [Math]::Min($BatchSize, $values.Count - $offset)
        $batchValues = @($values.GetRange($offset, $count))
        $startRow = $offset + 1
        $endRow = $startRow + $count - 1
        $payload = [ordered]@{
            range = "'$SheetName'!A${startRow}:J${endRow}"
            majorDimension = 'ROWS'
            values = $batchValues
        }
        $json = $payload | ConvertTo-Json -Depth 8 -Compress
        $batchName = 'batch-{0:D4}.json' -f (($offset / $BatchSize) + 1)
        $batchPath = Join-Path $batchDirectory $batchName
        [IO.File]::WriteAllText($batchPath, $json + "`n", [Text.UTF8Encoding]::new($false))
        $batchManifest.Add([ordered]@{ file = "batches/$batchName"; range = $payload.range; rows = $count; sha256 = Get-JsonSha256 $json })
    }

    $sourceHash = (Get-FileHash -LiteralPath $csvPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $preparedHash = (Get-FileHash -LiteralPath $preparedCsv -Algorithm SHA256).Hash.ToLowerInvariant()
    $manifest = [ordered]@{
        schemaVersion = 1
        sheetName = $SheetName
        hidden = $true
        columns = $headers
        sourceFile = [IO.Path]::GetFileName($csvPath)
        sourceSha256 = $sourceHash
        exportedOn = $exportDate
        sourceRows = $sourceRows.Count
        sheetRowsIncludingHeader = $values.Count
        companiesPresent = @($preparedRows | Where-Object { $_.Company }).Count
        companyKeysPresent = @($preparedRows | Where-Object { $_.'Company Key' }).Count
        emailsPresent = @($preparedRows | Where-Object { $_.'Email Address' }).Count
        recruitingHrContacts = @($preparedRows | Where-Object { $_.'Contact Type' -eq 'Recruiting/HR' }).Count
        preparedCsv = [IO.Path]::GetFileName($preparedCsv)
        preparedSha256 = $preparedHash
        batchSize = $BatchSize
        batches = $batchManifest
    }
    $manifestPath = Join-Path $OutputDirectory 'LinkedInConnections.manifest.json'
    [IO.File]::WriteAllText($manifestPath, (($manifest | ConvertTo-Json -Depth 8) + "`n"), [Text.UTF8Encoding]::new($false))

    if ($SpreadsheetId) {
        if (-not $AccessToken) {
            throw 'SpreadsheetId was supplied but no AccessToken or GOOGLE_SHEETS_ACCESS_TOKEN is available.'
        }
        $escapedId = [Uri]::EscapeDataString($SpreadsheetId)
        $metadataUri = "https://sheets.googleapis.com/v4/spreadsheets/${escapedId}?fields=sheets.properties"
        $metadata = Invoke-SheetsRequest -Method Get -Uri $metadataUri -Body $null -Token $AccessToken
        $sheet = $metadata.sheets | Where-Object { $_.properties.title -eq $SheetName } | Select-Object -First 1
        $batchUpdateUri = "https://sheets.googleapis.com/v4/spreadsheets/${escapedId}:batchUpdate"
        if ($null -eq $sheet) {
            $created = Invoke-SheetsRequest -Method Post -Uri $batchUpdateUri -Token $AccessToken -Body @{ requests = @(@{ addSheet = @{ properties = @{ title = $SheetName; hidden = $true; gridProperties = @{ rowCount = [Math]::Max(100, $values.Count + 50); columnCount = 10; frozenRowCount = 1 } } } }) }
            $sheetId = $created.replies[0].addSheet.properties.sheetId
        }
        else {
            $sheetId = $sheet.properties.sheetId
        }

        $encodedWholeRange = [Uri]::EscapeDataString("'$SheetName'!A:J")
        Invoke-SheetsRequest -Method Post -Uri "https://sheets.googleapis.com/v4/spreadsheets/${escapedId}/values/${encodedWholeRange}:clear" -Body @{} -Token $AccessToken | Out-Null
        foreach ($batch in $batchManifest) {
            $batchPayload = Get-Content -Raw -LiteralPath (Join-Path $OutputDirectory $batch.file) | ConvertFrom-Json
            $encodedRange = [Uri]::EscapeDataString($batchPayload.range)
            Invoke-SheetsRequest -Method Put -Uri "https://sheets.googleapis.com/v4/spreadsheets/${escapedId}/values/${encodedRange}?valueInputOption=RAW" -Body $batchPayload -Token $AccessToken | Out-Null
        }

        $formatRequests = @(
            @{ updateSheetProperties = @{ properties = @{ sheetId = $sheetId; hidden = $true; gridProperties = @{ rowCount = [Math]::Max(100, $values.Count + 50); columnCount = 10; frozenRowCount = 1 } }; fields = 'hidden,gridProperties(rowCount,columnCount,frozenRowCount)' } },
            @{ repeatCell = @{ range = @{ sheetId = $sheetId; startRowIndex = 0; endRowIndex = 1; startColumnIndex = 0; endColumnIndex = 10 }; cell = @{ userEnteredFormat = @{ backgroundColor = @{ red = 0.92; green = 0.92; blue = 0.92 }; textFormat = @{ bold = $true }; verticalAlignment = 'MIDDLE'; wrapStrategy = 'CLIP' } }; fields = 'userEnteredFormat(backgroundColor,textFormat.bold,verticalAlignment,wrapStrategy)' } },
            @{ setBasicFilter = @{ filter = @{ range = @{ sheetId = $sheetId; startRowIndex = 0; endRowIndex = $values.Count; startColumnIndex = 0; endColumnIndex = 10 } } } }
        )
        Invoke-SheetsRequest -Method Post -Uri $batchUpdateUri -Body @{ requests = $formatRequests } -Token $AccessToken | Out-Null
        $manifest.uploadedSpreadsheetId = $SpreadsheetId
        $manifest.uploadedAt = [datetime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
        [IO.File]::WriteAllText($manifestPath, (($manifest | ConvertTo-Json -Depth 8) + "`n"), [Text.UTF8Encoding]::new($false))
    }

    [pscustomobject]@{
        SourceRows = $sourceRows.Count
        ExportedOn = $exportDate
        PreparedCsv = $preparedCsv
        Manifest = $manifestPath
        BatchCount = $batchManifest.Count
        Uploaded = [bool]$SpreadsheetId
    }
}
finally {
    if ($resolvedSource.TemporaryDirectory -and (Test-Path -LiteralPath $resolvedSource.TemporaryDirectory)) {
        Remove-Item -LiteralPath $resolvedSource.TemporaryDirectory -Recurse -Force
    }
}
