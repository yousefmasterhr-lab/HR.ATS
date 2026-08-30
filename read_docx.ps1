Add-Type -AssemblyName System.IO.Compression.FileSystem
$docPath = Join-Path (Get-Location) "Applicant Tracking System.docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($docPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlContent = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

[xml]$docXml = $xmlContent
$ns = New-Object System.Xml.XmlNamespaceManager($docXml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$paragraphs = $docXml.SelectNodes("//w:p", $ns)
$lines = @()
foreach ($p in $paragraphs) {
    $text = $p.InnerText
    if ($text.Trim().Length -gt 0) {
        $lines += $text
    }
}
$lines | Out-File -FilePath "docx_content.txt" -Encoding utf8
Write-Output "Extracted $($lines.Count) lines"
