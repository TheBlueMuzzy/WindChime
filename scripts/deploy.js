import { execSync } from 'child_process'

console.log('Building...')
execSync('npm run build', { stdio: 'inherit' })

console.log('Deploying to GitHub Pages...')
execSync('npx gh-pages -d dist', { stdio: 'inherit' })

console.log('Done! Site will be live at https://thebluemuzzy.github.io/WindChime/')
