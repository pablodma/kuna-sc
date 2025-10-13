# Script para agregar entrada al archivo hosts
# Debe ejecutarse como Administrador

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$hostname = "db.lcppzendmlaikynqfjuy.supabase.co"
$ip = "162.210.199.65"

# Verificar si la entrada ya existe
$hostsContent = Get-Content $hostsPath -ErrorAction SilentlyContinue
if ($hostsContent -match $hostname) {
    Write-Host "La entrada ya existe en el archivo hosts" -ForegroundColor Yellow
    exit 0
}

# Agregar la entrada
$entry = "`n$ip`t$hostname"
Add-Content -Path $hostsPath -Value $entry -ErrorAction Stop

Write-Host "✅ Entrada agregada exitosamente al archivo hosts" -ForegroundColor Green
Write-Host "IP: $ip -> Hostname: $hostname" -ForegroundColor Cyan

# Verificar
Write-Host "`nVerificando resolución DNS..." -ForegroundColor Yellow
$result = Resolve-DnsName $hostname -Type A -ErrorAction SilentlyContinue | Where-Object {$_.Type -eq "A"}
if ($result) {
    Write-Host "✅ Resolución exitosa: $($result.IPAddress)" -ForegroundColor Green
} else {
    Write-Host "⚠️ Esperando propagación de cambios..." -ForegroundColor Yellow
}

