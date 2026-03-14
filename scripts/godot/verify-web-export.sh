#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEB_DIR="${ROOT_DIR}/godot/build/web"

test -f "${WEB_DIR}/index.html"
test -f "${WEB_DIR}/index.js"
test -f "${WEB_DIR}/index.pck"
test -f "${WEB_DIR}/index.wasm"

echo "Verified Godot Web export at ${WEB_DIR}"
