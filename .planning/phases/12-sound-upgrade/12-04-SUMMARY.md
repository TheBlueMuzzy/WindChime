---
phase: 12-sound-upgrade
plan: 04
subsystem: app
tags: [react, github-api, dynamic-discovery, manifest, codes-html]

requires:
  - phase: 12-02
    provides: 100 spliced clips in public/sounds/
  - phase: 12-03
    provides: 100 QR code PNGs
provides:
  - Dynamic sound discovery via GitHub Contents API
  - manifest.json fallback for offline/rate-limited scenarios
  - codes.html dynamic chime loading
affects: [12-05-deploy]

tech-stack:
  added: []
  patterns: [GitHub Contents API for runtime file discovery, manifest.json offline fallback]

key-files:
  created: [src/hooks/useChimeList.ts, public/sounds/manifest.json]
  modified: [src/App.tsx, public/codes.html, scripts/generate-chime-list.js]

key-decisions:
  - "GitHub API primary, manifest.json fallback for resilience"
  - "chimeIdSet ref pattern for scan handler access to latest chime list"

patterns-established:
  - "Runtime file discovery via GitHub Contents API with local fallback"

issues-created: []

duration: 8min
completed: 2026-02-10
---

# 12-04 Summary: Dynamic Sound Discovery

## What Changed

The app and codes.html no longer hardcode a list of chime IDs. Both now discover available sounds at runtime by querying the GitHub Contents API, with a local `manifest.json` fallback for offline or rate-limited scenarios.

## Task 1: React App Dynamic Discovery

**Commit:** `716f3ae`

- Created `src/hooks/useChimeList.ts` -- a React hook that fetches the chime list from `https://api.github.com/repos/TheBlueMuzzy/WindChime/contents/public/sounds`, parses filenames matching `Chime_*.mp3`, and returns sorted chime IDs.
- If the GitHub API fails (rate limit, network error), the hook falls back to fetching `sounds/manifest.json` from the app's own deployment.
- Updated `src/App.tsx`:
  - Removed the hardcoded `CHIME_IDS` Set (24 entries).
  - Added `useChimeList()` hook for dynamic discovery.
  - Used `useMemo` for a derived `chimeIdSet` and a ref (`chimeIdSetRef`) so the scan handler always has access to the latest set without re-creating the callback.
  - Sound loading effect now uses `chimeIds` array and re-loads if the list changes (tracked via a joined string key instead of a boolean).

## Task 2: codes.html + manifest.json

**Commit:** `8be4235`

- Updated `scripts/generate-chime-list.js` to also write `public/sounds/manifest.json` (a JSON array of chime IDs) alongside `chime-data.js`.
- Ran `npm run update-chimes` to generate `manifest.json` with 100 chime entries.
- Updated `public/codes.html`:
  - Removed the `<script src="chime-data.js">` dependency.
  - Wrapped initialization in an async `init()` function that fetches from GitHub API first, falls back to `sounds/manifest.json`.
  - Shows a "Loading chimes..." message while fetching.
  - Shows an error message if both sources fail.
  - All existing UI functions (renderSlots, renderGrid, randomize, toggleGrid) kept unchanged.

## Deviations from Plan

1. **Unused `chimesLoading` variable**: TypeScript strict mode flagged the destructured `loading: chimesLoading` as unused, causing a build failure. Fixed by renaming to `_chimesLoading` (underscore prefix convention for intentionally unused variables).
2. **`soundsLoaded` ref type changed**: Changed from `useRef(false)` (boolean) to `useRef<string | null>(null)` to track which specific chime list has been loaded, enabling re-loading when the chime list changes.
3. **`chime-data.js` not included in commit**: The file was unchanged after re-running `update-chimes` (already had the correct 100 entries), so it was not staged.

## Verification

- TypeScript: PASS (`npx tsc --noEmit` -- clean)
- Production build: PASS (`npm run build` -- 584ms, no errors)
- manifest.json: 100 entries, Chime_001 through Chime_100
