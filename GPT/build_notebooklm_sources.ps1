param(
    [string]$OutputDir = "_notebooklm_import"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $root $OutputDir

New-Item -ItemType Directory -Force -Path $out | Out-Null
Get-ChildItem -LiteralPath $out -File | Remove-Item -Force

# Public NotebookLM/reference snapshots only.
# Keep this as an explicit allowlist. Private founder-profile material,
# psychometric interpretation, compensation strategy, raw career notes and
# internal role-selection analysis belong in Antiokh/needlebit-marketing.
$groups = @(
    @{
        Name = "00_ROUTER_AND_GUARDRAILS"
        Files = @(
            "GPT_PROJECT_ROUTER.md",
            "GPT_PROJECT_ROUTER_SHORT.md",
            "MODE_ROUTER.md",
            "Positioning-archetypes-routing.txt",
            "ANTI_PATTERNS.md",
            "RESUME_ADAPTATION_WORKFLOW.md",
            "work-application-manager/SKILL.md",
            "work-application-manager/references/tracker-storage-v5.md",
            "work-application-manager/references/salary-normalization-v6.md",
            "work-application-manager/references/cv-markdown-v1.md",
            "work-application-manager/references/activity-log.md",
            "freelance-agency-manager/SKILL.md",
            "README.md"
        )
    },
    @{
        Name = "01A_PUBLIC_PROFILE"
        Files = @(
            "anton_nazarov_profile.json"
        )
    },
    @{
        Name = "01C_CAREER_STORY_CURATED"
        Files = @(
            "anton_nazarov_career_path_story.md"
        )
    },
    @{
        Name = "02_EXECUTIVE_AND_MANAGEMENT"
        Files = @(
            "EXECUTIVE_POSITIONING.md",
            "MANAGEMENT_EXPERIENCE_CASES.md",
            "MANAGEMENT_TRANSLATION_LAYER.md",
            "anton_nazarov_management_cases_full.md"
        )
    },
    @{
        Name = "03_TECH_UPWORK_AI"
        Files = @(
            "TECHNICAL_DELIVERY_POSITIONING.md",
            "UPWORK_PROJECT_CASES.md",
            "AI_NATIVE_DELIVERY.md"
        )
    },
    @{
        Name = "04_NEEDLEBIT"
        Files = @(
            "NEEDLEBIT_POSITIONING.md",
            "NEEDLEBIT_CASES.md",
            "NEEDLEBIT_OLD_ARCHIVE_NOT_PRIMARY.md"
        )
    }
)

# The detailed public experience remains split only for NotebookLM size/readability.
$splitGroups = @(
    @{
        Name = "01B_EXPERIENCE_FULL_PART_01"
        File = "anton_nazarov_experience_full.md"
        StartPattern = $null
        EndPattern = "^## Detailed Project Experience"
    },
    @{
        Name = "01B_EXPERIENCE_FULL_PART_02"
        File = "anton_nazarov_experience_full.md"
        StartPattern = "^## Detailed Project Experience"
        EndPattern = "^## New Business Environment"
    },
    @{
        Name = "01B_EXPERIENCE_FULL_PART_03"
        File = "anton_nazarov_experience_full.md"
        StartPattern = "^## New Business Environment"
        EndPattern = $null
    }
)

function Add-FileBlock {
    param(
        [System.Text.StringBuilder]$Builder,
        [string]$FileName
    )

    $path = Join-Path $root $FileName
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing source file: $FileName"
    }

    [void]$Builder.AppendLine("")
    [void]$Builder.AppendLine("---")
    [void]$Builder.AppendLine("SOURCE_FILE: $FileName")
    [void]$Builder.AppendLine("---")
    [void]$Builder.AppendLine("")
    [void]$Builder.AppendLine((Get-Content -LiteralPath $path -Raw -Encoding UTF8))
}

function Get-SectionText {
    param(
        [string]$FileName,
        [AllowNull()][string]$StartPattern,
        [AllowNull()][string]$EndPattern
    )

    $path = Join-Path $root $FileName
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing source file: $FileName"
    }

    $lines = Get-Content -LiteralPath $path -Encoding UTF8
    $start = 0
    $end = $lines.Count

    if ($StartPattern) {
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match $StartPattern) {
                $start = $i
                break
            }
        }
    }

    if ($EndPattern) {
        for ($i = $start + 1; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match $EndPattern) {
                $end = $i
                break
            }
        }
    }

    if ($end -le $start) {
        return ""
    }

    return ($lines[$start..($end - 1)] -join [Environment]::NewLine)
}

