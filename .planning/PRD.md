# Wind Chime — Companion App PRD

> Living document. Created via fast-track /game-prd.
> Current phase: **PRD Complete**

---

## 1. Vision & Goals

- **Elevator pitch**: A web app that turns your physical wind chime card layout into a live audio experience — point your phone camera at the cards and hear them play.
- **Target feeling**: Magical reveal moment. You built something with cards, and now it comes alive with sound.
- **Platform**: Mobile web (React/TS/Vite). Phone camera in landscape orientation.
- **Target audience**: Cozy group gamers finishing a wind chime card game session.
- **Relationship to main game**: This is a companion app, not the game itself. It's used at the end of a game session to experience the result of your card layout.

## 2. Audience & Player Personas

### Persona: The Table Group
- **Who**: 2-4 friends at a table, just finished building their wind chime layout
- **Motivation**: "I want to hear what my wind chime sounds like!"
- **Tech comfort**: Can open a web link on their phone, that's it
- **Context**: Phone comes out at the END of the game, pointed at cards on the table

### Competitive Landscape
- **QR-to-audio apps**: Exist but designed for single codes, not multi-scan layouts
- **Spotify/Shazam codes**: Single scan → single song, not layered audio
- **AR card games**: Chronicles of Crime, Mysterium Park — scan for content, not generative audio
- **Music creation toys**: Bebot, Bloom — touch-based, not card-based

### Opportunity
No existing app turns a physical card layout into a live, spatial audio experience. This is novel.

## 3. Design Principles

- **Concept**: Point, pan, listen. Zero UI friction between the cards and the sound.
- **Design principles**:
  1. **One gesture**: Point camera → hear sounds. No menus, no buttons, no steps.
  2. **Spatial = musical**: Left-to-right card order = left-to-right sound sequence. Physical position matters.
  3. **Layered, not sequential**: Sounds overlap and fade. It's a wind chime, not a playlist.
  4. **Forgiving**: Works if cards are slightly crooked, overlapping, or scanned one at a time.
  5. **Prototype-first**: Functional over pretty. We're proving the concept, not shipping to an app store.

- **MDA targets**:
  - Primary aesthetic: **Discovery** (hearing your creation come alive)
  - Secondary aesthetic: **Expression** (every layout sounds different)

- **Success criteria**:
  - Can scan 3 QR codes from a phone camera in landscape
  - Sounds play as cards enter the camera view
  - Sounds layer/overlap with fade-outs
  - Works on at least Chrome Android (iOS stretch goal)

- **Scope**:
  - **v0.1 (prototype)**: Camera → detect QR → play sounds live. Minimal UI.
  - **Deferred**: Pretty UI, iOS Safari support, more than 3 cards, volume mixing, recording/sharing.

## 4. Core Gameplay

### Core Loop (this is a companion app, so "loop" = one use session)

```
┌─────────────────────────────────────────────┐
│  Open app → Grant camera → Point at cards   │
│         ↓                                   │
│  Camera detects QR codes as they enter view │
│         ↓                                   │
│  Sounds play live (layered, with fade-out)  │
│         ↓                                   │
│  Pan camera across layout → more sounds     │
│         ↓                                   │
│  Done! Close app.                           │
└─────────────────────────────────────────────┘
```

### Session Flow (30 seconds of use)
1. **0s**: Open web app on phone, landscape mode
2. **2s**: Camera permission granted (or already cached)
3. **3s**: Camera feed visible, phone pointed at leftmost card
4. **4s**: First QR code detected → Sound 1 plays
5. **6s**: Pan right → Second QR code enters frame → Sound 2 layers in while Sound 1 still plays
6. **9s**: Pan further → Third QR code enters → Sound 3 layers in, Sound 1 fading out
7. **15s**: All sounds fading naturally. User can re-pan or point at different cards.
8. **30s**: Done. Close browser.

### Mechanics Table

| Mechanic | Dynamic | Aesthetic |
|----------|---------|-----------|
| QR detection on camera entry | Sounds trigger spatially based on pan speed | Discovery — hearing cards come alive |
| Sound layering with overlap | Multiple sounds blend into a chord/texture | Expression — every layout sounds unique |
| Fade-out over time | Sounds don't cut abruptly, they breathe | Sensation — the "wind chime" feeling |
| Pan speed = timing | Fast pan = rapid layering, slow = deliberate | Challenge (light) — exploring different pans |

