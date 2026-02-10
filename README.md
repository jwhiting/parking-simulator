# Parking Simulator Engine

Top-down SUV parking simulator with accurate turning geometry, Paper.js rendering, and a playbook command system.

## Files
- `src/core.js` core vehicle model and simulator
- `src/renderer.js` Paper.js renderer
- `src/scenario.js` parallel parking playbook
- `public/index.html` browser demo
- `scripts/render.js` headless renderer for PNG output

## Browser usage
Open `public/index.html` in a local static server (ES modules require a server). The demo loads Paper.js from a CDN.

## Headless usage
Install dependencies and render a frame:

```bash
npm install
npm run render -- --step 3 --out out/frame-3.png
```

`--step` chooses how many playbook commands to apply.
