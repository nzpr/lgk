#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VERSION="4.6.1-stable"
VERSION_DIR="${VERSION/-/.}"
EDITOR_URL="https://github.com/godotengine/godot-builds/releases/download/${VERSION}/Godot_v${VERSION}_linux.x86_64.zip"
TEMPLATES_URL="https://github.com/godotengine/godot-builds/releases/download/${VERSION}/Godot_v${VERSION}_export_templates.tpz"

TOOLCHAIN_DIR="${ROOT_DIR}/.godot-toolchain/${VERSION}"
EDITOR_DIR="${TOOLCHAIN_DIR}/editor"
TEMPLATES_DIR="${TOOLCHAIN_DIR}/templates"
EDITOR_BIN="${EDITOR_DIR}/Godot_v${VERSION}_linux.x86_64"
LEGACY_EDITOR_BIN="${ROOT_DIR}/.godot-bin/Godot_v${VERSION}_linux.x86_64"
LEGACY_TEMPLATES_DIR="${ROOT_DIR}/.godot-templates/templates"
HOME_DIR="${ROOT_DIR}/.godot-home"
EXPORT_DIR="${HOME_DIR}/.local/share/godot/export_templates/${VERSION_DIR}"

mkdir -p "${EDITOR_DIR}" "${TEMPLATES_DIR}" "${EXPORT_DIR}"

if [[ -x "${LEGACY_EDITOR_BIN}" ]]; then
  cp -f "${LEGACY_EDITOR_BIN}" "${EDITOR_BIN}"
  chmod +x "${EDITOR_BIN}"
elif [[ ! -x "${EDITOR_BIN}" ]]; then
  curl -fsSL "${EDITOR_URL}" -o "${EDITOR_DIR}/godot.zip"
  unzip -oq "${EDITOR_DIR}/godot.zip" -d "${EDITOR_DIR}"
  chmod +x "${EDITOR_BIN}"
fi

if [[ "${GODOT_SKIP_TEMPLATES:-0}" != "1" ]] && [[ ! -f "${EXPORT_DIR}/web_release.wasm32.zip" ]]; then
  if [[ -d "${LEGACY_TEMPLATES_DIR}" ]]; then
    cp -R "${LEGACY_TEMPLATES_DIR}/." "${EXPORT_DIR}/"
  else
    curl -fsSL "${TEMPLATES_URL}" -o "${TEMPLATES_DIR}/export_templates.tpz"
    rm -rf "${TEMPLATES_DIR}/unzipped"
    mkdir -p "${TEMPLATES_DIR}/unzipped"
    unzip -oq "${TEMPLATES_DIR}/export_templates.tpz" -d "${TEMPLATES_DIR}/unzipped"
    cp -R "${TEMPLATES_DIR}/unzipped/templates/." "${EXPORT_DIR}/"
  fi
fi

echo "${EDITOR_BIN}"
