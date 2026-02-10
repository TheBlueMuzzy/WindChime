---
phase: 12-sound-upgrade
plan: 02
subsystem: audio-processing
tags: [python, pydub, splice, fade-envelope, mp3]

requires:
  - phase: 12-01
    provides: Curated 18-file Source2 library, Python audio environment
provides:
  - 100 five-second spliced clips with fade envelopes
  - Updated public/sounds/ directory with new clips
  - Regenerated chime-data.js with 100 entries
affects: [12-03-qr-generation, 12-04-dynamic-discovery, 12-05-deploy]

tech-stack:
  added: []
  patterns: [pydub splicing with fade envelopes]

key-files:
  created: [scripts/splice-chimes.py, audio/spliced2/Chime_001-100.mp3]
  modified: [scripts/generate-chime-list.js, public/chime-data.js, public/sounds/]

key-decisions:
  - "Distributed 100 clips across 18 sources (5-6 clips each, remainder to longest)"
  - "192kbps mp3 export for quality"
  - "3-digit zero-padding (Chime_001) for 100-item sets"

patterns-established:
  - "3-digit zero-padding (Chime_001) for 100-item sets"
  - "Evenly-spaced start positions with overlap when source shorter than total clip demand"

issues-created: []

duration: 4min
completed: 2026-02-10
---

# Phase 12 Plan 02: Splice 100 Five-Second Clips Summary

**100 five-second clips spliced from 18 curated Source2 recordings with pydub fade envelopes, replacing old 24-clip library**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-10T16:06:47Z
- **Completed:** 2026-02-10T16:11:03Z
- **Tasks:** 2/2
- **Files modified:** 104+ (script, 100 audio clips, generate script, chime-data.js)

## Accomplishments

1. Created `scripts/splice-chimes.py` -- a Python splicing script using pydub that:
   - Reads all 18 Source2 mp3 files
   - Allocates 5-6 clips per source (100 total), with remainder clips going to the 10 longest sources
   - Extracts 5000ms clips at evenly-spaced start positions
   - Applies 200ms fade-in and 500ms fade-out envelopes
   - Exports as 192kbps mp3 with 3-digit zero-padded naming

2. Produced 100 clips in `audio/spliced2/` (Chime_001.mp3 through Chime_100.mp3)

3. Replaced the old 24 clips in `public/sounds/` with the 100 new clips

4. Updated `scripts/generate-chime-list.js` to read from `audio/spliced2/` instead of `audio/spliced`

5. Regenerated `public/chime-data.js` with all 100 chime entries

## Task Commits

| Task | Commit Hash | Description |
|------|-------------|-------------|
| Task 1 | `047e878` | Create splicing script and produce 100 five-second clips |
| Task 2 | `bce95d4` | Replace 24 old clips with 100 new spliced clips |

## Files Created

- `scripts/splice-chimes.py` -- Python splicing script
- `audio/spliced2/Chime_001.mp3` through `audio/spliced2/Chime_100.mp3` -- 100 spliced clips

## Files Modified

- `scripts/generate-chime-list.js` -- Changed source directory from `audio/spliced` to `audio/spliced2`
- `public/chime-data.js` -- Regenerated with 100 entries (was 24)
- `public/sounds/` -- Replaced 24 old clips with 100 new clips

## Decisions Made

- **Clip allocation**: 5 base clips per source, +1 extra for the 10 longest sources (to reach 100 total)
- **Overlap handling**: When a source is shorter than its total clip demand, start positions are evenly spaced across the available duration, resulting in overlapping clips. This is expected and noted in the script output.
- **ffmpeg path**: Set explicitly in the script via `AudioSegment.converter` and PATH environment variable to avoid discovery issues.

## Deviations from Plan

- **Source durations differed from estimates**: The plan estimated durations based on file size (e.g., Chime_01 was listed as ~1s but was actually 12.3s; Chime_15 was listed as ~1s but was actually 10.4s). The actual durations from the loaded audio were all between 10-30 seconds, which is better than expected -- more audio to work with means more varied clips.
- **Most sources have overlapping clips**: Because 5-6 clips of 5s each requires 25-30s of source material, and most sources are 10-25s long, 15 of 18 sources had overlapping start positions. Only Chime_06, Chime_08, and Chime_10 (all ~30s) had enough duration for non-overlapping clips. This was anticipated by the plan's overlap handling requirement.

## Issues Encountered

None. The script ran cleanly on the first attempt. ffmpeg was found via explicit path configuration.

## Next Phase Readiness

Phase 12-02 is complete. The project now has:
- 100 unique chime clips available in `public/sounds/`
- `chime-data.js` listing all 100 chime IDs
- Everything needed for 12-03 (QR generation) to map 100 QR codes to 100 chimes