function Add-SplitFileBlock {
    param(
        [System.Text.StringBuilder]$Builder,
        [hashtable]$SplitGroup
    )

    [void]$Builder.AppendLine("")
    [void]$Builder.AppendLine("---")
    [void]$Builder.AppendLine("SOURCE_FILE: $($SplitGroup.File)")
    [void]$Builder.AppendLine("SOURCE_PART: $($SplitGroup.Name)")
    [void]$Builder.AppendLine("---")
    [void]$Builder.AppendLine("")
    [void]$Builder.AppendLine((Get-SectionText -FileName $SplitGroup.File -StartPattern $SplitGroup.StartPattern -EndPattern $SplitGroup.EndPattern))
}

$index = New-Object System.Text.StringBuilder
[void]$index.AppendLine("# NotebookLM Import Pack")
[void]$index.AppendLine("")
[void]$index.AppendLine("Public career-evidence snapshots only. Private founder-profile material must not be added here.")
[void]$index.AppendLine("")

$all = New-Object System.Text.StringBuilder
[void]$all.AppendLine("# GPT Workspace - Public Sources")
[void]$all.AppendLine("")
[void]$all.AppendLine("Generated public-evidence snapshot. Not an operational runtime.")

foreach ($group in $groups) {
    $targetName = "$($group.Name).txt"
    $targetPath = Join-Path $out $targetName
    $sb = New-Object System.Text.StringBuilder

    [void]$sb.AppendLine("# $($group.Name)")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("NotebookLM/reference snapshot only; do not use as GPT runtime.")
    [void]$sb.AppendLine("NotebookLM source title: $($group.Name)")
    [void]$sb.AppendLine("Original files included:")
    foreach ($file in $group.Files) {
        [void]$sb.AppendLine("- $file")
    }

    foreach ($file in $group.Files) {
        Add-FileBlock -Builder $sb -FileName $file
    }

    Set-Content -LiteralPath $targetPath -Value $sb.ToString() -Encoding UTF8
    [void]$index.AppendLine("- $targetName")
    [void]$all.AppendLine("")
    [void]$all.AppendLine("================================================================")
    [void]$all.AppendLine("NOTEBOOKLM_SOURCE: $($group.Name)")
    [void]$all.AppendLine("================================================================")
    [void]$all.AppendLine("")
    [void]$all.AppendLine($sb.ToString())
}

foreach ($splitGroup in $splitGroups) {
    $targetName = "$($splitGroup.Name).txt"
    $targetPath = Join-Path $out $targetName
    $sb = New-Object System.Text.StringBuilder

    [void]$sb.AppendLine("# $($splitGroup.Name)")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("NotebookLM/reference snapshot only; do not use as GPT runtime.")
    [void]$sb.AppendLine("NotebookLM source title: $($splitGroup.Name)")
    [void]$sb.AppendLine("Original file included: $($splitGroup.File)")

    Add-SplitFileBlock -Builder $sb -SplitGroup $splitGroup
    Set-Content -LiteralPath $targetPath -Value $sb.ToString() -Encoding UTF8
    [void]$index.AppendLine("- $targetName")
    [void]$all.AppendLine("")
    [void]$all.AppendLine("================================================================")
    [void]$all.AppendLine("NOTEBOOKLM_SOURCE: $($splitGroup.Name)")
    [void]$all.AppendLine("================================================================")
    [void]$all.AppendLine("")
    [void]$all.AppendLine($sb.ToString())
}

Set-Content -LiteralPath (Join-Path $out "README_IMPORT_ORDER.md") -Value $index.ToString() -Encoding UTF8
Set-Content -LiteralPath (Join-Path $out "ALL_SOURCES_FALLBACK.txt") -Value $all.ToString() -Encoding UTF8

Write-Host "Created public NotebookLM import pack in $out"
Write-Host "Private founder-profile material was not included."