### Rules
- Each QR code maps to exactly one sound file
- Scanner runs continuously (every 500ms) only after user taps to begin scanning
- A sound plays when its QR code is detected AND the sound is not already playing
- Maximum 3 sounds playing simultaneously — additional codes wait until a slot opens
- Sounds are ~5 seconds long with natural fade-out
- If a QR code leaves and re-enters the frame, it re-triggers (no cooldown — scanner dedup handles spam)
- Tapping again stops all playback immediately and disables scanning
- Left-to-right position in frame determines perceived "order" but sounds can overlap freely

## 5. Game Systems

### System: QR Scanner
- **Purpose**: Continuously scan camera feed, detect multiple QR codes per frame, report their positions
- **Tech**: `@yudiel/react-qr-scanner` → `barcode-detector` polyfill → native API (Android) or ZXing-C++ WASM (iOS)
- **Data**: Each detection → `{ rawValue: string, boundingBox: { x, y, width, height }, cornerPoints: [{x,y}...] }`
- **Key rules**:
  - Scans every 500ms (`scanDelay={500}`)
  - `allowMultiple={true}` — fires onScan every cycle while codes are visible (not just on first detection)
  - Scanner runs at all times but scan results are ignored until user taps to begin
  - Returns array of ALL detected codes with bounding box positions
  - Works on iOS Safari 14.5+ and Android Chrome 88+

### System: Sound Library
- **Purpose**: Map QR code values to sound files
- **Data**: `content/data/sounds.json` — maps QR string → sound file path
- **Key rules**:
  - Sound files stored in `public/sounds/` (or similar)
  - Each sound is ~5 seconds, pre-loaded for instant playback
  - Unknown QR codes are silently ignored

