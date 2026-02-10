# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Point the camera at cards and instantly hear sounds — the "wow" moment must feel magical and work on any phone.
**Current focus:** Phase 8 — Git + Deploy (core app complete through Phase 7)

## Current Position

Phase: 8 of 11 (Git + Deploy)
Plan: Not yet planned
Status: Phases 1-7 complete. Roadmap restructured — old phases 4-7 closed, new phases 8-11 created.
Last activity: 2026-02-10 — Roadmap restructured, ready to plan deploy phase

Progress: ██████████████░░░░ 64% (7/11 phases complete)

## Version

0.1.1.0

## Performance Metrics

**Velocity:**
- Total plans completed: 8
- Average duration: 18 min
- Total execution time: 2.3 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2/2 | 8 min | 4 min |
| 2 | 3/3 | 74 min | 25 min |
| 3 | 3/3 | 52 min | 17 min |

**Recent Trend:**
- Last 5 plans: 18m, 5m, 4m, 15m, 33m
- Trend: Checkpoint verification added time on 03-03 (bug fixes during device test)

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

### Deferred Issues

None yet.

### Blockers/Concerns

- iOS Safari doesn't support native BarcodeDetector API — relies on WASM polyfill (Phase 8)

## Session Continuity

Last session: 2026-02-10
Stopped at: Roadmap restructured, ready to plan Phase 8 (Git + Deploy)
Resume file: None

## Roadmap Restructure (2026-02-10)

Phases 4-7 closed out (all complete or superseded). New phases added:
- **Phase 8**: Git + Deploy — GitHub repo + GitHub Pages (mirrors GOOPS pattern)
- **Phase 9**: QR Display Page — separate hosted page for showing QR codes on screen (design TBD with Muzzy)
- **Phase 10**: Polish — visual detection indicator + camera permission denied help
- **Phase 11**: iPhone Testing & Fixes — needs external tester with iPhone
