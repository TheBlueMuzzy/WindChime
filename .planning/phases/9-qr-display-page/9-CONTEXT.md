# Phase 9: QR Display Page - Context

**Gathered:** 2026-02-10
**Status:** Ready for planning

<vision>
## How This Should Work

The existing QR display page stays exactly as-is — the 3 active slots at the top with their titles and interactive behavior are untouched. Below them, with clear visual separation, a grid appears showing every QR code in the project.

This grid auto-generates from whatever sound files exist in the `/spliced` folder. Add a new .mp3? It shows up. Delete one? It disappears. No manual list to maintain. Each QR code in the grid has a title label (matching the sound file name). The grid grows and shrinks dynamically based on file count.

The grid is purely for spot-testing — point your phone at any QR code on the monitor and hear the corresponding chime. Non-interactive, just display.

</vision>

<essential>
## What Must Be Nailed

- **Auto-detect from /spliced folder** — grid must reflect whatever files exist, no hardcoded list
- **Scannable from a phone** — QR codes large enough and spaced well enough that a phone camera can pick up individual codes from a monitor screen
- **Existing page unchanged** — the 3 active slots at top stay exactly as they are

</essential>

<boundaries>
## What's Out of Scope

- No interactivity on the grid — display only, no drag/drop, no selecting, no rearranging
- No card art or styling — just QR codes with text labels, functional not pretty
- No changes to the existing 3 active slots section

</boundaries>

<specifics>
## Specific Ideas

- Clear visual space between the 3 active slots and the grid below
- Every QR code appears in the grid, including ones that are also in the active slots
- Titles on each grid item (same style as the active slot titles)

</specifics>

<notes>
## Additional Context

The /spliced folder currently has 24 sounds. The grid should handle any number — could grow as more chimes are added later. This is a development/testing tool, not a player-facing feature.

</notes>

---

*Phase: 9-qr-display-page*
*Context gathered: 2026-02-10*
