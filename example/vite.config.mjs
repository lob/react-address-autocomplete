import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'REACT_APP_LOB_API_KEY')

  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_LOB_API_KEY': JSON.stringify(
        env.REACT_APP_LOB_API_KEY || 'YOUR_API_KEY_HERE'
      )
    },
    resolve: {
      dedupe: ['react', 'react-dom']
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'build'
    }
  }
})
