# Script to list all files A-Z in shofy-backend and shofy-front-end directories
Write-Host "=== SHOFY PROJECT FILE LISTING A-Z ===" -ForegroundColor Green
Write-Host ""

# Function to get all files recursively and sort them
function Get-AllFilesSorted {
    param(
        [string]$Path,
        [string]$DirectoryName
    )
    
    Write-Host "=== $DirectoryName ===" -ForegroundColor Yellow
    Write-Host "Directory: $Path" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # Get all files recursively, excluding node_modules and .git for cleaner output
        $files = Get-ChildItem -Path $Path -File -Recurse | 
                 Where-Object { $_.FullName -notmatch "\\node_modules\\|\\\.git\\|\\\.next\\cache" } |
                 Sort-Object Name
        
        Write-Host "Total Files Found: $($files.Count)" -ForegroundColor Magenta
        Write-Host ""
        
        $counter = 1
        foreach ($file in $files) {
            $relativePath = $file.FullName.Replace($Path, "").TrimStart('\')
            $fileSize = if ($file.Length -lt 1KB) { "$($file.Length) B" }
                       elseif ($file.Length -lt 1MB) { "{0:N1} KB" -f ($file.Length / 1KB) }
                       else { "{0:N1} MB" -f ($file.Length / 1MB) }
            
            Write-Host ("{0,4}. {1} ({2}) - {3}" -f $counter, $file.Name, $fileSize, $relativePath) -ForegroundColor White
            $counter++
        }
        
        Write-Host ""
        Write-Host "--- End of $DirectoryName ---" -ForegroundColor Yellow
        Write-Host ""
        
    } catch {
        Write-Host "Error processing $DirectoryName : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Check if directories exist and process them
$backendPath = "D:\A bismillah Bhai\SHOFY FULL THEME\shofy-backend"
$frontendPath = "D:\A bismillah Bhai\SHOFY FULL THEME\shofy-front-end"

if (Test-Path $backendPath) {
    Get-AllFilesSorted -Path $backendPath -DirectoryName "SHOFY BACKEND"
} else {
    Write-Host "Backend directory not found: $backendPath" -ForegroundColor Red
}

if (Test-Path $frontendPath) {
    Get-AllFilesSorted -Path $frontendPath -DirectoryName "SHOFY FRONTEND"
} else {
    Write-Host "Frontend directory not found: $frontendPath" -ForegroundColor Red
}

Write-Host "=== SCRIPT COMPLETED ===" -ForegroundColor Green
