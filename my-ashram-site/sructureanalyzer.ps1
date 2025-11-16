# structureanalyzer.ps1
# Generates full directory + file tree using ASCII-only characters.
# Safe for all PowerShell versions and strict mode.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# Get the directory where the script is located
$startPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# If running from command line without a file, use current directory
if ([string]::IsNullOrEmpty($startPath)) {
    $startPath = Get-Location
}

Write-Host "Analyzing structure at: $startPath" -ForegroundColor Cyan

# Define output file path
$outputFile = Join-Path $startPath "folder_structure.txt"

# Check if we can access the start path
try {
    $testAccess = Get-ChildItem -LiteralPath $startPath -Force -ErrorAction Stop | Select-Object -First 1
} catch {
    Write-Host "ERROR: Cannot access directory: $startPath" -ForegroundColor Red
    Write-Host "Please check permissions or run as Administrator" -ForegroundColor Yellow
    exit 1
}

# Remove existing output file if it exists
if (Test-Path $outputFile) {
    Remove-Item -Path $outputFile -Force
}

# Array to collect all output lines
$outputLines = @()

# Function to write directory tree recursively
function Write-Tree {
    param(
        [string]$Path,
        [string]$Prefix = ""
    )

    # Get all items with error handling
    try {
        $items = @(Get-ChildItem -LiteralPath $Path -Force -ErrorAction Stop)
    }
    catch {
        # If we can't read the directory at all, note it and return
        $script:outputLines += "$Prefix    [Access Denied]"
        return
    }

    # Sort items: directories first, then by name
    $items = $items | Sort-Object -Property @{Expression="PSIsContainer"; Descending=$true}, @{Expression="Name"; Descending=$false}

    $count = $items.Count
    $i = 0

    foreach ($item in $items) {
        $i++
        $isLast = ($i -eq $count)

        # Use pure ASCII characters for tree structure
        if ($isLast) {
            $connector = "+-- "
            $nextPrefix = "$Prefix    "
        } else {
            $connector = "+-- "
            $nextPrefix = "$Prefix|   "
        }

        # Build the line
        $displayName = $item.Name
        if ($item.PSIsContainer) {
            $displayName = "$displayName/"
        }

        $line = "$Prefix$connector$displayName"
        $script:outputLines += $line

        # Recurse into directories with error handling
        if ($item.PSIsContainer) {
            try {
                Write-Tree -Path $item.FullName -Prefix $nextPrefix
            }
            catch {
                # Skip directories we can't access
                $script:outputLines += "$nextPrefix[Cannot access subdirectory]"
            }
        }
    }
}

# Add header
$outputLines += $startPath
$outputLines += ""

# Generate the tree
Write-Tree -Path $startPath -Prefix ""

# Write all lines to file at once
try {
    $outputLines | Out-File -FilePath $outputFile -Encoding ASCII -Force
    Write-Host "Structure saved to: $outputFile" -ForegroundColor Green
    Write-Host "Total size: $((Get-Item $outputFile).Length) bytes" -ForegroundColor Yellow
    Write-Host "Total items: $($outputLines.Count) lines" -ForegroundColor Yellow
}
catch {
    Write-Host "ERROR: Could not write to file: $outputFile" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
