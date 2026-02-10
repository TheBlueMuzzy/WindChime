# Wind Chime — Companion App

## What This Is

A web app companion for a physical wind chime card game. Players build a card layout, open this app on their phone, point the camera at their cards, and hear 100 unique chime sounds play live as QR codes enter the camera view. Sounds layer and fade like a real wind chime as you pan across the cards. Deployed at thebluemuzzy.github.io/WindChime/.

## Core Value

Point the camera at cards and instantly hear sounds — the "wow" moment must feel magical and work on any phone.

## Requirements

### Validated

- ✓ Live QR scanning — camera detects QR codes continuously, no button presses — v0.2
- ✓ Sound playback on detection — each QR code triggers its mapped sound instantly — v0.2
- ✓ Sound layering with fade — multiple sounds overlap with fast fade-in and slow fade-out — v0.2
- ✓ Pre-loaded audio — all sounds fetched and decoded on startup for instant playback — v0.2
- ✓ 100 curated wind chime sounds (upgraded from original 3 placeholder requirement) — v0.2
- ✓ QR codes display page — separate page for showing codes on screen to scan from phone — v0.2
- ✓ Dynamic sound discovery — app discovers available sounds at runtime via GitHub API — v0.2

### Active

- [ ] Cross-platform — works on iOS Safari (needs real-device testing, Phase 11 blocked)
- [ ] Left-to-right awareness — position data from QR detection determines spatial ordering (cut from v0.2, revisit if needed)

### Out of Scope

- Pretty UI / branding — prototype only, functional over beautiful
- Recording / sharing performances — no way to save or export audio
- Sound creation or editing tools — sounds are pre-made files
- Offline / PWA support — nice for game night but not v1
- Native app — must be a web URL, no app store install

## Context

Shipped v0.2 with 718 LOC TypeScript. Built in 2 days.
Tech stack: React 19 + TypeScript + Vite 7 + Web Audio API + @yudiel/react-qr-scanner.
Live at: https://thebluemuzzy.github.io/WindChime/
QR codes: https://thebluemuzzy.github.io/WindChime/codes.html

Known issue: iOS Safari doesn't support native BarcodeDetector — relies on WASM polyfill (untested on real device).

## Constraints

- **No app install**: Must be a web URL opened in the phone's browser
- **Tech stack**: React + TypeScript + Vite
- **Cross-platform**: Must work on iOS Safari 14.5+ and Android Chrome 88+
- **Camera**: Rear-facing camera

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| `@yudiel/react-qr-scanner` for QR scanning | Only React lib with multi-code + position data + iOS + Android | ✓ Good — works reliably on Android |
| Web Audio API for sound playback | Need precise layering, fade envelopes, concurrent playback | ✓ Good — smooth layered playback |
| 100 sounds from Source2 recordings | Upgraded from 3 placeholders to 100 curated clips | ✓ Good — rich variety |
| Sounds bundled with app | No backend needed. Pre-load on startup. | ✓ Good — instant playback |
| allowMultiple={true} on Scanner | Fires onScan every 500ms while codes visible. Eliminated need for cooldown system. | ✓ Good — simplified architecture |
| Max 3 simultaneous sounds | Hard cap prevents audio chaos | ✓ Good — sounds natural |
| GitHub API for dynamic discovery | App discovers sounds at runtime, no hardcoded lists | ✓ Good — scales to any number of sounds |
| manifest.json fallback | Offline/rate-limited resilience for sound discovery | ✓ Good — robust |
| Lazy AudioContext + gesture gating | Mobile browsers block autoplay — create context on first user tap | ✓ Good — works on Android |
| BASE_URL prefix for assets | GitHub Pages serves from /WindChime/ subdirectory | ✓ Good — required for production |
| Master push before deploy | GitHub API reads remote master, not gh-pages branch | ⚠️ Revisit — deploy.js should handle this |

---
*Last updated: 2026-02-10 after v0.2 milestone*
