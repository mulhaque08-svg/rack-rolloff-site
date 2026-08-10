$apiKey = "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"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type"  = "application/json"
}

$body = @{
    personalizations = @(
        @{
            to = @(
                @{ email = "info@RackRolloff.com" }
            )
            subject = "RackRolloff SendGrid Activation Test"
        }
    )
    from = @{ email = "info@RackRolloff.com" }
    content = @(
        @{
            type  = "text/html"
            value = "<h3>SendGrid Integration Activated</h3><p>Your RackRolloff website email notifications are connected!</p>"
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $resp = Invoke-WebRequest -Uri "https://api.sendgrid.com/v3/mail/send" -Method Post -Headers $headers -Body $body -UseBasicParsing
    Write-Host "SendGrid Response Status Code: $($resp.StatusCode)"
} catch {
    Write-Host "SendGrid Error Response: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Error Body: $($reader.ReadToEnd())"
    }
}
