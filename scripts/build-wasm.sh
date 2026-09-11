#!/usr/bin/env bash
#
# Rebuilds the placebo WebAssembly binary used by /playground.
#
# The playground runs the real placebo CLI, compiled to the wasip1 target and
# driven by a WASI shim in the browser. This script pins the build to a tagged
# placebo release so the binary in public/wasm/ always corresponds to a version
# someone could actually install.
#
# Usage:  ./scripts/build-wasm.sh [version] [path/to/placebo/checkout]
#
set -euo pipefail

VERSION="${1:-0.1.0}"
SRC="${2:-../placebo}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/wasm/placebo-${VERSION}.wasm"

if [ ! -d "$SRC/.git" ]; then
  echo "error: no placebo checkout at $SRC" >&2
  echo "clone it first:  git clone https://github.com/hl7x/placebo $SRC" >&2
  exit 1
fi

WORKTREE="$(mktemp -d)"
trap 'git -C "$SRC" worktree remove --force "$WORKTREE" 2>/dev/null || true' EXIT

git -C "$SRC" worktree add -f "$WORKTREE" "v${VERSION}" >/dev/null

COMMIT="$(git -C "$WORKTREE" rev-parse --short HEAD)"
DATE="$(git -C "$WORKTREE" log -1 --format=%cI)"

mkdir -p "$(dirname "$OUT")"

# Mirrors the ldflags goreleaser uses for the native builds, so `placebo
# version` in the browser reports the same thing it does on a real machine.
( cd "$WORKTREE" && GOOS=wasip1 GOARCH=wasm CGO_ENABLED=0 go build -trimpath \
    -ldflags="-s -w -X main.version=${VERSION} -X main.commit=${COMMIT} -X main.date=${DATE}" \
    -o "$OUT" ./cmd/placebo )

echo "built $OUT"
echo "  version ${VERSION} (commit ${COMMIT})"
echo "  $(du -h "$OUT" | cut -f1) raw"
