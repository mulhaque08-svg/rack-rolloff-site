$port = 8081
$path = "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental"
$sgApiKey = "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"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "RackRolloff Server running with SendGrid Relay on http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # CORS Headers for Browser Access
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $reqPath = $request.Url.LocalPath
        
        # Handle SendGrid Email Relay Endpoint
        if ($reqPath -eq "/api/send-email" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream)
            $jsonBody = $reader.ReadToEnd()
            $payload = $jsonBody | ConvertFrom-Json
            
            $sgHeaders = @{
                "Authorization" = "Bearer $sgApiKey"
                "Content-Type"  = "application/json"
            }
            
            $sgBody = @{
                personalizations = @(
                    @{
                        to = @( @{ email = "info@RackRolloff.com" } )
                        subject = $payload.subject
                    }
                )
                from = @{ email = "info@RackRolloff.com"; name = "RackRolloff Dispatch" }
                content = @(
                    @{
                        type  = "text/html"
                        value = $payload.htmlContent
                    }
                )
            } | ConvertTo-Json -Depth 5
            
            try {
                $sgResp = Invoke-WebRequest -Uri "https://api.sendgrid.com/v3/mail/send" -Method Post -Headers $sgHeaders -Body $sgBody -UseBasicParsing
                Write-Host "[SERVER RELAY] SendGrid Email Delivered! Status Code: $($sgResp.StatusCode)"
                
                $response.StatusCode = 200
                $resBuffer = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Email delivered via SendGrid"}')
                $response.OutputStream.Write($resBuffer, 0, $resBuffer.Length)
            } catch {
                Write-Host "[SERVER RELAY ERROR] $_"
                $response.StatusCode = 500
                $resBuffer = [System.Text.Encoding]::UTF8.GetBytes('{"success":false}')
                $response.OutputStream.Write($resBuffer, 0, $resBuffer.Length)
            }
            $response.Close()
            continue
        }
        
        if ($reqPath -eq "/") { $reqPath = "/index.html" }
        
        $localFile = Join-Path $path ($reqPath.TrimStart("/").Replace("/", "\"))
        
        if (Test-Path $localFile -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".png"  { $response.ContentType = "image/png" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    } catch {
        Write-Host "Error: $_"
    }
}
