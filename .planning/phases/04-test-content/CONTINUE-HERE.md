# Continue Here — Phase 4 Plan 01 (Test Content)

## Status
- Tasks 1-2 from 04-01-PLAN.md are DONE and committed
- Task 3 (checkpoint:human-verify) PASSED — scan/audio bugs fixed, user approved
- Plan 04-01 ready for SUMMARY and close-out
- Plan 04-02 not started

## What's Been Done
1. **Chime generator script** created (`scripts/generate-chimes.mjs`) — committed `0397da5`
2. **User provided real audio clips** in `audio/` folder (7 source files from freesound)
3. **Spliced into 24 clips** in `audio/spliced/` — user renamed to `Chime_01` through `Chime_24`
4. **Copied to `public/sounds/`** as `Chime_01.mp3` through `Chime_24.mp3`
5. **Test page** at `test-assets/qr-chime-1.html` — shows 3 random QR codes with randomize button
6. **Debug overlay** in App.tsx — scan count, last detected, play log
7. **Now-playing center display** — shows `Chime_XX X.X/Y.Ys` for each active sound

## Bug Fixes Applied (this session)
All scan/audio lifecycle bugs from previous session have been fixed and user-approved:
- **`allowMultiple={true}`** on Scanner — fires onScan every 500ms while codes visible (was deduplicating after ~3 fires)
- **3-sound simultaneous cap** — hard gate in `useAudioEngine.playSound()`, checks BEFORE cleanupExpired
- **`stopAll()` on toggle off** — immediately kills all playing AudioBufferSourceNodes
- **Tap-to-scan gate** — scan results ignored until user taps "Tap anywhere to begin scanning"
- **Removed stale systems** — no more visibleCodesRef, replay intervals, staleness timeouts, or cooldown tracking

## Files Modified (uncommitted from bugfix session)
- `src/App.tsx` — simplified scan handler, tap-to-scan gate, stopAll on toggle, new button text
- `src/hooks/useAudioEngine.ts` — MAX_SIMULTANEOUS cap, stopAll(), playingCount()
- `src/components/QrScanner.tsx` — added `allowMultiple` prop to Scanner
- `vite.config.ts` — pinned port 5213

## Architecture (current state)

### Audio Engine (`src/hooks/useAudioEngine.ts`)
- `playingRef` = Map<string, PlayingEntry> — tracks active sounds
- `playSound(id)` — hard gate: size >= MAX_SIMULTANEOUS (3) → return. Then cleanupExpired, isPlaying check, create source
- `stopAll()` — iterates all entries, calls source.stop(), clears map
- `isPlaying(id)` / `getPlaying()` / `playingCount()` — with cleanupExpired before check
- Three cleanup mechanisms: onended, setTimeout fallback, cleanupExpired (wallclock)

### App.tsx scan flow
- `onScanRef` — if !audioUnlockedRef → return (tap-to-scan gate)
- For each chime code: if !isPlaying → playSound (engine enforces 3-cap internally)
- Toggle off: stopAll() + clear UI state

### QrScanner component
- `allowMultiple={true}` — continuous scanning every 500ms
- memo with `() => true` — never re-renders
- Stable ref-based callbacks

## Version
0.1.1.0

## Resume Instructions
1. Write 04-01-SUMMARY.md (tasks done, bugfixes applied, files changed)
2. Start 04-02-PLAN.md: Generate 3 QR codes, create printable layout, write sounds.json mapping
3. Or commit the uncommitted bugfix files first
