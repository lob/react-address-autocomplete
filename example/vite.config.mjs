import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, [
    'REACT_APP_LOB_API_KEY',
    'PUBLIC_URL',
    'PORT',
    'GENERATE_SOURCEMAP'
  ])

  return {
    base: env.PUBLIC_URL === '.' ? './' : env.PUBLIC_URL || '/',
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
      port: Number.parseInt(env.PORT, 10) || 3000
    },
    build: {
      outDir: 'build',
      sourcemap: env.GENERATE_SOURCEMAP !== 'false'
    }
  }
})
