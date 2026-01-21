# Install Goose CLI on Windows
$ErrorActionPreference = "Stop"

Write-Host "=== Installing Goose CLI for Windows ===" -ForegroundColor Cyan

# Define paths
$gooseUrl = "https://github.com/block/goose/releases/download/stable/goose-windows-amd64.exe"
$gooseDir = "$env:USERPROFILE\.goose\bin"
$gooseExe = "$gooseDir\goose.exe"

# Create directory
Write-Host "Creating directory: $gooseDir"
New-Item -ItemType Directory -Force -Path $gooseDir | Out-Null

# Download Goose
Write-Host "Downloading Goose CLI from GitHub..."
try {
    Invoke-WebRequest -Uri $gooseUrl -OutFile $gooseExe -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Failed to download: $_" -ForegroundColor Red
    exit 1
}

# Verify download
if (Test-Path $gooseExe) {
    Write-Host "Goose installed to: $gooseExe" -ForegroundColor Green

    # Add to PATH (永久)
    $pathValue = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($pathValue -notlike "*\.goose\bin*") {
        Write-Host "Adding Goose to user PATH..."
        [Environment]::SetEnvironmentVariable("Path", "$pathValue;$gooseDir", "User")
        Write-Host "PATH updated. Please restart your terminal for changes to take effect." -ForegroundColor Yellow
    } else {
        Write-Host "Goose already in PATH." -ForegroundColor Green
    }

    # Test version (add to current session)
    $env:PATH += ";$gooseDir"
    Write-Host "`nTesting Goose installation:" -ForegroundColor Cyan
    & $gooseExe --version
} else {
    Write-Host "Installation failed - executable not found." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Installation Complete ===" -ForegroundColor Green
