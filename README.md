# SillyTavern Character Card Forge

Portable desktop editor for SillyTavern character cards, built with Electron.

## Features

- Full SillyTavern V2 card editing flow
- PNG import/export with embedded `chara` metadata
- JSON import/export
- Character book editing
- Editable dark theme accent
- Optional NanoGPT-compatible API support for the wand tools
- Model discovery popup from the configured API endpoint

## Development

```bash
npm install
npm start
```

## Portable build

```bash
npm run build:portable
```

The app entry point is:

- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/index.html`
