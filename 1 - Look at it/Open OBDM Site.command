#!/bin/bash
cd "$(dirname "$0")" || exit 1
PORT=8777
echo "Serving the OBDM site preview at http://localhost:$PORT"
echo "Leave this window open while you browse. Close it when you're done."
echo
for CMD in "python3 -m http.server $PORT" "python -m SimpleHTTPServer $PORT" "php -S localhost:$PORT" "ruby -run -e httpd . -p $PORT"; do
  BIN=$(echo "$CMD" | cut -d' ' -f1)
  if command -v "$BIN" >/dev/null 2>&1; then
    ( sleep 1; open "http://localhost:$PORT" ) &
    exec $CMD
  fi
done
echo "No local web server found on this Mac."
echo "Opening index.html directly instead — this works fine in most cases."
open index.html
