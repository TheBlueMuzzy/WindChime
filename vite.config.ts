import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ command }) => ({
  base: '/WindChime/',
  plugins: [
    react(),
    ...(command === 'serve' ? [basicSsl()] : []),
  ],
  server: { port: 5213, host: true },
}))
