#!/bin/sh
# Hängt an CSS/JS in index.html eine neue Versionsnummer (?v=...),
# damit Handys nach einer Änderung sicher die neuen Dateien laden (statt alter aus dem Zwischenspeicher).
# Aufruf: sh tools/bump-version.sh
cd "$(dirname "$0")/.." || exit 1
V=$(date +%Y%m%d%H%M)
sed -i -E "s#(href=\"css/style\.css|src=\"js/[a-z]+\.js)(\?v=[0-9]+)?\"#\1?v=$V\"#g" index.html
echo "Version $V gesetzt:"; grep -o '[a-z/]*\.\(css\|js\)?v=[0-9]*' index.html
