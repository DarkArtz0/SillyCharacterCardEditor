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

## Editor workspace

The editor has a dedicated left sidebar with grouped navigation buttons and
twelve pages: Overview, Identity, Portrait Studio, Personality & Story, Opening
Messages, World & Lore, Instructions, Extensions, Character Vault, Export Card,
AI Settings, and Appearance. On mobile, the menu button opens the same sidebar
as a drawer; Escape closes it and keyboard focus stays within the open drawer.

Pages have URL fragments such as `#portrait`, `#core`, and `#export`. Refresh and
browser Back/Forward preserve the page, while character data remains in the same
local draft. Import and Save draft are always available in the top toolbar.
The Overview page shows the current character, content counts, and shortcuts.
Export Card contains PNG/JSON downloads and a live V2 JSON preview.

The default accent is sage, with five color presets and a custom color control
on the Appearance page. Existing saved accent preferences are preserved. Field
labels and writing-assistant controls have accessible names, and keyboard focus
is highlighted using the selected accent color.

The browser and Electron interfaces share the same HTML. When editing the UI,
keep `src/renderer/index.html` and `docs/index.html` synchronized. To preview the
browser build, serve `docs/` using a local static HTTP server.

## Portable build

```bash
npm run build:portable
```

The app entry point is:

- `src/main/main.js`
- `src/main/preload.js`
- `src/renderer/index.html`
