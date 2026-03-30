import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/three|@react-three/.test(id)) return 'three-vendor';
          if (id.includes('recharts')) return 'chart-vendor';
          if (/jspdf|html2canvas/.test(id)) return 'pdf-vendor';
          if (/react-dom|react-router/.test(id)) return 'react-vendor';
          if (id.includes('framer-motion')) return 'motion-vendor';
        }
      }
    }
  }
})
