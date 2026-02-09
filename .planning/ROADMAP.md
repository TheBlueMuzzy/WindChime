# Roadmap: Wind Chime — Companion App

## Overview

Turn a physical wind chime card layout into a live audio experience. Start with scaffolding and camera access, build up through single-code detection to multi-code layered audio, then harden for iOS and polish edge cases. 10 phases from empty project to working prototype with 3 printable QR cards.

## Domain Expertise

None

## Phases

- [ ] **Phase 1: Project Foundation** - Scaffold Vite/React/TS, install dependencies, basic app shell with camera display
- [ ] **Phase 2: QR Scanner Integration** - Camera access, @yudiel/react-qr-scanner, detect single QR code and display value
- [ ] **Phase 3: Audio Engine Core** - Web Audio API context, load/decode audio buffers, play a sound on QR detection
- [ ] **Phase 4: Test Content** - Create 3 placeholder wind chime sounds, 3 printable QR codes, and sound mapping JSON
- [ ] **Phase 5: Multi-Code Detection** - Detect multiple QR codes per frame, sort left-to-right by boundingBox.x
- [ ] **Phase 6: Sound Layering & Fade** - Concurrent playback with gain nodes, fast fade-in, slow fade-out envelopes
- [ ] **Phase 7: Detection State & Cooldowns** - Track seen/exited codes, cooldown timers, re-trigger on frame re-entry
- [ ] **Phase 8: Cross-Platform** - iOS Safari WASM polyfill handling, iOS-specific fixes, fallback to rapid single-scan
- [ ] **Phase 9: Visual Feedback & Error States** - Detection indicator overlays, camera loading state, permission denial handling
- [ ] **Phase 10: Integration & Validation** - End-to-end test with printed QR codes on table, performance tuning, edge cases

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
- [ ] 02-02: Camera permissions flow — request rear camera, handle grant/deny
- [ ] 02-03: Single QR detection — display detected QR value on screen as proof of life

### Phase 3: Audio Engine Core
**Goal**: Detecting a QR code triggers a sound playing through Web Audio API
**Depends on**: Phase 2
**Research**: Likely (Web Audio API patterns — AudioContext, decodeAudioData, AudioBufferSourceNode, GainNode)
**Research topics**: Web Audio API best practices for mobile, AudioContext resume on user gesture (iOS requirement), buffer decoding patterns
**Plans**: 3 plans

Plans:
- [ ] 03-01: Create useAudioEngine hook — AudioContext setup, buffer loading, single sound playback
- [ ] 03-02: Connect QR detection to audio — detected code triggers mapped sound
- [ ] 03-03: Handle mobile audio unlock (iOS/Android require user gesture to start AudioContext)

### Phase 4: Test Content
**Goal**: 3 printable QR codes and 3 matching wind chime sounds ready for testing
**Depends on**: Phase 3
**Research**: Likely (sourcing/creating short constructive wind chime tones, QR code generation)
**Research topics**: Free wind chime sound sources (Pixabay, freesound.org), trimming audio to <5s, QR code generation tools, printable layout
**Plans**: 2 plans

Plans:
- [ ] 04-01: Source or create 3 placeholder wind chime sounds (<5s each, constructive when layered)
- [ ] 04-02: Generate 3 QR codes with unique values, create printable layout, write sounds.json mapping

### Phase 5: Multi-Code Detection
**Goal**: Camera detects 2-3 QR codes simultaneously and reports them in left-to-right order
**Depends on**: Phase 4
**Research**: Unlikely (extends Phase 2 scanner — multi-code is a config option in the library)
**Plans**: 2 plans

Plans:
- [ ] 05-01: Enable multi-code detection in scanner, handle array of detected codes
- [ ] 05-02: Sort detected codes left-to-right by boundingBox.x, trigger sounds in spatial order

### Phase 6: Sound Layering & Fade
**Goal**: Multiple sounds play concurrently with smooth layering and natural fade-out
**Depends on**: Phase 5
**Research**: Unlikely (builds on Phase 3 audio engine — gain nodes and envelope patterns)
**Plans**: 3 plans

Plans:
- [ ] 06-01: Support concurrent audio sources — multiple AudioBufferSourceNodes playing simultaneously
- [ ] 06-02: Add GainNode per sound for individual volume control
- [ ] 06-03: Implement fade envelopes — fast fade-in (~100ms), slow fade-out (~2s) using gain ramps

### Phase 7: Detection State & Cooldowns
**Goal**: QR codes can re-trigger after leaving/re-entering frame, with spam prevention
**Depends on**: Phase 6
**Research**: Unlikely (internal state management logic, no external dependencies)
**Plans**: 2 plans

Plans:
- [ ] 07-01: Detection state map — track lastPlayed timestamp and isPlaying status per QR code
- [ ] 07-02: Cooldown logic — 3s cooldown after trigger, exit detection enables re-trigger eligibility

### Phase 8: Cross-Platform
**Goal**: App works on both iOS Safari and Android Chrome
**Depends on**: Phase 7
**Research**: Likely (iOS-specific quirks — WASM polyfill behavior, Safari camera API differences)
**Research topics**: barcode-detector WASM polyfill on iOS Safari 14.5+, playsinline attribute, setInterval vs requestAnimationFrame on iOS, WASM pre-loading
**Plans**: 3 plans

Plans:
- [ ] 08-01: Verify WASM polyfill loads correctly on iOS Safari, pre-fetch binary on startup
- [ ] 08-02: iOS-specific camera fixes — playsinline, facingMode: environment, setInterval for scan timing
- [ ] 08-03: Fallback strategy — detect slow scanning, switch to rapid single-code mode on older devices

### Phase 9: Visual Feedback & Error States
**Goal**: User knows scanning is working; graceful handling of permission denial and errors
**Depends on**: Phase 8
**Research**: Unlikely (standard React UI patterns)
**Plans**: 2 plans

Plans:
- [ ] 09-01: Detection indicator — subtle glow or dot overlay on detected QR codes in camera feed
- [ ] 09-02: Error states — camera permission denied screen, loading state while WASM/audio loads

### Phase 10: Integration & Validation
**Goal**: Full working prototype tested with real printed QR codes on a table
**Depends on**: Phase 9
**Research**: Unlikely (testing and tuning, no new tech)
**Plans**: 2 plans

Plans:
- [ ] 10-01: End-to-end device test — print QR codes, test scanning + audio on Android Chrome and iOS Safari
- [ ] 10-02: Performance tuning — scan throttle adjustment, audio garbage collection, memory cleanup

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Foundation | 2/2 | Complete | 2026-02-09 |
| 2. QR Scanner Integration | 1/3 | In progress | - |
| 3. Audio Engine Core | 0/3 | Not started | - |
| 4. Test Content | 0/2 | Not started | - |
| 5. Multi-Code Detection | 0/2 | Not started | - |
| 6. Sound Layering & Fade | 0/3 | Not started | - |
| 7. Detection State & Cooldowns | 0/2 | Not started | - |
| 8. Cross-Platform | 0/3 | Not started | - |
| 9. Visual Feedback & Error States | 0/2 | Not started | - |
| 10. Integration & Validation | 0/2 | Not started | - |
