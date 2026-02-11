# Parking Simulator Engine

Top-down SUV parking simulator with accurate turning geometry, wheel/body sweep projections, collision detection, and multiple driving scenarios.

## Files
- `src/core.js` core vehicle model and simulator
- `src/renderer.js` Paper.js renderer
- `src/worlds.js` world definitions (parking lots, apartment)
- `index.html` browser demo
- `vite.config.js` build config

## Local Dev
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

## Build & Deploy
Build for static hosting:

```bash
npm run build
```

Deploy the `dist/` folder to any static host. The build uses relative paths (`base: "./"`) so it can be hosted from a subfolder.
