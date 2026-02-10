import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const audioDir = 'C:/Users/Muzzy/Documents/UnityProjects/WindChime/audio'
const outDir = join(audioDir, 'spliced')
mkdirSync(outDir, { recursive: true })

const jobs = [
  { file: 'freesound_community-windchimes-37156.mp3', prefix: 'chimes-37156', clips: 2 },
  { file: 'freesound_community-wind-chimes-no-background-noise-57238.mp3', prefix: 'no-bg-57238', chunkSec: 6 },
  { file: 'freesound_community-windchimes-2-78372.mp3', prefix: 'chimes2-78372', clips: 3 },
  { file: 'freesound_community-windchimes-1-78371.mp3', prefix: 'chimes1-78371', clips: 4 },
]

function getMP3Info(buf) {
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
  return { headerPos, bitrate, duration, bytesPerSec: bitrate / 8 }
}

for (const job of jobs) {
  const buf = readFileSync(join(audioDir, job.file))
  const { headerPos, bitrate, duration, bytesPerSec } = getMP3Info(buf)

  console.log(`\n--- ${job.file} ---`)
  console.log(`Bitrate: ${bitrate / 1000} kbps | Duration: ${duration.toFixed(1)}s`)

  // Calculate chunk size: either by fixed seconds or by dividing into N clips
  let chunkSec
  if (job.chunkSec) {
    chunkSec = job.chunkSec
  } else {
    chunkSec = duration / job.clips
  }

  const chunkBytes = Math.floor(bytesPerSec * chunkSec)
  let offset = headerPos
  let chunk = 1

  while (offset < buf.length) {
    const end = Math.min(offset + chunkBytes, buf.length)
    const slice = buf.slice(offset, end)
    const name = `${job.prefix}-${String(chunk).padStart(2, '0')}.mp3`
    writeFileSync(join(outDir, name), slice)
    const secStart = ((offset - headerPos) / bytesPerSec).toFixed(1)
    const secEnd = ((end - headerPos) / bytesPerSec).toFixed(1)
    console.log(`  ${name} -> ${secStart}s - ${secEnd}s (${slice.length} bytes)`)
    chunk++
    offset = end
  }
}

console.log('\nAll done!')
