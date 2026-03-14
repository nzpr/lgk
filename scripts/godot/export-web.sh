#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_DIR="${ROOT_DIR}/godot/echo_trail"
OUTPUT_DIR="${ROOT_DIR}/godot/build/web"

mkdir -p "${OUTPUT_DIR}"
"${ROOT_DIR}/scripts/godot/godot.sh" --headless --path "${PROJECT_DIR}" --export-release Web "${OUTPUT_DIR}/index.html"
