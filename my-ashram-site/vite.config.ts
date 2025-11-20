// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Add the server block here
  server: {
    host: '0.0.0.0', // ⬅️ This is the key change
    port: 5173,      // ⬅️ It's good practice to specify the port
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
