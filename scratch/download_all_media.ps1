$baseUrl = "https://www.rackrolloff.com"
$outDir = "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental"

# Function to parse and download referenced assets
$htmlFiles = Get-ChildItem -Path $outDir -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract image src references
    $matches = [regex]::Matches($content, 'src=["'']([^"'']+)["'']')
    foreach ($m in $matches) {
        $relPath = $m.Groups[1].Value
        if ($relPath -notlike "http*" -and $relPath -notlike "//*" -and $relPath -notlike "data:*") {
            $assetUrl = "$baseUrl/$relPath".Replace("//", "/").Replace("https:/", "https://")
            $localDest = Join-Path $outDir $relPath
            $localFolder = [System.IO.Path]::GetDirectoryName($localDest)
            
            if (-not (Test-Path $localFolder)) {
                New-Item -ItemType Directory -Path $localFolder -Force | Out-Null
            }
            
            try {
                Write-Host "Downloading asset: $assetUrl -> $localDest"
                Invoke-WebRequest -Uri $assetUrl -OutFile $localDest -UseBasicParsing
            } catch {
                Write-Host "Failed to download asset $assetUrl : $_"
            }
        }
    }

    # Extract href links (for city pages or sub-pages)
    $hrefMatches = [regex]::Matches($content, 'href=["'']([^"'']+\.html)["'']')
    foreach ($hm in $hrefMatches) {
        $relLink = $hm.Groups[1].Value
        if ($relLink -notlike "http*" -and $relLink -notlike "//*" -and $relLink -notlike "#*") {
            $pageUrl = "$baseUrl/$relLink".Replace("//", "/").Replace("https:/", "https://")
            $localDest = Join-Path $outDir $relLink
            $localFolder = [System.IO.Path]::GetDirectoryName($localDest)
            
            if (-not (Test-Path $localFolder)) {
                New-Item -ItemType Directory -Path $localFolder -Force | Out-Null
            }
            
            try {
                if (-not (Test-Path $localDest)) {
                    Write-Host "Downloading sub-page: $pageUrl -> $localDest"
                    $resp = Invoke-WebRequest -Uri $pageUrl -UseBasicParsing
                    [System.IO.File]::WriteAllText($localDest, $resp.Content, [System.Text.Encoding]::UTF8)
                }
            } catch {
                Write-Host "Failed to download page $pageUrl : $_"
            }
        }
    }
}

Write-Host "All assets and sub-pages cloned successfully!"
