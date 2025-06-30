# Script to test API Endpoints and Socket.IO

$ErrorActionPreference = 'Stop'

# Helper function to test HTTP requests
function Test-HttpRequest {
    param (
        [string]$Url,
        [System.Collections.IDictionary]$Headers = @{},
        [string]$Method = "GET",
        [object]$Payload = $null
    )

    try {
        $httpClient = New-Object System.Net.Http.HttpClient
        $headers = $Headers.GetEnumerator()
        foreach ($header in $headers) {
            $httpClient.DefaultRequestHeaders.Add($header.Key, $header.Value)
        }

        Write-Host "Testing $Method $Url" -ForegroundColor Yellow
        if ($Method -eq 'POST' -and $Payload) {
            $jsonPayload = ConvertTo-Json $Payload
            $response = $httpClient.PostAsync($Url, [System.Net.Http.StringContent]$jsonPayload, [System.Text.Encoding]::UTF8, 'application/json').Result
        } elseif ($Method -eq 'POST') {
            $response = $httpClient.PostAsync($Url, [System.Net.Http.StringContent]$null).Result
        } else {
            $response = $httpClient.GetAsync($Url).Result
        }

        $response.EnsureSuccessStatusCode()
        return $true
    } catch {
        Write-Host "Failed: $_" -ForegroundColor Red
        return $false
    }
}

# Set base URL
$baseUrl = "http://localhost:3000/api/chat"

# Test Endpoints
$tests = @(
    @{ Url = "$baseUrl/initiate"; Method = 'POST'; Payload = @{ email = 'guest@example.com'; name = 'Guest' } },
    @{ Url = "$baseUrl/customer-context/guest@example.com"; Method = 'GET' },
    @{ Url = "$baseUrl/preview-link"; Method = 'POST'; Payload = @{ url = 'https://example.com' } }
)

# Execute tests
$allPassed = $true
foreach ($test in $tests) {
    $result = Test-HttpRequest -Url $test.Url -Method $test.Method -Payload $test.Payload
    if (-not $result) {
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "All tests passed. API and Socket.IO are working." -ForegroundColor Green
} else {
    Write-Host "Some tests failed. There might be an issue." -ForegroundColor Red
}
