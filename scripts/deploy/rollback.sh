#!/usr/bin/env bash
set -euo pipefail
REL="$HOME/deploy/henuoc"
SHA="${1:-$(cat "$REL/PREVIOUS")}"
bash "$HOME/deploy/activate.sh" "$SHA"
