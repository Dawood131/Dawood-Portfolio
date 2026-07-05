#   bash optimize-media.sh

SRC_DIR="public/files"

if [ ! -d "$SRC_DIR" ]; then
  echo "❌ Folder '$SRC_DIR' not found. Run this script from your project root."
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "❌ ffmpeg not found. Install it first."
  exit 1
fi

echo "🖼  Converting PNGs to WebP..."
echo "-------------------------------"

find "$SRC_DIR" -type f -iname "*.png" | while read -r file; do
  out="${file%.png}.webp"
  if [ -f "$out" ]; then
    echo "⏭  Skipping (already exists): $out"
    continue
  fi
  echo "→ $file"
  ffmpeg -nostdin -y -i "$file" -q:v 75 "$out" -loglevel error < /dev/null
  if [ $? -eq 0 ]; then
    echo "   ✅ done: $out"
  else
    echo "   ❌ failed: $file"
  fi
done

echo ""
echo "🎬 Compressing MP4 videos..."
echo "-------------------------------"

find "$SRC_DIR" -type f -iname "*.mp4" | while read -r file; do
  out="${file%.mp4}.compressed.mp4"
  if [ -f "$out" ]; then
    echo "⏭  Skipping (already exists): $out"
    continue
  fi
  echo "→ $file"
  ffmpeg -nostdin -y -i "$file" \
    -vcodec libx264 -crf 28 -preset veryslow \
    -vf "scale=1280:-2" \
    -movflags +faststart \
    -an \
    "$out" -loglevel error < /dev/null
  if [ $? -eq 0 ]; then
    echo "   ✅ done: $out"
  else
    echo "   ❌ failed: $file"
  fi
done

echo ""
echo "✅ All done."
echo ""
echo "Next steps:"
echo "1. Check the new .webp and .compressed.mp4 files — verify quality looks good."
echo "2. Update your image/video src paths in code to point to the new files"
echo "   (e.g. 'Hero Section.png' -> 'Hero Section.webp')."
echo "3. Once confirmed, delete the old large PNG/MP4 originals to save repo space."