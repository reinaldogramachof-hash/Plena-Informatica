$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
Push-Location -LiteralPath $repoRoot
try {
    & node (Join-Path $PSScriptRoot 'prepare-public-deploy.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'A seleção pública não passou na validação.' }
    $stagePath = Join-Path $repoRoot 'deploy_staging/2026-11-12-public/site'
    $manifestPath = Join-Path $repoRoot 'deploy_staging/2026-11-12-public/manifest.json'
    $archivePath = Join-Path $repoRoot 'deploy/plena-site-completo-2026-11-12.zip'
    $checksumPath = Join-Path $repoRoot 'deploy/plena-site-completo-2026-11-12.sha256'
    if (Test-Path -LiteralPath $archivePath) { throw 'O ZIP já existe. Não sobrescrever uma entrega anterior.' }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($stagePath, $archivePath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
    $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    $expected = @{}
    foreach ($file in $manifest.inventory) { $expected[$file.path] = $file }
    $archive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
    try {
        $entries = @($archive.Entries | Where-Object { $_.Name })
        if ($entries.Count -ne $expected.Count) { throw 'Contagem do ZIP difere do inventário.' }
        foreach ($entry in $entries) {
            $relative = $entry.FullName.Replace('\', '/')
            if (-not $expected.ContainsKey($relative)) { throw "Arquivo inesperado: $relative" }
            $stream = $entry.Open()
            $sha = [System.Security.Cryptography.SHA256]::Create()
            try { $hash = ([BitConverter]::ToString($sha.ComputeHash($stream))).Replace('-', '').ToLowerInvariant() }
            finally { $stream.Dispose(); $sha.Dispose() }
            if ($hash -ne $expected[$relative].sha256) { throw "Integridade divergente: $relative" }
        }
    } finally { $archive.Dispose() }
    $zipHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
    [System.IO.File]::WriteAllText($checksumPath, "$zipHash  plena-site-completo-2026-11-12.zip`n", [System.Text.UTF8Encoding]::new($false))
    [pscustomobject]@{Archive=$archivePath;Bytes=(Get-Item -LiteralPath $archivePath).Length;Files=$manifest.files;SHA256=$zipHash;Commit=$manifest.commit} | ConvertTo-Json
} finally { Pop-Location }
