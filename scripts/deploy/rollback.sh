#!/usr/bin/env bash
set -euo pipefail
REL="$HOME/deploy/henuoc"
if [ "$#" -gt 0 ]; then
  SHA="$1"
else
  [ -s "$REL/PREVIOUS" ] || { echo "no PREVIOUS release available for rollback" >&2; exit 1; }
  SHA="$(cat "$REL/PREVIOUS")"
fi
bash "$HOME/deploy/activate.sh" "$SHA"
