#!/usr/bin/env bash
# Regenerate static/resume.pdf from index.html using headless Chrome.
# Run this after editing the CV so the downloadable PDF stays in sync.
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
CHROME="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"

# Stage the site in a Windows-accessible temp dir so Chrome can resolve
# the stylesheet, the avatar, and the web font.
WIN_TMP="/mnt/c/Users/jelol/AppData/Local/Temp/cvbuild"
WIN_TMP_DOS='C:\Users\jelol\AppData\Local\Temp\cvbuild'

rm -rf "$WIN_TMP"
mkdir -p "$WIN_TMP/static"
cp "$SRC/index.html" "$SRC/style.css" "$WIN_TMP/"
cp "$SRC/static/me.webp" "$WIN_TMP/static/"

"$CHROME" \
  --headless=new --disable-gpu \
  --no-pdf-header-footer \
  --user-data-dir="C:\\Users\\jelol\\AppData\\Local\\Temp\\cvprofile" \
  --virtual-time-budget=10000 \
  --run-all-compositor-stages-before-draw \
  --print-to-pdf="$WIN_TMP_DOS\\resume.pdf" \
  "file:///C:/Users/jelol/AppData/Local/Temp/cvbuild/index.html"

cp "$WIN_TMP/resume.pdf" "$SRC/static/resume.pdf"
echo "✓ static/resume.pdf regenerated ($(du -h "$SRC/static/resume.pdf" | cut -f1))"
