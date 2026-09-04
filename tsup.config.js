const pkg = require('./package.json')

module.exports = {
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  dts: false,
  splitting: false,
  target: 'es2017',
  esbuildOptions(options) {
    options.loader = { ...options.loader, '.js': 'jsx' }
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]
}
