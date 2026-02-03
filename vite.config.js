import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Placeholder, handled by bypass for mocking
        bypass: (req, res) => {
          if (req.url === '/api/status') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              current: {
                inventory: { 
                  id: 'inventory', 
                  name: 'Inventory System', 
                  url: 'https://inventory.utamakorindah.com', 
                  status: 'operational', 
                  error: null, 
                  checkedAt: new Date().toISOString() 
                },
                cctv: { 
                  id: 'cctv', 
                  name: 'CCTV System', 
                  url: 'https://cctv.utamakorindah.com', 
                  status: 'operational', 
                  error: null, 
                  checkedAt: new Date().toISOString() 
                }
              },
              history: []
            }));
            return false; // Return false to bypass the proxy target
          }
        }
      }
    }
  }
})
