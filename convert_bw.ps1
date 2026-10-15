Add-Type -AssemblyName System.Drawing
$imgPath = "c:\Users\rbbhu\OneDrive\Documents\portfolio\assets\images\ritu.jpg"
$destPath = "c:\Users\rbbhu\OneDrive\Documents\portfolio\assets\images\ritu-bw.jpg"

if (Test-Path $imgPath) {
    $src = [System.Drawing.Bitmap]::FromFile($imgPath)
    $w = $src.Width
    $h = $src.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($dest)

    # Standard grayscale matrix with slight contrast enhancement
    $matrix = New-Object System.Drawing.Imaging.ColorMatrix
    $matrix.Matrix00 = 0.299
    $matrix.Matrix01 = 0.299
    $matrix.Matrix02 = 0.299
    $matrix.Matrix10 = 0.587
    $matrix.Matrix11 = 0.587
    $matrix.Matrix12 = 0.587
    $matrix.Matrix20 = 0.114
    $matrix.Matrix21 = 0.114
    $matrix.Matrix22 = 0.114
    $matrix.Matrix33 = 1.0
    $matrix.Matrix44 = 1.0

    $attr = New-Object System.Drawing.Imaging.ImageAttributes
    $attr.SetColorMatrix($matrix)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($src, $rect, 0, 0, $w, $h, [System.Drawing.GraphicsUnit]::Pixel, $attr)

    $g.Dispose()
    $src.Dispose()
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $dest.Dispose()
    Write-Output "Successfully generated ritu-bw.jpg"
} else {
    Write-Output "Source image not found"
}
