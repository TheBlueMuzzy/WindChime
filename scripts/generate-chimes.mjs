/**
 * Generates 3 wind chime WAV files using additive synthesis.
 * Each chime uses a fundamental + inharmonic overtones for metallic timbre.
 * Tuned to a C major triad (C5, E5, G5) — any combination sounds consonant.
 *
 * Run with: node scripts/generate-chimes.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const SAMPLE_RATE = 44100
const BITS_PER_SAMPLE = 16
const NUM_CHANNELS = 1

// --- Chime definitions (C major triad) ---
const chimes = [
  { name: 'chime-1', freq: 523.25, duration: 2.5, decayRate: 2.0 },  // C5 — bright, clear
  { name: 'chime-2', freq: 659.25, duration: 2.2, decayRate: 2.3 },  // E5 — warm, complementary
  { name: 'chime-3', freq: 783.99, duration: 2.0, decayRate: 2.5 },  // G5 — open, airy
]

// Harmonic structure: partial number multipliers (slightly inharmonic for metallic sound)
const HARMONIC_RATIOS = [1.0, 2.01, 3.03, 4.06]
const HARMONIC_AMPS = [1.0, 0.4, 0.2, 0.1]

// Attack time in seconds
const ATTACK_TIME = 0.02 // 20ms

/**
 * Build a 16-bit PCM WAV buffer for one chime.
 */
function generateChime(freq, duration, decayRate) {
  const numSamples = Math.floor(SAMPLE_RATE * duration)
  const byteRate = SAMPLE_RATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8)
  const blockAlign = NUM_CHANNELS * (BITS_PER_SAMPLE / 8)
  const dataSize = numSamples * NUM_CHANNELS * (BITS_PER_SAMPLE / 8)
  const fileSize = 44 + dataSize // 44-byte WAV header

  const buffer = Buffer.alloc(fileSize)
  let offset = 0

  // --- RIFF header ---
  buffer.write('RIFF', offset); offset += 4
  buffer.writeUInt32LE(fileSize - 8, offset); offset += 4
  buffer.write('WAVE', offset); offset += 4

  // --- fmt subchunk ---
  buffer.write('fmt ', offset); offset += 4
  buffer.writeUInt32LE(16, offset); offset += 4            // Subchunk1Size (PCM = 16)
  buffer.writeUInt16LE(1, offset); offset += 2             // AudioFormat (PCM = 1)
  buffer.writeUInt16LE(NUM_CHANNELS, offset); offset += 2
  buffer.writeUInt32LE(SAMPLE_RATE, offset); offset += 4
  buffer.writeUInt32LE(byteRate, offset); offset += 4
  buffer.writeUInt16LE(blockAlign, offset); offset += 2
  buffer.writeUInt16LE(BITS_PER_SAMPLE, offset); offset += 2

  // --- data subchunk ---
  buffer.write('data', offset); offset += 4
  buffer.writeUInt32LE(dataSize, offset); offset += 4

  // --- Generate samples ---
  const attackSamples = Math.floor(ATTACK_TIME * SAMPLE_RATE)

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE // time in seconds

    // Attack envelope: linear ramp from 0 to 1 over ATTACK_TIME
    let envelope = 1.0
    if (i < attackSamples) {
      envelope = i / attackSamples
    }

    // Decay envelope: exponential decay
    envelope *= Math.exp(-t * decayRate)

    // Additive synthesis: sum harmonics with slight inharmonicity
    let sample = 0
    for (let h = 0; h < HARMONIC_RATIOS.length; h++) {
      const harmonicFreq = freq * HARMONIC_RATIOS[h]
      const harmonicAmp = HARMONIC_AMPS[h]
      sample += harmonicAmp * Math.sin(2 * Math.PI * harmonicFreq * t)
    }

    // Normalize by sum of harmonic amplitudes to keep peak <= 1.0
    const ampSum = HARMONIC_AMPS.reduce((a, b) => a + b, 0)
    sample = (sample / ampSum) * envelope * 0.7 // 0.7 = master volume

    // Convert to 16-bit integer
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)))
    buffer.writeInt16LE(intSample, offset)
    offset += 2
  }

  return buffer
}

// --- Main ---
const outDir = 'public/sounds'
mkdirSync(outDir, { recursive: true })

for (const chime of chimes) {
  const wav = generateChime(chime.freq, chime.duration, chime.decayRate)
  const path = `${outDir}/${chime.name}.wav`
  writeFileSync(path, wav)
  console.log(`Generated ${chime.name}.wav: ${chime.duration}s, ${chime.freq}Hz fundamental, ${wav.length} bytes`)
}

console.log('\nAll 3 chime files generated successfully.')
