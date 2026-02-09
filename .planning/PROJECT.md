# Wind Chime — Companion App

## What This Is

A web app companion for a physical wind chime card game. After players build their card layout, they open this app on their phone, point the camera at their cards, and hear the sounds play live as QR codes enter the camera view. Sounds layer and fade like a real wind chime as you pan across the cards.

## Core Value

Point the camera at cards and instantly hear sounds — the "wow" moment must feel magical and work on any phone.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Live QR scanning — camera detects QR codes continuously, no button presses or confirmations
- [ ] Sound playback on detection — each QR code triggers its mapped sound instantly when detected
- [ ] Sound layering with fade — multiple sounds overlap with fast fade-in and slow fade-out
- [ ] Cross-platform — works on both iOS Safari and Android Chrome via `@yudiel/react-qr-scanner`
- [ ] Left-to-right awareness — position data from QR detection determines spatial ordering
- [ ] Cooldown system — same QR code can re-trigger after leaving/re-entering frame, with spam prevention
- [ ] Pre-loaded audio — all sounds fetched and decoded on startup for instant playback
- [ ] Placeholder sounds — 3 test sounds (wind chime tones, <5s each, constructive when layered)
- [ ] Placeholder QR codes — 3 printable test QR codes mapped to the placeholder sounds

### Out of Scope

- Pretty UI / branding — prototype only, functional over beautiful
- Recording / sharing performances — no way to save or export audio
- Sound creation or editing tools — sounds are pre-made files
- Offline / PWA support — nice for game night but not v1
- More than 3 cards — architecture should support it, but v1 tests with 3
- Native app — must be a web URL, no app store install

## Context

- **Physical game**: Players build a wind chime from cards. Each card has a QR code. The app is used at the END of a game session.
- **Sound design goal**: Sounds should be "constructive" — they sound good layered together in any combination. Short (<5s), fast fade-in, slow fade-out.
- **QR scanning research**: `@yudiel/react-qr-scanner` is the only React library that supports multi-code detection with position data on both iOS and Android. Uses native BarcodeDetector API on Android, ZXing-C++ WASM polyfill on iOS.
- **Audio approach**: Web Audio API for precise layering, gain control, and fade envelopes. `<audio>` tags can't handle concurrent layered playback reliably.
- **Sound library**: No sounds exist yet. Need to source or create 3 placeholder wind chime tones for prototyping. Pixabay has options but most are too long — need to trim or create short constructive tones.
- **QR codes**: Don't exist yet. Need to generate 3 test QR codes with unique values and provide printable versions.

## Constraints

- **No app install**: Must be a web URL opened in the phone's browser. No native app, no app store.
- **Tech stack**: React + TypeScript + Vite (consistent with Muzzy's web game stack)
- **Cross-platform**: Must work on iOS Safari 14.5+ and Android Chrome 88+
- **Camera**: Rear-facing camera in landscape orientation

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| `@yudiel/react-qr-scanner` for QR scanning | Only React lib with multi-code + position data + iOS + Android. Research eliminated all alternatives. | — Pending |
| Web Audio API for sound playback | Need precise layering, fade envelopes, concurrent playback. `<audio>` tags can't do this. | — Pending |
| 3 cards for v1 prototype | Matches game rules (3 cards per player). Architecture supports more. | — Pending |
| Sounds bundled with app (not fetched from server) | No backend needed. Keeps it simple. Pre-load on startup. | — Pending |

---
*Last updated: 2026-02-09 after initialization*
