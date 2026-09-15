import { rm } from 'node:fs/promises'
import { build, context } from 'esbuild'

await rm('dist', { recursive: true, force: true })

await Promise.all(
  ['cjs', 'esm'].map(async (format) => {
    const options = {
      entryPoints: ['src/index.js'],
      outfile: format === 'cjs' ? 'dist/index.js' : 'dist/index.mjs',
      format,
      bundle: true,
      packages: 'external',
      platform: 'node',
      target: 'es2017',
      loader: { '.js': 'jsx' },
      sourcemap: true,
      logLevel: 'info'
    }

    if (process.argv.includes('--watch')) {
      const watcher = await context(options)
      await watcher.watch()
    } else {
      await build(options)
    }
  })
)
