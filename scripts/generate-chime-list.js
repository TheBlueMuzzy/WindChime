import { readdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const splicedDir = resolve(__dirname, '..', 'audio', 'spliced2')
const outFile = resolve(__dirname, '..', 'public', 'chime-data.js')

const files = readdirSync(splicedDir)
  .filter(f => f.endsWith('.mp3') || f.endsWith('.wav'))
  .map(f => f.replace(/\.(mp3|wav)$/, ''))
  .sort()

const js = `// Auto-generated from audio/spliced2/ — do not edit manually\nwindow.CHIME_IDS = ${JSON.stringify(files, null, 2)};\n`

writeFileSync(outFile, js)
console.log(`Generated chime-data.js with ${files.length} chimes`)
