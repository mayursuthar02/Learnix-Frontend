import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://learnix-backend-0k7c.onrender.com",
        changeOrigin: true,
        secure: false,
      }
    },
    port: 5050
  },
  build: {
    envPrefix: 'VITE_'
  }
})
