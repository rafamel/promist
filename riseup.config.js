const { library } = require('@riseup/library');

module.exports = library(
  {
    global: {
      // Build output directory
      output: 'pkg/',
      // Enable prettier
      prettier: true,
      // Path aliases -must be set in tsconfig too
      alias: {}
    },
    build: {
      // Assets to copy
      assets: [],
      // Build types
      types: true,
      // Babel env targets
      targets: { node: '12.0.0' },
      // Build as a standard js and bundle for web
      multitarget: true,
      // Overwrite keys on package.json
      manifest: {}
    },
    tarball: {
      // Package tarball file name
      destination: null,
      // Enable monorepo dependencies inclusion in tarball
      // by setting a relative contents (build) folder
      // -must be the same for all packages
      monorepo: { contents: null }
    },
    docs: {
      // Build typedoc documentation
      build: true,
      // Documentation build folder
      destination: 'docs/',
      // Configuration overrides for typedoc
      overrides: { exclude: [] }
    },
    fix: {
      // Directories to fix
      dir: ['src/', 'test/']
    },
    lint: {
      // Run type checks
      types: true,
      // Directories to lint
      dir: ['src/', 'test/'],
      // Keywords that should output warnings
      highlight: ['fixme', 'todo', 'refactor'],
      // ESLint rules overwrites
      rules: {}
    },
    lintmd: {
      // Glob of markdown files to lint
      include: './README.md',
      // Configuration overrides for markdownlint
      overrides: {}
    },
    test: {
      // Whether to print all passed tests
      verbose: false,
      // Regex array of files to ignore
      ignore: [],
      // Array of setup files
      require: [],
      // Files to include in coverage (auto, all, or none)
      coverage: 'auto',
      // Fail when coverage is under the threshold
      threshold: 0,
      // Configuration overrides for Jest
      overrides: {}
    },
    release: {
      // Conventional commits preset
      preset: 'angular',
      // Generate changelog upon release (version bump)
      changelog: true
    },
    distribute: {
      // Push repository and tags upon distribution (publication)
      push: true
    }
  },
  {
    babel: (config) => config,
    typescript: (config) => config,
    eslint: (config) => config,
    jest: (config) => config,
    pika: (config) => config,
    typedoc: (config) => config,
    markdownlint: (config) => config
  }
);
