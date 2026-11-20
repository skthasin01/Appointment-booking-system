import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // The backend's CORS only allows http://localhost:5173, so always use that port.
  // strictPort: fail with a clear error instead of silently moving to 5174.
  server: {
    port: 5173,
    strictPort: true,
  },
})
