#!/usr/bin/env bash
set -euo pipefail
SHA="${1:?usage: activate.sh <sha>}"
APP="$HOME/henuoc-app"
REL="$HOME/deploy/henuoc"

[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "invalid release sha" >&2; exit 1; }
[ -f "$REL/$SHA/server.js" ] && [ -f "$REL/$SHA/REVISION" ] || {
  echo "release $SHA is missing server.js or REVISION" >&2; exit 1;
}
[ "$(cat "$REL/$SHA/REVISION")" = "$SHA" ] || { echo "release revision mismatch" >&2; exit 1; }

# Sync only the standalone subdirectory, preserving the Passenger wrapper and tmp/.
mkdir -p "$APP/app" "$APP/tmp"
rsync -a --delete "$REL/$SHA/" "$APP/app/"

# Re-activating the same revision must not overwrite the rollback target.
PREVIOUS=""
if [ -f "$REL/CURRENT" ] && [ "$(cat "$REL/CURRENT")" != "$SHA" ]; then
  cp "$REL/CURRENT" "$REL/PREVIOUS"
fi
if [ -f "$REL/PREVIOUS" ]; then PREVIOUS="$(cat "$REL/PREVIOUS")"; fi
printf '%s\n' "$SHA" > "$REL/CURRENT"
touch "$APP/tmp/restart.txt"

# Keep three releases, always protecting CURRENT and PREVIOUS regardless of mtime.
kept=1
if [ -n "$PREVIOUS" ] && [ "$PREVIOUS" != "$SHA" ] && [ -d "$REL/$PREVIOUS" ]; then
  kept=2
fi
while IFS= read -r release; do
  name="${release%/}"
  name="${name##*/}"
  [[ "$name" =~ ^[0-9a-f]{40}$ ]] || continue
  if [ "$name" = "$SHA" ] || [ "$name" = "$PREVIOUS" ]; then continue; fi
  if [ "$kept" -lt 3 ]; then
    kept=$((kept + 1))
  else
    rm -rf -- "$release"
  fi
done < <(ls -1dt "$REL"/*/)
echo "activated $SHA"
