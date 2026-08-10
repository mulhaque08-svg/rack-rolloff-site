$citiesDir = "C:\Users\fibrg\OneDrive\.gemini\antigravity\scratch\dumpster-rental\cities"

$cityList = @(
    @{ slug = "conroe"; name = "Conroe, TX"; county = "Montgomery County"; zip = "77385" },
    @{ slug = "the-woodlands"; name = "The Woodlands, TX"; county = "Montgomery County"; zip = "77380" },
    @{ slug = "katy"; name = "Katy, TX"; county = "Harris County"; zip = "77494" },
    @{ slug = "spring"; name = "Spring, TX"; county = "Harris / Montgomery"; zip = "77373" },
    @{ slug = "cypress"; name = "Cypress, TX"; county = "Harris County"; zip = "77429" },
    @{ slug = "pasadena"; name = "Pasadena, TX"; county = "Harris County"; zip = "77502" },
    @{ slug = "baytown"; name = "Baytown, TX"; county = "Harris County"; zip = "77520" },
    @{ slug = "sugar-land"; name = "Sugar Land, TX"; county = "Fort Bend County"; zip = "77478" }
)

# Base template from houston.html
$template = Get-Content "$citiesDir\houston.html" -Raw

foreach ($c in $cityList) {
    $cityName = $c.name
    $slug = $c.slug
    $county = $c.county
    $zip = $c.zip
    
    $cityHtml = $template -replace 'Houston, TX', $cityName
    $cityHtml = $cityHtml -replace 'Houston', ($cityName -replace ', TX', '')
    $cityHtml = $cityHtml -replace 'Harris County', $county
    $cityHtml = $cityHtml -replace 'info@usamtech.com', 'info@rackrolloff.com'
    $cityHtml = $cityHtml -replace 'fibrgls@yahoo.com', 'info@rackrolloff.com'
    
    $filePath = "$citiesDir\$slug.html"
    Set-Content -Path $filePath -Value $cityHtml -Encoding UTF8
    Write-Host "Created city page: $slug.html ($cityName)"
}
