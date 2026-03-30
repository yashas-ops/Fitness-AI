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
        manualChunks: {
          // 3D libs only loaded on Landing — keep out of main bundle
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Chart libs only loaded on Dashboard / PlanDetail
          'chart-vendor': ['recharts'],
          // PDF export only triggered on user action
          'pdf-vendor': ['jspdf', 'html2canvas'],
          // Core React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'motion-vendor': ['framer-motion'],
        }
      }
    }
  }
})
