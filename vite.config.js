import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths so the app works both at root and when hosted at /splitzy/
  base: './',
  build: {
    // Suppress chunk size warning (heic-decode is large but necessary for iPhone photos)
    chunkSizeWarningLimit: 1500,
  },
})
