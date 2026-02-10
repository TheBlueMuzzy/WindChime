"""
splice-chimes.py
Reads 18 Source2 mp3 files and produces 100 five-second clips with fade envelopes.
Distributes clips across sources, with remainder clips going to the longest sources.
Exports to audio/spliced2/ as Chime_001.mp3 through Chime_100.mp3 at 192kbps.
"""

import os
import sys
from pathlib import Path

# Set ffmpeg path explicitly before importing pydub
FFMPEG_DIR = r"C:\Users\Muzzy\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"
os.environ["PATH"] = FFMPEG_DIR + os.pathsep + os.environ.get("PATH", "")

from pydub import AudioSegment

# Configure pydub to find ffmpeg
AudioSegment.converter = os.path.join(FFMPEG_DIR, "ffmpeg.exe")
AudioSegment.ffprobe = os.path.join(FFMPEG_DIR, "ffprobe.exe")

# --- Configuration ---
PROJECT_ROOT = Path(r"C:\Users\Muzzy\Documents\UnityProjects\WindChime")
SOURCE_DIR = PROJECT_ROOT / "audio" / "Source2"
OUTPUT_DIR = PROJECT_ROOT / "audio" / "spliced2"
TOTAL_CLIPS = 100
CLIP_DURATION_MS = 5000
FADE_IN_MS = 200
FADE_OUT_MS = 500
BITRATE = "192k"

def main():
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Load all source files and get their durations
    source_files = sorted(SOURCE_DIR.glob("Chime_*.mp3"))
    if len(source_files) == 0:
        print("ERROR: No Chime_*.mp3 files found in audio/Source2/")
        sys.exit(1)

    print(f"Found {len(source_files)} source files in audio/Source2/")
    print()

    # Load sources and measure durations
    sources = []
    for f in source_files:
        audio = AudioSegment.from_mp3(str(f))
        sources.append({
            "name": f.stem,
            "path": f,
            "audio": audio,
            "duration_ms": len(audio),
        })
        print(f"  {f.name}: {len(audio)}ms ({len(audio)/1000:.1f}s)")

    print()

    # --- Allocate clips per source ---
    num_sources = len(sources)
    base_clips = TOTAL_CLIPS // num_sources  # 100 // 18 = 5
    remainder = TOTAL_CLIPS % num_sources     # 100 % 18 = 10

    # Sort by duration descending to give remainder clips to longest sources
    sources_by_duration = sorted(sources, key=lambda s: s["duration_ms"], reverse=True)
    longest_names = set()
    for i, s in enumerate(sources_by_duration):
        if i < remainder:
            s["clip_count"] = base_clips + 1
            longest_names.add(s["name"])
        else:
            s["clip_count"] = base_clips

    # Re-sort back to original order for sequential numbering
    sources.sort(key=lambda s: s["name"])

    total_allocated = sum(s["clip_count"] for s in sources)
    print(f"Clip allocation: {base_clips} base + {remainder} remainder = {total_allocated} total")
    print(f"Remainder clips go to longest {remainder} sources: {sorted(longest_names)}")
    print()

    # --- Extract clips ---
    clip_number = 1
    summary = []
    overlap_warnings = []

    for s in sources:
        name = s["name"]
        audio = s["audio"]
        duration = s["duration_ms"]
        count = s["clip_count"]

        clip_start_numbers = clip_number
        source_clips = []

        if count == 0:
            summary.append(f"  {name}: 0 clips (skipped)")
            continue

        # Calculate start positions
        # Available range for start positions: 0 to (duration - CLIP_DURATION_MS)
        max_start = duration - CLIP_DURATION_MS
        has_overlap = False

        if max_start <= 0:
            # Source is shorter than or equal to clip duration
            # All clips start at 0 (complete overlap)
            starts = [0] * count
            has_overlap = True
            overlap_warnings.append(
                f"  WARNING: {name} ({duration}ms) is shorter than clip duration ({CLIP_DURATION_MS}ms). "
                f"All {count} clips start at 0ms."
            )
        elif count == 1:
            # Single clip: start at the beginning
            starts = [0]
        else:
            # Evenly space start positions across available range
            step = max_start / (count - 1)
            starts = [int(round(i * step)) for i in range(count)]

            # Check for overlapping clips (next start < previous start + clip duration)
            for i in range(1, len(starts)):
                if starts[i] < starts[i-1] + CLIP_DURATION_MS:
                    has_overlap = True
                    break

            if has_overlap and max_start > 0:
                overlap_warnings.append(
                    f"  NOTE: {name} ({duration}ms) has overlapping clips "
                    f"({count} clips x {CLIP_DURATION_MS}ms > {duration}ms available)"
                )

        for start in starts:
            # Extract clip (pydub handles end-of-file gracefully by padding silence)
            clip = audio[start:start + CLIP_DURATION_MS]

            # If clip is shorter than target, pad with silence
            if len(clip) < CLIP_DURATION_MS:
                silence = AudioSegment.silent(duration=CLIP_DURATION_MS - len(clip))
                clip = clip + silence

            # Apply fade envelopes
            clip = clip.fade_in(FADE_IN_MS).fade_out(FADE_OUT_MS)

            # Export
            out_name = f"Chime_{clip_number:03d}.mp3"
            out_path = OUTPUT_DIR / out_name
            clip.export(str(out_path), format="mp3", bitrate=BITRATE)

            source_clips.append((clip_number, start, len(clip)))
            clip_number += 1

        clip_end_numbers = clip_number - 1
        overlap_flag = " [OVERLAP]" if has_overlap else ""
        summary.append(
            f"  {name} ({duration}ms): clips {clip_start_numbers:03d}-{clip_end_numbers:03d} "
            f"({count} clips){overlap_flag}"
        )

    # --- Print summary ---
    print("=" * 60)
    print("SPLICING SUMMARY")
    print("=" * 60)
    print(f"Total clips produced: {clip_number - 1}")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Clip duration: {CLIP_DURATION_MS}ms")
    print(f"Fade in: {FADE_IN_MS}ms, Fade out: {FADE_OUT_MS}ms")
    print(f"Bitrate: {BITRATE}")
    print()
    print("Source contributions:")
    for line in summary:
        print(line)

    if overlap_warnings:
        print()
        print("Overlap warnings:")
        for w in overlap_warnings:
            print(w)

    print()
    print(f"Done! {clip_number - 1} clips written to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
