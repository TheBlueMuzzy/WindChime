# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Point the camera at cards and instantly hear sounds — the "wow" moment must feel magical and work on any phone.
**Current focus:** Phase 12 (Sound Upgrade) in progress — 2/5 plans complete.

## Current Position

Phase: 12 of 12 (Sound Upgrade)
Plan: 2 of 5 in current phase
Status: In progress
Last activity: 2026-02-10 — Completed 12-02-PLAN.md

Progress: ████████████████████ 93% (12/15 total plans in Phase 12 milestone)

## Version

0.1.2.8

## Performance Metrics

**Velocity:**
- Total plans completed: 12
- Average duration: 16 min
- Total execution time: 3.2 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2/2 | 8 min | 4 min |
| 2 | 3/3 | 74 min | 25 min |
| 3 | 3/3 | 52 min | 17 min |
| 8 | 1/1 | 22 min | 22 min |
| 10 | 1/1 | 12 min | 12 min |
| 12 | 2/5 | 15 min | 8 min |

**Recent Trend:**
- Last 5 plans: 33m, 22m, 12m, 11m, 4m
- Trend: Accelerating — audio splicing fast with Python toolchain in place

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- @yudiel/react-qr-scanner chosen (only React lib with multi-code + position + iOS + Android)
- Web Audio API for playback (need precise layering, fade envelopes, concurrent sounds)
- Lazy AudioContext creation (on first playSound, not mount) — avoids autoplay warnings
- Auto-resume suspended AudioContext in playSound — mobile autoplay policy
- Video element polling for camera activation (readyState >= 2) — onScan callback unreliable
- Playback gated on audioUnlocked state — no sound before explicit user tap
- Tap-anywhere toggle for sound on/off — unified gesture, no separate button
- Map<string, AudioBuffer> for buffer registry
- QR rawValue used directly as sound ID — no intermediate mapping
- 3 cards for v1 prototype (matches game rules, architecture supports more)
- Sounds bundled with app (no backend needed, pre-load on startup)
- Inline styles for app shell (no CSS modules — simple enough layout)
- dvh/dvw units for mobile-safe viewport coverage
- HTTPS required for mobile camera — @vitejs/plugin-basic-ssl added
- Default Scanner finder disabled — custom large scan area overlay instead
- **`allowMultiple={true}` on Scanner** — fires onScan every scanDelay (500ms) while codes are visible. Without this, scanner deduplicates and stops after first detection.
- **Max 3 simultaneous sounds** — hard cap in useAudioEngine.playSound. Gate checks BEFORE cleanupExpired to prevent expired-entry cleanup from opening slots too early.
- **No cooldown/staleness system** — removed visibleCodesRef tracking, replay intervals, and staleness timeouts. Scanner's continuous firing + isPlaying check handles everything.
- **stopAll() on toggle off** — immediately kills all AudioBufferSourceNodes when user taps to disable
- **WindChime dev server pinned to port 5213** — avoids collision with Goops on 5173
- **BASE_URL prefix for public assets** — `import.meta.env.BASE_URL` required for all fetch paths to `/public/` files (GitHub Pages subdirectory hosting)
- **Deferred sound loading** — load buffers only after user tap resumes AudioContext (mobile browsers reject decodeAudioData on suspended context)

### Deferred Issues

None yet.

### Blockers/Concerns

- iOS Safari doesn't support native BarcodeDetector API — relies on WASM polyfill (Phase 11)

## Session Continuity

Last session: 2026-02-10
Stopped at: Completed 12-02-PLAN.md (Phase 12: Sound Upgrade — spliced 100 clips)
Resume file: None
