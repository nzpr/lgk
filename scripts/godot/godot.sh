#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
EDITOR_BIN="$("${ROOT_DIR}/scripts/godot/bootstrap.sh")"

HOME="${ROOT_DIR}/.godot-home" "${EDITOR_BIN}" "$@"
