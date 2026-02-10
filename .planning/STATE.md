# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Point the camera at cards and instantly hear sounds — the "wow" moment must feel magical and work on any phone.
**Current focus:** Phase 3: Audio Engine Core — Web Audio API, sound playback on QR detection

## Current Position

Phase: 3 of 10 (Audio Engine Core)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-02-09 — Completed 03-02-PLAN.md

Progress: ███████░░░ 29%

## Version

0.1.0.12

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: 16 min
- Total execution time: 1.75 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2/2 | 8 min | 4 min |
| 2 | 3/3 | 74 min | 25 min |
| 3 | 2/3 | 19 min | 10 min |

**Recent Trend:**
- Last 5 plans: 51m, 18m, 5m, 4m, 15m
- Trend: Consistent speed on well-scoped plans

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- @yudiel/react-qr-scanner chosen (only React lib with multi-code + position + iOS + Android)
- Web Audio API for playback (need precise layering, fade envelopes, concurrent sounds)
- Lazy AudioContext creation (on first playSound, not mount) — avoids autoplay warnings
- Auto-resume suspended AudioContext in playSound — mobile autoplay policy
- Map<string, AudioBuffer> for buffer registry
- SOUND_MAP as Record<string, string> — QR rawValue keys to sound URLs
- QR rawValue used directly as sound ID — no intermediate mapping
- 3 cards for v1 prototype (matches game rules, architecture supports more)
- Sounds bundled with app (no backend needed, pre-load on startup)
- Inline styles for app shell (no CSS modules — simple enough layout)
- dvh/dvw units for mobile-safe viewport coverage
- HTTPS required for mobile camera — @vitejs/plugin-basic-ssl added
- Default Scanner finder disabled — custom large scan area overlay instead

### Deferred Issues

None yet.

### Blockers/Concerns

- iOS Safari doesn't support native BarcodeDetector API — relies on WASM polyfill (Phase 8)

## Session Continuity

Last session: 2026-02-09
Stopped at: Completed 03-02-PLAN.md — QR-to-sound mapping working, verified on device
Resume file: None
