# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Point the camera at cards and instantly hear sounds — the "wow" moment must feel magical and work on any phone.
**Current focus:** Phase 12 (Sound Upgrade) complete — all 5/5 plans done. Milestone ready for completion.

## Current Position

Phase: 12 of 12 (Sound Upgrade)
Plan: 5 of 5 in current phase
Status: Phase complete
Last activity: 2026-02-10 — Completed 12-05-PLAN.md

Progress: ████████████████████ 100% (15/15 total plans in Phase 12 milestone)

## Version

0.1.2.13

## Performance Metrics

**Velocity:**
- Total plans completed: 15
- Average duration: 15 min
- Total execution time: 3.8 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2/2 | 8 min | 4 min |
| 2 | 3/3 | 74 min | 25 min |
| 3 | 3/3 | 52 min | 17 min |
| 8 | 1/1 | 22 min | 22 min |
| 10 | 1/1 | 12 min | 12 min |
| 12 | 5/5 | 71 min | 14 min |

**Recent Trend:**
- Last 5 plans: 12m, 11m, 4m, 3m, 48m (deploy wait)
- Trend: Fast builds, deploy plan inflated by GitHub Pages queue

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
- **`allowMultiple={true}` on Scanner** — fires onScan every scanDelay (500ms) while codes are visible
- **Max 3 simultaneous sounds** — hard cap in useAudioEngine.playSound
- **No cooldown/staleness system** — scanner's continuous firing + isPlaying check handles everything
- **stopAll() on toggle off** — immediately kills all AudioBufferSourceNodes
- **WindChime dev server pinned to port 5213** — avoids collision with Goops on 5173
- **BASE_URL prefix for public assets** — `import.meta.env.BASE_URL` required for GitHub Pages subdirectory
- **Deferred sound loading** — load buffers only after user tap resumes AudioContext
- **Master push required before deploy** — GitHub API reads from remote master, not gh-pages
- **Deploy.js bypassed** — audio/spliced2/ no longer exists; build+gh-pages run directly

### Deferred Issues

None.

### Blockers/Concerns

- iOS Safari doesn't support native BarcodeDetector API — relies on WASM polyfill (Phase 11)

## Session Continuity

Last session: 2026-02-10
Stopped at: Completed 12-05-PLAN.md — Phase 12 complete, milestone ready
Resume file: None
