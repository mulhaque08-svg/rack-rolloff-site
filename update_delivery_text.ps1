$rootDir = "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental"

$allFiles = Get-ChildItem -Path $rootDir -Recurse -Filter "*.html"

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw
    
    $content = $content -replace 'Same-Day Delivery Available', 'Quick & Flexible Delivery'
    $content = $content -replace 'Same-Day Delivery', 'Quick & Flexible Delivery'
    $content = $content -replace 'same-day delivery', 'quick and flexible delivery'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated delivery text in $($file.Name)"
}
