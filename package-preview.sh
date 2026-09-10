#!/bin/bash
# Build the site and package it so it opens offline by double-clicking index.html.
# Astro emits absolute /_astro paths and a remote Google Fonts link; neither works
# from file://, so both are rewritten here. Re-run this after any content change.
set -e
cd "$(dirname "$0")"
ROOT=".."
PKG="$ROOT/OBDM-Site-Preview"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

echo "==> building"
npm run build >/dev/null

echo "==> vendoring google fonts"
mkdir -p dist/fonts
CSS=$(grep -ohE 'https://fonts\.googleapis\.com/css2[^"]+' dist/index.html | head -1 | sed 's/&amp;/\&/g')
curl -sSL -A "$UA" "$CSS" -o dist/fonts/fonts.css
( cd dist/fonts
  i=1
  for u in $(grep -ohE 'https://fonts\.gstatic\.com/[^)]+' fonts.css | sort -u); do
    f="f$i.${u##*.}"; curl -sSL -o "$f" "$u"
    python3 - "$u" "$f" <<'PY'
import sys
u,f=sys.argv[1],sys.argv[2]
s=open("fonts.css").read().replace(u,f); open("fonts.css","w").write(s)
PY
    i=$((i+1))
  done )
echo "    $(ls dist/fonts/f*.woff2 | wc -l | tr -d ' ') font files"

echo "==> rewriting absolute paths to relative"
python3 - <<'PY'
import os, re
root = "dist"
for dp, dn, fn in os.walk(root):
    for f in fn:
        if not f.endswith(".html"): continue
        page = os.path.join(dp, f)
        depth = os.path.relpath(page, root).count(os.sep)
        rel = "./" if depth == 0 else "../"*depth
        s = open(page, encoding="utf-8").read()
        s = re.sub(r'<link[^>]+href="https://fonts\.googleapis\.com/css2[^"]*"[^>]*>',
                   f'<link rel="stylesheet" href="{rel}fonts/fonts.css" />', s)
        s = re.sub(r'<link[^>]+href="https://fonts\.(googleapis|gstatic)\.com/?"[^>]*>', '', s)
        s = re.sub(r'\b(src|href|poster|content)="(/(?!/)[^"]*)"',
                   lambda m: f'{m.group(1)}="{rel}{m.group(2).lstrip("/")}"', s)
        s = re.sub(r'url\((["\']?)/(?!/)([^)"\']+)\1\)',
                   lambda m: f'url({m.group(1)}{rel}{m.group(2)}{m.group(1)})', s)
        open(page, "w", encoding="utf-8").write(s)
for dp, dn, fn in os.walk(os.path.join(root, "_astro")):
    for f in fn:
        if f.endswith(".css"):
            p = os.path.join(dp, f); s = open(p, encoding="utf-8").read()
            s2 = re.sub(r'url\((["\']?)/_astro/', lambda m: f'url({m.group(1)}./', s)
            if s2 != s: open(p, "w", encoding="utf-8").write(s2)
PY

echo "==> staging"
rm -rf "$PKG"; mkdir -p "$PKG"
cp -R dist/. "$PKG/"
rm -rf "$PKG/.prerender"
cp preview-assets/READ_ME_FIRST.txt "$PKG/READ ME FIRST.txt"
cp preview-assets/launcher.sh "$PKG/Open OBDM Site.command"
chmod +x "$PKG/Open OBDM Site.command"

echo "==> zipping"
rm -f "$ROOT/OBDM-Site-Preview.zip"
( cd "$ROOT" && zip -rq OBDM-Site-Preview.zip "OBDM-Site-Preview" -x "*.DS_Store" )
echo "==> done: $(du -h "$ROOT/OBDM-Site-Preview.zip" | cut -f1)  $(find "$PKG" -type f | wc -l | tr -d ' ') files"
