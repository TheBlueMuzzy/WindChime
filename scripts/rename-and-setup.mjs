import { readdirSync, copyFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const projectDir = 'C:/Users/Muzzy/Documents/UnityProjects/WindChime'
const splicedDir = join(projectDir, 'audio/spliced')
const soundsDir = join(projectDir, 'public/sounds')

mkdirSync(soundsDir, { recursive: true })

// Ordered list: dull-metal first, then 37156, no-bg, 78372, 78371
const files = readdirSync(splicedDir).filter(f => f.endsWith('.mp3')).sort()

// Group by prefix for nice ordering
const groups = [
  files.filter(f => f.startsWith('dull-metal-')),
  files.filter(f => f.startsWith('chimes-37156-')),
  files.filter(f => f.startsWith('no-bg-57238-')),
  files.filter(f => f.startsWith('chimes2-78372-')),
  files.filter(f => f.startsWith('chimes1-78371-')),
]

const ordered = groups.flat()
const mapping = []

ordered.forEach((oldName, i) => {
  const num = i + 1
  const newName = `chime-${num}.mp3`
  copyFileSync(join(splicedDir, oldName), join(soundsDir, newName))
  mapping.push({ num, newName, oldName })
  console.log(`chime-${num} <- ${oldName}`)
})

console.log(`\n${mapping.length} files copied to public/sounds/`)

// Output the mapping as JSON for reference
import { writeFileSync } from 'fs'
writeFileSync(
  join(projectDir, 'audio/clip-mapping.json'),
  JSON.stringify(mapping, null, 2)
)
console.log('Mapping saved to audio/clip-mapping.json')
