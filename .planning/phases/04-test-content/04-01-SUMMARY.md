# Phase 4, Plan 01 Summary

**24 real wind chime sounds sourced, spliced, and integrated — replacing synthesized test tones**

## Performance

- **Duration:** ~45 min (spread across debugging session)
- **Completed:** 2026-02-09
- **Tasks:** 3/3 (including human verification)
- **Files modified:** 10+

## Accomplishments
- 24 real wind chime mp3 clips sourced from freesound, spliced from 7 source recordings
- All sounds pre-load on app mount via CHIME_IDS set (no SOUND_MAP config file)
- QR rawValue used directly as sound ID — `Chime_XX` maps to `/sounds/Chime_XX.mp3`
- Audio engine rewritten with fade envelopes, isPlaying guard, triple cleanup (onended + setTimeout + wallclock)
- Post-plan bugfixes: allowMultiple continuous scanning, 3-sound simultaneous cap, stopAll on toggle, tap-to-scan gate

## Deviations from Plan

### Major: Architecture changed from plan

**Plan specified:** 3 synthesized WAV files (C major triad), SOUND_MAP in `src/config/sounds.ts`
**What happened:** User provided 7 real wind chime recordings from freesound. Spliced into 24 clips. SOUND_MAP removed — CHIME_IDS set in App.tsx maps QR rawValues directly to `/sounds/{id}.mp3`. Config file `src/config/sounds.ts` deleted.

**Impact:** Better sounds, simpler architecture. Plan 02 must use `Chime_XX` IDs (not `chime-1/2/3`).

## Files Created/Modified
- `public/sounds/Chime_01.mp3` through `Chime_24.mp3` — 24 real chime sounds
- `scripts/generate-chimes.mjs` — original synth generator (superseded by real sounds)
- `scripts/splice-audio.mjs`, `splice-batch.mjs`, `rename-and-setup.mjs` — audio processing scripts
- `src/config/sounds.ts` — DELETED (SOUND_MAP removed)
- `src/App.tsx` — CHIME_IDS set, simplified scan handler, tap-to-scan gate
- `src/hooks/useAudioEngine.ts` — MAX_SIMULTANEOUS cap, stopAll(), fade envelopes
- `src/components/QrScanner.tsx` — allowMultiple prop added

## Key Decisions
- QR rawValue IS the sound ID — no intermediate mapping layer
- 24 sounds (not 3) — architecture supports all from the start
- No SOUND_MAP config — CHIME_IDS hardcoded set is simpler and sufficient
- `allowMultiple={true}` on Scanner — continuous scanning replaces cooldown/staleness systems

---
*Phase: 04-test-content, Plan: 01*
*Completed: 2026-02-09*
