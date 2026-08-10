$baseUrl = "https://www.rackrolloff.com"
$outDir = "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental"

$assetList = @(
    "assets/hero_delivery.jpg",
    "assets/size_11yd.jpg",
    "assets/size_20yd.jpg",
    "assets/size_25yd.jpg",
    "assets/size_40yd.jpg"
)

foreach ($assetPath in $assetList) {
    $url = "$baseUrl/$assetPath"
    $localDest = Join-Path $outDir $assetPath
    $folder = [System.IO.Path]::GetDirectoryName($localDest)
    
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }
    
    try {
        Write-Host "Fetching image asset: $url -> $localDest"
        Invoke-WebRequest -Uri $url -OutFile $localDest -UseBasicParsing
    } catch {
        Write-Host "Failed to download $url : $_"
    }
}

Write-Host "Image assets download completed!"
