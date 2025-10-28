import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@pages': resolve(__dirname, 'src/renderer/src/pages'),
        '@components': resolve(__dirname, 'src/renderer/src/components'),
        '@assets': resolve(__dirname, 'src/renderer/src/assets'),
        '@routes': resolve(__dirname, 'src/renderer/src/routes'),
        '@hooks': resolve(__dirname, 'src/renderer/src/hooks')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
