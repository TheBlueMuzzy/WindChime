/**
 * Generates a minimal 0.5s 440Hz sine wave WAV file for testing audio playback.
 * Run with: node scripts/generate-test-tone.mjs
 */
import { writeFileSync } from 'fs'

const sampleRate = 44100
const duration = 0.5 // seconds
const frequency = 440 // Hz (A4)
const numSamples = Math.floor(sampleRate * duration)
const numChannels = 1
const bitsPerSample = 16
const byteRate = sampleRate * numChannels * (bitsPerSample / 8)
const blockAlign = numChannels * (bitsPerSample / 8)
const dataSize = numSamples * numChannels * (bitsPerSample / 8)
const fileSize = 44 + dataSize // WAV header is 44 bytes

const buffer = Buffer.alloc(fileSize)
let offset = 0

// RIFF header
buffer.write('RIFF', offset); offset += 4
buffer.writeUInt32LE(fileSize - 8, offset); offset += 4
buffer.write('WAVE', offset); offset += 4

// fmt subchunk
buffer.write('fmt ', offset); offset += 4
buffer.writeUInt32LE(16, offset); offset += 4           // Subchunk1Size (PCM = 16)
buffer.writeUInt16LE(1, offset); offset += 2            // AudioFormat (PCM = 1)
buffer.writeUInt16LE(numChannels, offset); offset += 2
buffer.writeUInt32LE(sampleRate, offset); offset += 4
buffer.writeUInt32LE(byteRate, offset); offset += 4
buffer.writeUInt16LE(blockAlign, offset); offset += 2
buffer.writeUInt16LE(bitsPerSample, offset); offset += 2

// data subchunk
buffer.write('data', offset); offset += 4
buffer.writeUInt32LE(dataSize, offset); offset += 4

// Generate sine wave samples with a short fade-out at the end
const fadeOutStart = Math.floor(numSamples * 0.8) // fade out last 20%

for (let i = 0; i < numSamples; i++) {
  let amplitude = 0.5 // keep volume moderate
  // Apply fade-out envelope
  if (i >= fadeOutStart) {
    const fadeProgress = (i - fadeOutStart) / (numSamples - fadeOutStart)
    amplitude *= 1 - fadeProgress
  }
  const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude
  const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)))
  buffer.writeInt16LE(intSample, offset)
  offset += 2
}

writeFileSync('public/sounds/test-tone.wav', buffer)
console.log(`Generated test-tone.wav: ${duration}s, ${frequency}Hz, ${sampleRate}Hz sample rate, ${fileSize} bytes`)