### System: Audio Playback
- **Purpose**: Play, layer, and fade sounds based on scan events
- **Tech**: Web Audio API (`useAudioEngine` hook) for precise control over layering and fading
- **Key rules**:
  - When a QR code is detected and not already playing: create audio source, play immediately
  - Hard cap: maximum 3 simultaneous sounds (`MAX_SIMULTANEOUS = 3`). Additional codes are silently skipped until a slot opens.
  - Each sound has fade-in (50ms) and fade-out (150ms) envelopes via GainNode
  - `stopAll()` immediately kills all playing sources on toggle-off
  - Gain node per sound for individual volume control
  - No cooldown system — scanner's `allowMultiple` + `isPlaying` check handles all dedup
  - Fallback timeout cleanup for mobile (in case `onended` doesn't fire)

### Balance Data
N/A — no balance needed for a companion app.

### Content Reference
- `content/data/sounds.json` — QR code → sound file mapping
- `public/sounds/` — actual audio files (.mp3 or .ogg)

## 6. Art & Audio Direction

### Visual Style
- **Purely functional prototype**
- Full-screen camera feed, no chrome
- Minimal overlay: small dot or glow on detected QR codes (so user knows it's working)
- Dark background before camera activates
- One "Allow Camera" prompt, then straight to scanning

### Audio
- **Sound files**: Provided by the physical game (wind chime tones, bells, nature sounds, etc.)
- **Playback feel**: Layered, ambient, gentle. Like an actual wind chime.
- **Fade behavior**: Each sound plays fully but fades to ~10% volume over its last 2 seconds
- **No UI sounds**: No beeps, clicks, or scan confirmations. The wind chime sounds ARE the feedback.

## 7. Technical Architecture

### Stack
- **React 18+** with TypeScript
- **Vite** for build/dev
- **`@yudiel/react-qr-scanner`** for QR scanning (wraps `barcode-detector` polyfill by Sec-ant)
- **Web Audio API** for sound playback and mixing
- No state management library needed (simple `useRef` + `useState`)

### QR Scanning Approach — Cross-Platform
```
@yudiel/react-qr-scanner (React component)
    └── barcode-detector (polyfill by Sec-ant)
         ├── Android Chrome → native BarcodeDetector API (hardware-accelerated)
         └── iOS Safari → ZXing-C++ WASM fallback (auto-detected)
```

- **Multi-code detection**: Up to 255 QR codes per frame, with `boundingBox` (x, y, width, height) and `cornerPoints` for each
- **Left-to-right ordering**: Sort detected codes by `boundingBox.x`
- **Continuous scanning**: No confirmation dialogs, scans every 500ms with `allowMultiple`
- **Camera**: `{ facingMode: 'environment' }` for rear camera

### Platform Support
| Platform | How it works | Expected scan FPS |
|----------|-------------|-------------------|
| Android Chrome 88+ | Native BarcodeDetector API | 15-30fps |
| iOS Safari 14.5+ | WASM polyfill (ZXing-C++) | 5-15fps (iPhone 12+) |
| iOS Safari (older) | WASM polyfill (no SIMD) | 2-5fps (still feels live) |

### iOS-Specific Handling
- `playsinline` attribute on video (library handles automatically)
- HTTPS required for camera access (localhost OK for dev)
- Use `setInterval` for scan timing, not `requestAnimationFrame` (iOS throttles RAF in low-power mode)
- Explicitly request `{ facingMode: 'environment' }` — some iOS devices default to front camera
- WASM binary (~919KB) fetched at runtime; pre-load on app start to avoid cold-start delay

### Fallback Strategy
If multi-code detection is too slow on older iOS devices:
- Fall back to rapid single-code scanning at 150-200ms intervals
- Track seen codes in a `Set`, play sounds as new codes appear
- Panning left-to-right still works — codes detected in spatial order

### Key Technical Decisions
- **Web Audio API over `<audio>` tags**: Need precise layering, fade envelopes, and concurrent playback. `<audio>` elements can't do this reliably.
- **`@yudiel/react-qr-scanner` over alternatives**: Only React library that supports multi-code + position data + iOS + Android. Eliminated: ZXing-JS (unmaintained, no multi-code), html5-qrcode (iOS broken), jsQR (single-code, unmaintained), Dynamsoft/Scandit ($1,371+/year).
- **Pre-load all sounds**: On app start, fetch and decode all audio buffers so playback is instant.
- **No server needed**: Fully client-side. Sound files bundled with the app.

### File Structure (planned)
```
src/
├── App.tsx              — Main app, camera + scanner layout
├── components/
│   └── CardScanner.tsx  — Scanner component (wraps @yudiel/react-qr-scanner)
├── hooks/
│   └── useAudioEngine.ts — Web Audio API: play, layer, fade sounds
├── data/
│   └── soundMap.ts      — QR code value → sound file mapping
└── types.ts             — Shared types
public/
└── sounds/              — Audio files (.mp3)
```

## 8. Milestones

### v0.1: Proof of Concept
- Camera feed in landscape
- Detect single QR code → play a sound
- Basic Web Audio API playback

### v0.2: Multi-Scan + Layering
- Detect multiple QR codes per frame
- Left-to-right position tracking
- Sound layering with overlap
- Fade-out envelopes
- Cooldown system for re-triggers

### v0.3: Polish & Edge Cases
- Pre-load all audio on startup
- Visual feedback (glow on detected codes)
- Handle camera permission denial gracefully
- iOS Safari fallback (if feasible)
- Performance tuning (scan throttle, garbage collection)

### v1.0: Ship-ready (deferred)
- Pretty UI with game branding
- Recording / sharing your wind chime performance
- Support for more than 3 cards
- Volume mixing / EQ
- Offline support (PWA)

## 9. Testing Strategy

### Manual Testing (prototype phase)
- Print 3 test QR codes, lay them on a table
- Open app on phone → verify camera activates
- Point at one card → verify sound plays
- Pan across all 3 → verify layering and timing
- Move camera away and back → verify re-trigger (handled by allowMultiple scanner behavior)
- Test on Chrome Android (primary target)

### Automated Tests (if time)
- Unit test: soundMap returns correct file for QR code
- Unit test: audio engine playSound/stopAll/isPlaying logic
- Unit test: audio engine creates/fades nodes correctly

### Quality Gates
- All 3 QR codes scan from a single landscape frame
- Sounds layer without clipping or distortion
- No crash on camera permission denial

## 10. Known Issues & Bugs
None yet — this section is updated during development.

## 11. Future Ideas
- **Recording mode**: Record your pan as a performance, share as audio file
- **Visual mode**: Show animated wind chime graphic that responds to detected cards
- **Multi-player**: Multiple phones scanning the same layout, each contributing audio
- **Card designer**: Let players design custom cards with custom sounds
- **iOS Safari**: Full support via polyfill or hybrid approach
- **Spatial audio**: Pan sounds left-right in stereo based on card position in frame

## 12. Glossary
- **QR code**: The scannable code printed on each physical wind chime card
- **Sound mapping**: The link between a specific QR code value and its audio file
- **Layering**: Multiple sounds playing simultaneously, blending together
- **Fade-out**: A sound gradually reducing in volume before stopping
- **Cooldown**: Minimum time before the same QR code can re-trigger its sound
- **Scan session**: One continuous use of the app (open → scan → close)
- **Pan**: Moving the phone camera across the card layout
