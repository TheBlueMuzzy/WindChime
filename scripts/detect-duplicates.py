"""
Duplicate Detection Script for Wind Chime Source Audio
======================================================
Compares all pairs of mp3 files in audio/Source2/ using MFCC features
(mel-frequency cepstral coefficients) to find near-identical recordings.

MFCC comparison is more robust than raw waveform correlation because it
captures tonal/timbral similarity rather than exact sample alignment.

Usage:
    python3 scripts/detect-duplicates.py
"""

import os
import sys
import numpy as np
import librosa
from itertools import combinations

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(PROJECT_ROOT, "audio", "Source2")
NEAR_IDENTICAL_THRESHOLD = 0.90   # >90% = near-identical
WORTH_REVIEWING_THRESHOLD = 0.70  # 70-90% = worth reviewing
N_MFCC = 13                       # number of MFCC coefficients
SR = 22050                        # sample rate for loading


def load_mfcc(filepath):
    """Load an audio file and extract MFCC features."""
    y, sr = librosa.load(filepath, sr=SR, mono=True)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=N_MFCC)
    return mfcc


def cosine_similarity_mfcc(mfcc_a, mfcc_b):
    """
    Compute cosine similarity between two MFCC matrices.

    Handles different-length files by trimming to the shorter duration.
    Returns a single similarity score in [0, 1].
    """
    # Trim to the shorter file's length (number of time frames)
    min_frames = min(mfcc_a.shape[1], mfcc_b.shape[1])
    a = mfcc_a[:, :min_frames]
    b = mfcc_b[:, :min_frames]

    # Flatten to 1D vectors and compute cosine similarity
    a_flat = a.flatten()
    b_flat = b.flatten()

    dot = np.dot(a_flat, b_flat)
    norm_a = np.linalg.norm(a_flat)
    norm_b = np.linalg.norm(b_flat)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(dot / (norm_a * norm_b))


def main():
    # Collect mp3 files
    files = sorted([
        f for f in os.listdir(AUDIO_DIR)
        if f.lower().endswith(".mp3")
    ])

    if not files:
        print(f"No mp3 files found in {AUDIO_DIR}")
        sys.exit(1)

    print(f"Loading {len(files)} audio files from {AUDIO_DIR}...")
    print()

    # Load MFCC features for each file
    mfcc_cache = {}
    for f in files:
        filepath = os.path.join(AUDIO_DIR, f)
        try:
            mfcc_cache[f] = load_mfcc(filepath)
            duration = mfcc_cache[f].shape[1] * 512 / SR  # approximate duration
            print(f"  Loaded {f} ({duration:.1f}s)")
        except Exception as e:
            print(f"  ERROR loading {f}: {e}")

    print()

    # Compare all pairs
    near_identical = []  # >90%
    worth_reviewing = []  # 70-90%

    pairs = list(combinations(mfcc_cache.keys(), 2))
    print(f"Comparing {len(pairs)} pairs...")
    print()

    for file_a, file_b in pairs:
        sim = cosine_similarity_mfcc(mfcc_cache[file_a], mfcc_cache[file_b])

        if sim > NEAR_IDENTICAL_THRESHOLD:
            near_identical.append((file_a, file_b, sim))
        elif sim > WORTH_REVIEWING_THRESHOLD:
            worth_reviewing.append((file_a, file_b, sim))

    # -------------------------------------------------------------------
    # Report
    # -------------------------------------------------------------------
    print("=" * 60)
    print("DUPLICATE DETECTION REPORT")
    print("=" * 60)
    print()

    # Near-identical pairs (>90%)
    if near_identical:
        near_identical.sort(key=lambda x: x[2], reverse=True)
        print(f"NEAR-IDENTICAL PAIRS (>{NEAR_IDENTICAL_THRESHOLD*100:.0f}% similarity):")
        print("-" * 50)
        for file_a, file_b, sim in near_identical:
            print(f"  {file_a}  <->  {file_b}  :  {sim*100:.1f}%")
        print()
    else:
        print(f"No near-identical pairs found (>{NEAR_IDENTICAL_THRESHOLD*100:.0f}% similarity).")
        print()

    # Worth reviewing (70-90%)
    if worth_reviewing:
        worth_reviewing.sort(key=lambda x: x[2], reverse=True)
        print(f"WORTH REVIEWING ({WORTH_REVIEWING_THRESHOLD*100:.0f}%-{NEAR_IDENTICAL_THRESHOLD*100:.0f}% similarity):")
        print("-" * 50)
        for file_a, file_b, sim in worth_reviewing:
            print(f"  {file_a}  <->  {file_b}  :  {sim*100:.1f}%")
        print()
    else:
        print(f"No pairs in the {WORTH_REVIEWING_THRESHOLD*100:.0f}%-{NEAR_IDENTICAL_THRESHOLD*100:.0f}% range.")
        print()

    # Summary
    print("=" * 60)
    # Count unique files involved in near-identical pairs
    dup_files = set()
    for file_a, file_b, _ in near_identical:
        dup_files.add(file_a)
        dup_files.add(file_b)

    if near_identical:
        print(f"SUMMARY: {len(near_identical)} near-identical pair(s) found,")
        print(f"         involving {len(dup_files)} files.")
        print(f"         Review and remove duplicates before splicing.")
    else:
        print(f"SUMMARY: No duplicates detected. All {len(files)} files are distinct.")
        print(f"         Ready to proceed with splicing.")
    print("=" * 60)


if __name__ == "__main__":
    main()
