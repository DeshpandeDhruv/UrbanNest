import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:"http://localhost:5000",
        secure:false,

      },
    },
  },
  plugins: [react()],
  envPrefix: 'VITE_', // ✅ Ensure Vite loads variables with the "VITE_" prefix
})
