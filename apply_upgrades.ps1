$rootDir = "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental"

$topPromoBar = @"
  <!-- Top Promo Announcement Bar -->
  <div class="top-promo-bar">
    <div class="nav-container" style="justify-content: center; text-align: center;">
      <span>🔥 <strong>Special Offer:</strong> Save <strong>$25 OFF</strong> Your Dumpster Order — Use Code <strong>RACK25</strong> at Checkout! <a href="sizes.html">Claim Offer <i class="fa-solid fa-arrow-right"></i></a></span>
    </div>
  </div>
"@

$mobileCallButton = @"
  <!-- Mobile Sticky Call Button -->
  <a href="tel:8325108005" class="mobile-sticky-call">
    <i class="fa-solid fa-phone"></i> Call (832) 510-8005
  </a>
"@

# Update Main HTML files
$mainFiles = Get-ChildItem -Path $rootDir -Filter "*.html"

foreach ($file in $mainFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Insert top promo bar if missing
    if ($content -notcontains "top-promo-bar") {
        $content = $content -replace '<header', "$topPromoBar`n  <header"
    }
    
    # Insert mobile call button if missing
    if ($content -notcontains "mobile-sticky-call") {
        $content = $content -replace '</body>', "$mobileCallButton`n</body>"
    }
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Applied upgrades to main file: $($file.Name)"
}

# Update City HTML files
$cityFiles = Get-ChildItem -Path "$rootDir\cities" -Filter "*.html"

foreach ($file in $cityFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix paths for city subfolder
    $cityPromoBar = @"
  <!-- Top Promo Announcement Bar -->
  <div class="top-promo-bar">
    <div class="nav-container" style="justify-content: center; text-align: center;">
      <span>🔥 <strong>Special Offer:</strong> Save <strong>$25 OFF</strong> Your Dumpster Order — Use Code <strong>RACK25</strong> at Checkout! <a href="../sizes.html">Claim Offer <i class="fa-solid fa-arrow-right"></i></a></span>
    </div>
  </div>
"@

    if ($content -notcontains "top-promo-bar") {
        $content = $content -replace '<header', "$cityPromoBar`n  <header"
    }
    
    if ($content -notcontains "mobile-sticky-call") {
        $content = $content -replace '</body>', "$mobileCallButton`n</body>"
    }
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Applied upgrades to city file: $($file.Name)"
}
