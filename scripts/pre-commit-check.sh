#!/usr/bin/env sh
set -eu

run_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    pnpm "$@"
    return
  fi

  if command -v corepack >/dev/null 2>&1; then
    corepack pnpm "$@"
    return
  fi

  echo "pre-commit: pnpm was not found. Run: corepack enable"
  exit 1
}

if [ ! -d "node_modules" ]; then
  echo "pre-commit: node_modules is missing. Run: corepack pnpm install"
  exit 1
fi

echo "pre-commit: running workspace typecheck"
run_pnpm -r typecheck
echo "pre-commit: checks passed"
