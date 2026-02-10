---
phase: 12-sound-upgrade
plan: 01
subsystem: audio-processing
tags: [python, pydub, librosa, numpy, mfcc, duplicate-detection, ffmpeg]

# Dependency graph
requires: []
provides:
  - Python audio processing environment (pydub, librosa, numpy, qrcode)
  - Duplicate detection script (scripts/detect-duplicates.py)
  - Curated 18-file Source2 library (duplicates removed)
affects: [12-02-splicing, 12-03-qr-generation]

# Tech tracking
tech-stack:
  added: [pydub, librosa, numpy, "qrcode[pil]", ffmpeg]
  patterns: [MFCC-based audio similarity comparison, Python scripts in scripts/ dir]

key-files:
  created: [proto/requirements.txt, scripts/detect-duplicates.py]
  modified: []

key-decisions:
  - "MFCC cosine similarity for duplicate detection — more robust than raw waveform correlation"
  - "Deleted Chime_09 and Chime_11 (100% duplicates of 08 and 10), renumbered remaining to 01-18"
  - "18 source files remain for splicing (down from 20)"

patterns-established:
  - "Python audio toolchain: librosa for analysis, pydub for manipulation"

issues-created: []

# Metrics
duration: 11min
completed: 2026-02-10
---

# Phase 12 Plan 01: Python Setup + Duplicate Detection Summary

**Python audio environment installed, MFCC duplicate analysis found 2 exact pairs — curated to 18 source files for splicing**

## Performance

- **Duration:** 11 min
- **Completed:** 2026-02-10
- **Tasks:** 3/3 (2 auto + 1 human-verify checkpoint)
- **Files created:** 2

## Accomplishments

- Python audio processing environment fully working (pydub, librosa, numpy, qrcode, ffmpeg)
- MFCC-based duplicate detection script analyzes all 190 pairs across 20 Source2 files
- Found 2 definitive duplicate pairs (Chime_08=09 at 100%, Chime_10=11 at 100%)
- User curated: deleted Chime_09 and Chime_11, renumbered remaining files to Chime_01 through Chime_18
- 18 clean source files ready for Plan 02 splicing

## Task Commits

1. **Task 1: Install Python audio processing dependencies** — `ffea06d` (chore)
2. **Task 2: Create duplicate detection script and run analysis** — `923cef4` (feat)
3. **Task 3: Checkpoint — user reviewed duplicates and curated Source2** — no commit (human action)

## Files Created/Modified

- `proto/requirements.txt` — Python package list (pydub, librosa, numpy, qrcode[pil])
- `scripts/detect-duplicates.py` — MFCC-based audio similarity comparison script

## Decisions Made

- MFCC cosine similarity chosen over raw waveform correlation (more robust to timing differences)
- Chime_09 and Chime_11 deleted as 100% duplicates
- Remaining 18 files renumbered sequentially (Chime_01 through Chime_18)
- High cross-similarity (112 of 190 pairs >90%) attributed to shared instrument timbre, not actual duplication

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] ffmpeg installed but not on PATH**
- **Found during:** Task 1
- **Issue:** ffmpeg was already installed via winget but the binary wasn't on the shell PATH
- **Fix:** Located binary at WinGet packages directory, set PATH in environment
- **Impact:** None — librosa uses soundfile (not ffmpeg) for loading, so duplicate detection worked regardless

### Deferred Enhancements

None.

---

**Total deviations:** 1 auto-fixed (blocking). No scope creep.

## Issues Encountered

None.

## Next Phase Readiness

- 18 curated Source2 files ready for splicing
- Python environment fully working
- Plan 02 can proceed: splice 100 clips from 18 sources (~5-6 clips per source)
- Note: Plan originally assumed 5 clips per source × 20 files = 100. With 18 files, that's ~5.6 clips per source — clips will be distributed evenly

---
*Phase: 12-sound-upgrade*
*Completed: 2026-02-10*
