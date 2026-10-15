$targetDir = "c:\Users\rbbhu\OneDrive\Documents\portfolio\assets\images"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
}

$urls = @(
    "https://wpriverthemes.com/drake/wp-content/themes/drake/assets/images/favicon.png",
    "https://wpriverthemes.com/drake/wp-content/themes/drake/assets/images/logo.png",
    "https://wpriverthemes.com/drake/wp-content/themes/drake/assets/images/me.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-1.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-2.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-3.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-4.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-5.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-6.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-7.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/client-8.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/figma.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/framer.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/laravel.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/portfolio1.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/portfolio2.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/portfolio3.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/portfolio4.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/portfolio5.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/react.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/round-text.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/testimonial-1.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/testimonial-2.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/testimonial-3.jpg",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/webflow.png",
    "https://wpriverthemes.com/drake/wp-content/uploads/2023/03/wordpress.png"
)

foreach ($u in $urls) {
    $filename = Split-Path -Leaf $u
    $dest = Join-Path $targetDir $filename
    if (-not (Test-Path $dest)) {
        try {
            curl.exe -s -L -o $dest $u
            Write-Output "Downloaded: $filename"
        } catch {
            Write-Output "Error: $filename"
        }
    }
}

# Download video1.mp4 to assets
$videoDest = "c:\Users\rbbhu\OneDrive\Documents\portfolio\assets\video1.mp4"
if (-not (Test-Path $videoDest)) {
    Write-Output "Downloading video1.mp4 (Earth Lines background)..."
    curl.exe -s -L -o $videoDest "https://wpriverthemes.com/drake/wp-content/themes/drake/assets/images/video1.mp4"
    Write-Output "Downloaded video1.mp4"
}
