# Phase 12: Sound Upgrade - Context

**Gathered:** 2026-02-10
**Status:** Ready for planning

<vision>
## How This Should Work

Replace the existing 24 chime clips with 100 new clips sourced from 20 high-quality recordings in `audio/Source2/`. The process is:

1. **Duplicate detection first** — compare the 20 source files' audio waveforms to find near-identical recordings (>90% match). Report which ones are duplicates so Muzzy can manually curate before any splicing happens.

2. **After curation** — take the remaining source files and splice 100 equal-length 5-second clips from them. Even spread: 5 clips per source. If a source is shorter than 25 seconds, clips can overlap. Each clip gets a 200ms fade-in and 500ms fade-out so nothing sounds abrupt.

3. **QR codes** — generate a standard black/white QR code image for each clip. Clip = `Chime_XX.mp3`, QR = `QR_XX.png`, paired by number. QR images go in `audio/QR2/`.

4. **Delete old sounds** — remove the existing `audio/spliced/` and `public/audio/spliced/` folders entirely. New clips become THE clips.

5. **Make the app fully dynamic** — the app and codes.html should discover sounds at runtime by calling the GitHub API to list files in the repo's audio folder. Drop new files in, push to GitHub, and everything updates automatically. No more hardcoded sound lists.

</vision>

<essential>
## What Must Be Nailed

- **Duplicate detection before splicing** — must run analysis first, report results, wait for Muzzy to curate before producing clips
- **100 clean 5-second clips** with smooth fades (200ms in, 500ms out) — no harsh cuts
- **QR code generation** — one per clip, matching numbers, standard black/white, saved to `audio/QR2/`
- **Fully dynamic app** — GitHub API runtime scan of audio folder, no hardcoded file lists anywhere (app sound loading AND codes.html)

</essential>

<boundaries>
## What's Out of Scope

- Sound synthesis or effects processing — these are real recordings, just spliced
- Custom QR styling (logos, colors) — plain black/white
- Server-side anything — GitHub Pages static hosting + GitHub API for file listing
- Changing the audio playback engine (useAudioEngine.ts fade behavior, etc.)
- Mobile-specific audio fixes (that's Phase 11)

</boundaries>

<specifics>
## Specific Ideas

- Audio processing via Python scripts (pydub/librosa) — run locally, output files to `audio/spliced2/` and `audio/QR2/`
- Duplicate detection uses waveform comparison, not filename matching — flag only near-identical recordings (>90% similarity)
- Even spread: 5 clips per source file, evenly spaced through the recording, overlap allowed for short sources
- QR values follow existing pattern: clip ID (e.g. `chime-1`) that the app resolves to the audio file URL
- GitHub Contents API to list `public/audio/spliced/` at runtime — replaces any build-time manifest or hardcoded arrays
- Old `audio/spliced/` folder deleted, new clips go to `audio/spliced2/` during production, then move to `public/audio/spliced/` for deployment

</specifics>

<notes>
## Additional Context

- Source files are in `audio/Source2/` (20 files, described as "fantastic" and varied in duration)
- The existing fade envelope in useAudioEngine.ts may already be close to the desired 200ms/500ms — needs verification during implementation
- This is a two-step workflow: (1) duplicate analysis → user curation → (2) splicing + QR generation + app integration
- The app currently hardcodes chime references in multiple places — codes.html and the sound loading logic both need to switch to dynamic discovery

</notes>

---

*Phase: 12-sound-upgrade*
*Context gathered: 2026-02-10*
