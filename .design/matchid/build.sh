#!/bin/bash
set -e
build() {
  stem="$1"; src="$2"
  {
    printf '%s\n' '<!doctype html>' '<html>' '<head>' '  <meta charset="utf-8">' '  <script src="./support.js"></script>' '</head>' '<body>' '<x-dc>' '<helmet>' '  <style>'
    cat _shared.css
    printf '%s\n' '  </style>' '</helmet>'
    cat "$src"
    printf '%s\n' '</x-dc>' '</body>' '</html>'
  } > "$stem.dc.html"
  echo "built $stem.dc.html"
}
build "$1" "$2"
