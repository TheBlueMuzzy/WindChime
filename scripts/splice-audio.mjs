import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const audioDir = 'C:/Users/Muzzy/Documents/UnityProjects/WindChime/audio'
const inputFile = join(audioDir, 'freesound_community-dull-metal-windchimes-74814.mp3')
const outDir = join(audioDir, 'spliced')

const buf = readFileSync(inputFile)

// Find first MP3 frame sync word
let headerPos = 0
for (let i = 0; i < buf.length - 4; i++) {
  if (buf[i] === 0xFF && (buf[i + 1] & 0xE0) === 0xE0) {
    headerPos = i
    break
  }
}

const h = buf.readUInt32BE(headerPos)
const bitrateIndex = (h >> 12) & 0x0F
const bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
const bitrate = bitrates[bitrateIndex] * 1000
const dataSize = buf.length - headerPos
const duration = dataSize / (bitrate / 8)

console.log(`Bitrate: ${bitrate / 1000} kbps`)
console.log(`Duration: ${duration.toFixed(1)}s`)

const bytesPerSec = bitrate / 8
const chunkSec = 5
const chunkBytes = Math.floor(bytesPerSec * chunkSec)

mkdirSync(outDir, { recursive: true })

let offset = headerPos
let chunk = 1
while (offset < buf.length) {
  const end = Math.min(offset + chunkBytes, buf.length)
  const slice = buf.slice(offset, end)
  const name = `dull-metal-${String(chunk).padStart(2, '0')}.mp3`
  writeFileSync(join(outDir, name), slice)
  const secStart = ((offset - headerPos) / bytesPerSec).toFixed(1)
  const secEnd = ((end - headerPos) / bytesPerSec).toFixed(1)
  console.log(`${name} -> ${secStart}s - ${secEnd}s (${slice.length} bytes)`)
  chunk++
  offset = end
}
console.log(`\nDone! ${chunk - 1} files in audio/spliced/`)
