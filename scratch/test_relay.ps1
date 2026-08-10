$body = @{
    subject     = "Browser Relay Test to info@RackRolloff.com"
    htmlContent = "<h3>Live SendGrid Relay Test</h3><p>Testing direct browser relay endpoint for RackRolloff!</p>"
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8081/api/send-email" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Local Relay Endpoint Response: $($resp | ConvertTo-Json)"
} catch {
    Write-Host "Relay Test Error: $_"
}
