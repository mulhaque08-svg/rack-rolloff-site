$files = Get-ChildItem -Path "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental" -Recurse -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace Cloudflare email protection tags and old emails in footer
    $newContent = $content -replace '<li><strong>Email:</strong>\s*<a href="/cdn-cgi/l/email-protection"[^>]*>.*?</a></li>', '<li><strong>Email:</strong> <a href="mailto:info@rackrolloff.com">info@rackrolloff.com</a></li>'
    $newContent = $newContent -replace '<a href="/cdn-cgi/l/email-protection[^>]*>.*?</a>', 'info@rackrolloff.com'
    $newContent = $newContent -replace 'info@usamtech.com', 'info@rackrolloff.com'
    $newContent = $newContent -replace 'fibrgls@yahoo.com', 'info@rackrolloff.com'
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated footer email in: $($file.Name)"
    }
}
