$body = @{
    email = "info@RackRolloff.com"
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "https://api.web3forms.com/submit" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Web3Forms Status: $($resp | ConvertTo-Json)"
} catch {
    Write-Host "Web3Forms Error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Error Body: $($reader.ReadToEnd())"
    }
}
