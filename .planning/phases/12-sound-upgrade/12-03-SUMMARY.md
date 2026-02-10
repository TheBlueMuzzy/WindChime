---
phase: 12-sound-upgrade
plan: 03
subsystem: audio-processing
tags: [python, qrcode, pillow, png, cleanup]

requires:
  - phase: 12-02
    provides: 100 spliced clips in audio/spliced2/
provides:
  - 100 QR code PNGs in audio/QR2/
  - Clean directory structure (old spliced/ removed)
affects: [12-04-dynamic-discovery, 12-05-deploy]

tech-stack:
  added: []
  patterns: [QR generation with qrcode+PIL, numbered pairing Chime_XXX↔QR_XXX]

key-files:
  created: [scripts/generate-qr-codes.py, audio/QR2/QR_001-100.png]
  modified: []

key-decisions:
  - "Keep spliced2/ name (avoid rename churn, generate-chime-list.js already updated)"
  - "300x300 QR at error correction M for print/screen balance"

patterns-established:
  - "QR_XXX.png naming matches Chime_XXX.mp3 by number"

issues-created: []

duration: 4min
completed: 2026-02-10
---

# Plan 12-03 Summary: QR Code Generation + Directory Cleanup

## Performance

Both tasks completed cleanly with no errors or retries. Total execution time approximately 4 minutes.

## Accomplishments

1. **Generated 100 QR code images** -- Each QR code encodes the string `Chime_XXX` (matching the sound ID used by the app). All 100 PNGs saved to `audio/QR2/` at 300x300 pixels with error correction level M.

2. **Removed old `audio/spliced/` directory** -- The original 24-clip directory has been deleted from git history going forward. The canonical audio source is now `audio/spliced2/` with 100 clips, which `generate-chime-list.js` already references.

## Task Commits

| Task | Commit Hash | Description |
|------|-------------|-------------|
| Task 1 | `308256a` | feat(12-03): generate 100 QR code images for new chime clips |
| Task 2 | `75884e9` | chore(12-03): remove old 24-clip audio/spliced/ directory |

## Files Created

- `scripts/generate-qr-codes.py` -- Python script using `qrcode` + PIL to generate all 100 QR PNGs
- `audio/QR2/QR_001.png` through `audio/QR2/QR_100.png` -- 100 QR code images (~476-498 bytes each)

## Files Modified

- None

## Files Deleted

- `audio/spliced/Chime_01.mp3` through `audio/spliced/Chime_24.mp3` -- 24 old clips removed via `git rm`

## Decisions Made

1. **Keep `spliced2/` name as-is** -- Renaming to `spliced/` would cause unnecessary churn since `generate-chime-list.js` was already updated in Plan 02 to point to `spliced2/`.

2. **300x300 pixels with error correction M** -- Balanced between scan reliability and file size. Level M provides 15% error recovery, suitable for both screen display and print.

3. **QR encodes raw `Chime_XXX` string** -- The app uses this exact string as the sound ID, so the QR content maps directly to the clip identifier without any URL wrapping or additional metadata.

## Deviations from Plan

None. Plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

Plan 12-04 (dynamic discovery) can proceed. The following assets are now in place:
- 100 audio clips in `audio/spliced2/Chime_001.mp3` through `Chime_100.mp3`
- 100 QR codes in `audio/QR2/QR_001.png` through `QR_100.png`
- Naming convention `Chime_XXX` / `QR_XXX` provides direct 1:1 pairing by number
- Old `audio/spliced/` directory removed, no stale references remain
