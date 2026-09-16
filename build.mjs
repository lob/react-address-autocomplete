import { access, rm } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { build, context } from 'esbuild'

const { values } = parseArgs({
  options: {
    watch: { type: 'boolean', short: 'w' },
    format: { type: 'string', short: 'f', multiple: true },
    minify: { type: 'boolean' },
    silent: { type: 'boolean' },
    help: { type: 'boolean', short: 'h' }
  }
})

if (values.help) {
  console.log(`Usage: npm run build -- [options]
  -f, --format <cjs,esm>  Output formats (default: cjs,esm)
      --minify           Minify the output
  -w, --watch            Rebuild on source changes
      --silent           Suppress build output
  -h, --help             Show this help`)
  process.exit(0)
}

const formats = [
  ...new Set(
    (values.format || ['cjs', 'esm']).flatMap((format) => format.split(','))
  )
]
if (formats.some((format) => !['cjs', 'esm'].includes(format))) {
  throw new Error('Supported output formats are cjs and esm')
}

await access('src/index.js')
await rm('dist', { recursive: true, force: true })

await Promise.all(
  formats.map(async (format) => {
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
      minify: values.minify,
      logLevel: values.silent ? 'silent' : 'info'
    }

    if (values.watch) {
      const watcher = await context(options)
      await watcher.watch()
    } else {
      await build(options)
    }
  })
)
