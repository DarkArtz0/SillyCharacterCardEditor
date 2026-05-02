# SillyTavern Character Card Forge

Portable desktop editor for SillyTavern character cards, built with Electron.

The renderer also ships as a browser build for GitHub Pages under [`docs/index.html`](./docs/index.html).

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

## GitHub Pages

The repository includes a static browser build in `docs/`.

- GitHub Pages source: `main` branch
- Folder: `/docs`

Browser mode keeps local draft storage, PNG/JSON import/export, and direct API access where the provider allows CORS.

## Portable build

```bash
npm run build:portable
```

The app entry point is:

- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/index.html`
