# Parking Simulator Engine

Top-down SUV parking simulator with accurate turning geometry, Paper.js rendering, and a playbook command system.

## Files
- `src/core.js` core vehicle model and simulator
- `src/renderer.js` Paper.js renderer
- `public/index.html` browser demo
- `scripts/render.js` headless renderer for PNG output

## Browser usage (Vite)
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

For a static build:

```bash
npm run build
```

Deploy the `dist/` folder to any static host. The build uses relative paths (`base: "./"`) so it can be hosted from a subfolder.

## Headless usage
Install dependencies and render a frame (headless). The headless renderer uses `canvas`,
which is listed as an optional dependency (it is skipped on some hosts).

```bash
npm install
npm run render -- --step 3 --out out/frame-3.png
```
