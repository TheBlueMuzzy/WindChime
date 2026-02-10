# Phase 11: iPhone Testing & Fixes - Context

**Gathered:** 2026-02-10
**Status:** Ready for research

<vision>
## How This Should Work

Someone with an iPhone opens the deployed link (thebluemuzzy.github.io/WindChime/) on Safari. The full experience should just work — camera activates, QR codes get detected, sounds play. Muzzy shares the link, the tester reports what breaks, and we fix it.

The tester is lined up and ready. This is a "share the link, get feedback, fix what's broken" phase. The goal is that the core magic — point camera at cards, hear sounds — works on iPhone the same way it does on Android.

</vision>

<essential>
## What Must Be Nailed

- **Camera + QR scanning works on iOS Safari** — the scanner must detect QR codes. iOS Safari doesn't have native BarcodeDetector API, so the WASM polyfill in @yudiel/react-qr-scanner needs to kick in.
- **Sound plays reliably** — audio must actually trigger and play when codes are scanned. iOS has strict autoplay policies and AudioContext restrictions. The existing tap-to-unlock flow should handle this, but it needs real-device verification.
- **Both are equally critical** — if either scanning OR sound fails, the whole experience is broken. There's no partial success here.

</essential>

<boundaries>
## What's Out of Scope

- Pixel-perfect visual parity between Android and iOS — minor layout/font/spacing differences are fine
- The app just needs to functionally work on a modern iPhone
- No new features — this is pure compatibility testing and bug fixing

</boundaries>

<specifics>
## Specific Ideas

- Testing flow: share the GitHub Pages link with iPhone tester, get feedback, fix issues in rapid iteration
- Known risk from earlier research: iOS Safari lacks native BarcodeDetector — the @yudiel/react-qr-scanner library has a WASM polyfill, but it needs to be verified on a real device
- Existing mobile audio handling (tap-to-unlock, lazy AudioContext, deferred sound loading) was designed with iOS in mind but hasn't been tested on an actual iPhone

</specifics>

<notes>
## Additional Context

This is the final phase (11 of 11). Once iPhone works, the v1 prototype is complete. The tester is ready to go — this phase can start immediately.

The QR codes page (codes.html) should also be tested on a second device (computer or tablet) to confirm the full workflow: display codes on one screen, scan with iPhone on the other.

</notes>

---

*Phase: 11-iphone-testing*
*Context gathered: 2026-02-10*
