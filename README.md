# Hazo Collab Forms

Collaboration form elements package built with ES modules.

## Package Structure

- **Root**: ES module npm package
- **test-app**: Next.js application for testing the package

## Setup

### Install Dependencies

```bash
npm install
```

This will install dependencies for both the root package and the test-app workspace.

### Build Package

```bash
npm run build
```

This compiles TypeScript to the `dist/` directory with proper ES module exports using `.js` extensions.

### Development

#### Watch Mode for Package

```bash
npm run dev:package
```

This watches for changes and rebuilds the package automatically.

#### Run Test App

```bash
npm run dev:test-app
```

This builds the package and starts the Next.js development server.

#### Build Test App

```bash
npm run build:test-app
```

This builds both the package and the test-app for production.

## Package Configuration

### TypeScript Configuration

- **tsconfig.json**: Development configuration with bundler module resolution
- **tsconfig.build.json**: Build configuration with Node16 module resolution for proper ES module output

### ES Module Exports

All export statements use explicit `.js` extensions as required for ES modules:

```typescript
export * from './lib/index.js';
export * from './components/index.js';
```

### Package Exports

The package.json includes proper exports:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## Next.js Workspace Integration

The test-app is configured to work with the workspace package:

1. **webpack alias**: Points `hazo_collab_forms` to the parent `dist/` directory
2. **module resolution**: Checks both parent and local node_modules
3. **transpilePackages**: Includes `hazo_collab_forms` in Next.js transpilation

## Configuration File

The package uses `hazo_collab_forms_config.ini` for configuration. The config file should be placed in:

1. The consuming application's root directory (preferred)
2. The package root directory (fallback for development)

## Scripts

- `npm run build` - Build the package
- `npm run dev:package` - Watch mode for package development
- `npm run dev:test-app` - Build and run test app in dev mode
- `npm run build:test-app` - Build package and test app for production
- `npm run clean` - Remove dist directory

## Module Resolution Verification

After building, verify that all exports in `dist/index.js` use `.js` extensions. The test-app successfully imports and uses the package, confirming proper ES module resolution.




