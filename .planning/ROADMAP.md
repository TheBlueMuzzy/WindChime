# Roadmap: Wind Chime — Companion App

## Overview

Turn a physical wind chime card layout into a live audio experience. Core scanning + audio functionality complete (Phases 1-7). Remaining work: deploy, QR display page, polish, iPhone testing, and sound upgrade. 12 phases total.

## Domain Expertise

None

## Phases

- [x] **Phase 1: Project Foundation** - Scaffold Vite/React/TS, install dependencies, basic app shell with camera display
- [x] **Phase 2: QR Scanner Integration** - Camera access, @yudiel/react-qr-scanner, detect single QR code and display value
- [x] **Phase 3: Audio Engine Core** - Web Audio API context, load/decode audio buffers, play a sound on QR detection
- [x] **Phase 4: Test Content** - 24 real wind chime sounds sourced, spliced, and integrated
- [x] **Phase 5: Multi-Code Detection** - Multi-code detection via allowMultiple (left-to-right sorting cut)
- [x] **Phase 6: Sound Layering & Fade** - Concurrent playback with gain nodes, fade envelopes (done early in Phase 3)
- [x] **Phase 7: Detection State & Cooldowns** - Superseded by allowMultiple + isPlaying pattern
- [x] **Phase 8: Git + Deploy** - Git repo, GitHub remote, GitHub Pages deploy (like GOOPS)
- [x] **Phase 9: QR Display Page** - Separate hosted page showing QR codes for scanning from a phone
- [x] **Phase 10: Polish** - Visual detection indicator, camera permission denied help screen
- [ ] **Phase 11: iPhone Testing & Fixes** - External testing on iOS Safari, fix whatever breaks
- [ ] **Phase 12: Sound Upgrade** - Replace 24 clips with 100 new clips from Source2, generate QR codes, make app fully dynamic

## Phase Details

### Phase 1: Project Foundation
**Goal**: Running Vite dev server with a React/TS app shell showing a full-screen camera placeholder
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard Vite/React/TS setup, Muzzy's established stack)
**Plans**: 2 plans

Plans:
- [x] 01-01: Scaffold Vite + React + TS project, install core dependencies
- [x] 01-02: App shell layout — full-screen landscape container, dark background, camera placeholder

### Phase 2: QR Scanner Integration
**Goal**: Phone camera activates and detects a single QR code, displaying its raw value on screen
**Depends on**: Phase 1
**Research**: Likely (new library — @yudiel/react-qr-scanner API, configuration, event handling)
**Research topics**: @yudiel/react-qr-scanner API docs, barcode-detector polyfill setup, camera constraints for rear-facing landscape
**Plans**: 3 plans

Plans:
- [x] 02-01: Install @yudiel/react-qr-scanner and barcode-detector polyfill, configure scanner component
- [x] 02-02: Camera permissions flow — request rear camera, handle grant/deny
- [x] 02-03: Single QR detection — display detected QR value on screen as proof of life

### Phase 3: Audio Engine Core
**Goal**: Detecting a QR code triggers a sound playing through Web Audio API
**Depends on**: Phase 2
**Research**: Likely (Web Audio API patterns — AudioContext, decodeAudioData, AudioBufferSourceNode, GainNode)
**Research topics**: Web Audio API best practices for mobile, AudioContext resume on user gesture (iOS requirement), buffer decoding patterns
**Plans**: 3 plans

Plans:
- [x] 03-01: Create useAudioEngine hook — AudioContext setup, buffer loading, single sound playback
- [x] 03-02: Connect QR detection to audio — detected code triggers mapped sound
- [x] 03-03: Handle mobile audio unlock (iOS/Android require user gesture to start AudioContext)

### Phase 4: Test Content
**Goal**: Real wind chime sounds and QR test content ready for testing
**Depends on**: Phase 3
**Status**: Complete — 24 real sounds sourced and integrated. QR test page exists. Plan 02 (QR generation/printable layout) superseded by Phase 9.
**Plans**: 1 plan (plan 02 superseded)

Plans:
- [x] 04-01: Source 24 real wind chime sounds, splice, integrate into app *(exceeded original 3-sound goal)*
- [x] 04-02: QR code generation and display *(superseded — absorbed into Phase 9 QR Display Page)*

### Phase 5: Multi-Code Detection
**Goal**: Camera detects multiple QR codes simultaneously
**Depends on**: Phase 4
**Status**: Complete — multi-code detection works via `allowMultiple`. Left-to-right sorting cut (not needed).
**Plans**: 1 plan (plan 02 cut)

Plans:
- [x] 05-01: Enable multi-code detection in scanner, handle array of detected codes *(done during Phase 3 bugfixes)*
- [x] 05-02: Left-to-right sorting *(cut — not needed for the experience)*

