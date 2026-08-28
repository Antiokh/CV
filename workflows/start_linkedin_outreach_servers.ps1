$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$python = "python"
$dataDir = Join-Path $repo "data"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

function Test-Url {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url
    )

    try {
        Invoke-WebRequest -Uri $Url -TimeoutSec 2 -UseBasicParsing | Out-Null
        return $true
    } catch {
        return $false
    }
}

function Start-OutreachServer {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Name,

        [Parameter(Mandatory = $true)]
        [string[]] $Args,

        [Parameter(Mandatory = $true)]
        [string] $HealthUrl
    )

    if (Test-Url -Url $HealthUrl) {
        Write-Host "$Name already running: $HealthUrl"
        return
    }

    $outLog = Join-Path $dataDir "$Name.out.log"
    $errLog = Join-Path $dataDir "$Name.err.log"

    Start-Process `
        -FilePath $python `
        -ArgumentList $Args `
        -WorkingDirectory $repo `
        -WindowStyle Hidden `
        -RedirectStandardOutput $outLog `
        -RedirectStandardError $errLog | Out-Null

    for ($i = 0; $i -lt 20; $i += 1) {
        Start-Sleep -Milliseconds 500
        if (Test-Url -Url $HealthUrl) {
            Write-Host "$Name started: $HealthUrl"
            return
        }
    }

    throw "$Name did not respond at $HealthUrl. Check $errLog"
}

Set-Location -LiteralPath $repo

Start-OutreachServer `
    -Name "linkedin_recruiter_outreach_api" `
    -Args @("workflows\linkedin_recruiter_outreach.py", "serve") `
    -HealthUrl "http://127.0.0.1:8765/stats"

Start-OutreachServer `
    -Name "linkedin_recruiter_outreach_list" `
    -Args @("workflows\linkedin_recruiter_outreach.py", "serve-list") `
    -HealthUrl "http://127.0.0.1:8766/"

Start-Process "http://127.0.0.1:8766/"
