Add-Type -AssemblyName 'System.IO.Compression.FileSystem'

function Read-Xlsx($path) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entry = $zip.Entries | Where-Object { $_.FullName -like 'xl/sharedStrings.xml' }
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $zip.Dispose()
        return $content
    }
    $zip.Dispose()
    return ""
}

$files = @(
    'C:\Users\LEAN15\Desktop\SMED Hub\SMED_SEMI_Cutting_Standard.xlsx',
    'C:\Users\LEAN15\Desktop\SMED Hub\SMED_GBOS (compoment)_Cutting_Standard_V1_202609.xlsx',
    'C:\Users\LEAN15\Desktop\SMED Hub\SMED_ATOM_Cutting_Standard_V1_202609.xlsx'
)

foreach ($f in $files) {
    Write-Output "=== FILE: $f ==="
    $xml = Read-Xlsx $f
    # Extract text between <t> tags
    $matches = [regex]::Matches($xml, '<t[^>]*>([^<]+)</t>')
    $texts = @()
    foreach ($m in $matches) {
        $texts += $m.Groups[1].Value
    }
    Write-Output ($texts -join "`n")
    Write-Output ""
}
