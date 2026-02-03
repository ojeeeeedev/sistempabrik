import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-proxy/inventory': {
        target: 'https://inventory.utamakorindah.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy\/inventory/, ''),
      },
      '/api-proxy/cctv': {
        target: 'https://cctv.utamakorindah.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy\/cctv/, ''),
      },
    }
  }
})
