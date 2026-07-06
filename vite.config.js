import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' keeps built asset paths relative so they resolve on Netlify
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
