import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: '../ferramentas/qr-code',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
