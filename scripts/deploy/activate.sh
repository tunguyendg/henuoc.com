#!/usr/bin/env bash
set -euo pipefail
SHA="${1:?usage: activate.sh <sha>}"
APP="$HOME/henuoc-app"
REL="$HOME/deploy/henuoc"

[ -d "$REL/$SHA" ] || { echo "release $SHA not found"; exit 1; }

# Đồng bộ release vào app/ (giữ nguyên server.js wrapper, package.json, tmp/ ở app root)
mkdir -p "$APP/app" "$APP/tmp"
rsync -a --delete "$REL/$SHA/" "$APP/app/"

# Passenger restart
touch "$APP/tmp/restart.txt"

# Ghi lại release hiện tại, giữ 3 bản gần nhất
[ -f "$REL/CURRENT" ] && cp "$REL/CURRENT" "$REL/PREVIOUS"
echo "$SHA" > "$REL/CURRENT"
ls -1dt "$REL"/*/ | tail -n +4 | xargs -r rm -rf
echo "activated $SHA"
