import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy sends Sahilkumar's frontend API calls to Parijat's backend
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})