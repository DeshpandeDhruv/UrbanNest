import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          secure: false,
          changeOrigin: true
        },
      },
    },
    plugins: [react()],
  }
})
