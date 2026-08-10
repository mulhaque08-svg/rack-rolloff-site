$baseUrl = "https://www.rackrolloff.com"
$outDir = "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force
}

# List of pages to download
$pages = @(
    "",
    "index.html",
    "sizes.html",
    "service-areas.html",
    "contact.html",
    "rules.html"
)

Write-Host "Downloading HTML pages from $baseUrl..."

foreach ($page in $pages) {
    $url = "$baseUrl/$page"
    $fileName = if ([string]::IsNullOrWhiteSpace($page)) { "index.html" } else { $page }
    $destFile = Join-Path $outDir $fileName
    
    try {
        Write-Host "Fetching $url -> $destFile"
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing
        [System.IO.File]::WriteAllText($destFile, $resp.Content, [System.Text.Encoding]::UTF8)
    } catch {
        Write-Host "Could not fetch $url : $_"
    }
}

# Download styles.css & app.js
$assets = @("styles.css", "app.js")
foreach ($asset in $assets) {
    $url = "$baseUrl/$asset"
    $destFile = Join-Path $outDir $asset
    try {
        Write-Host "Fetching asset $url -> $destFile"
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing
        [System.IO.File]::WriteAllText($destFile, $resp.Content, [System.Text.Encoding]::UTF8)
    } catch {
        Write-Host "Could not fetch asset $url : $_"
    }
}

Write-Host "Base pages and scripts downloaded successfully!"