### Phase 6: Sound Layering & Fade
**Goal**: Multiple sounds play concurrently with smooth layering and natural fade-out
**Depends on**: Phase 5
**Status**: Complete (done early in Phase 3).
**Plans**: 3 plans

Plans:
- [x] 06-01: Support concurrent audio sources *(done in Phase 3)*
- [x] 06-02: Add GainNode per sound for individual volume control *(done in Phase 3)*
- [x] 06-03: Implement fade envelopes — fast fade-in, fade-out using gain ramps *(done in Phase 3)*

### Phase 7: Detection State & Cooldowns
**Goal**: QR codes can re-trigger after leaving/re-entering frame
**Status**: Superseded — `allowMultiple` + `isPlaying` pattern handles everything. No explicit cooldown needed.

Plans:
- [x] 07-01: Detection state *(handled by allowMultiple)*
- [x] 07-02: Re-trigger logic *(handled by isPlaying + MAX_SIMULTANEOUS cap)*

### Phase 8: Git + Deploy
**Goal**: WindChime app in a GitHub repo, deployed to GitHub Pages (like thebluemuzzy.github.io/GOOPS/)
**Depends on**: Phase 7 (core app complete)
**Research**: Unlikely (mirrors GOOPS deploy pattern)
**Plans**: 1 plan

Plans:
- [x] 08-01: Create GitHub repo, configure Vite base path, deploy script, push to GitHub Pages

### Phase 9: QR Display Page
**Goal**: Separate hosted page showing QR codes on a computer screen for phone scanning
**Depends on**: Phase 8 (needs deploy infrastructure)
**Status**: Complete — built informally (codes.html with 3 random slots, randomize button, full chime scroll strip, hide/show toggle)
**Plans**: 1 plan (built outside formal plan flow)

Plans:
- [x] 09-01: QR Display Page with dynamic chime grid, randomize, and hide/show toggle

### Phase 10: Polish
**Goal**: Visual detection indicator + camera permission denied help screen
**Depends on**: Phase 8 (needs deployed app to test)
**Research**: Unlikely
**Plans**: 1 plan

Plans:
- [x] 10-01: Visual feedback on QR detection + camera permission denied recovery screen

### Phase 11: iPhone Testing & Fixes
**Goal**: App works on iOS Safari — tested by someone with an iPhone, fixes applied
**Depends on**: Phase 8 (needs deployed URL to share)
**Research**: Likely (iOS-specific WASM polyfill, Safari camera quirks)
**Status**: Cannot start until external iPhone tester available
**Plans**: 1 plan

Plans:
- [ ] 11-01: iOS Safari pre-flight audit, deploy, real-device testing with iPhone tester

### Phase 12: Sound Upgrade
**Goal**: Replace 24 old clips with 100 new high-quality clips from Source2 recordings, generate matching QR codes, make app fully dynamic (GitHub API file discovery)
**Depends on**: Phase 8 (needs deploy infrastructure), Phase 3 (audio engine)
**Research**: Likely (Python audio processing, GitHub Contents API, waveform comparison)
**Plans**: 5 plans

Plans:
- [x] 12-01: Python setup + duplicate detection analysis (checkpoint: user curates sources)
- [ ] 12-02: Splice 100 five-second clips from curated sources with fade envelopes
- [ ] 12-03: QR code generation (100 PNGs) + old sound directory cleanup
- [ ] 12-04: Dynamic sound discovery via GitHub API (app + codes.html, remove hardcoded lists)
- [ ] 12-05: Deploy to GitHub Pages + end-to-end verification (checkpoint: user tests on phone)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Foundation | 2/2 | Complete | 2026-02-09 |
| 2. QR Scanner Integration | 3/3 | Complete | 2026-02-09 |
| 3. Audio Engine Core | 3/3 | Complete | 2026-02-09 |
| 4. Test Content | 1/1 | Complete (plan 02 → Phase 9) | 2026-02-09 |
| 5. Multi-Code Detection | 1/1 | Complete (L-R sorting cut) | 2026-02-09 |
| 6. Sound Layering & Fade | 3/3 | Complete (done early) | 2026-02-09 |
| 7. Detection State & Cooldowns | 2/2 | Complete (superseded) | 2026-02-09 |
| 8. Git + Deploy | 1/1 | Complete | 2026-02-10 |
| 9. QR Display Page | 1/1 | Complete | 2026-02-10 |
| 10. Polish | 1/1 | Complete | 2026-02-10 |
| 11. iPhone Testing & Fixes | 0/? | Blocked (needs tester) | - |
| 12. Sound Upgrade | 1/5 | In progress | - |
