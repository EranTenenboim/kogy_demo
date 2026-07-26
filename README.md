# Kogsy Operator Demo

Operator dashboard demo for AI-assisted tenant calls with manual takeover.

## What it shows

1. **Inbound tenant call** loads mock tenant profile and account flags.
2. **Two scripted requests**
   - Milk about to end → grocery thinking tree → add to list → morning outcall reminder
   - Foot hurts → medical assessment → physiotherapy auto-order when allowed
3. **Auto-order checks** (mocked): `autoOrderEnabled`, price ≤ max, wallet balance
4. **Operator intervene** switches the live call from AI to manual and freezes the thinking tree

All outside systems are mocked.

## Stack

- React + TypeScript + Vite
- Google Material Design via MUI

## Run

```bash
export PATH="$HOME/.local/node-v22.17.0-linux-x64/bin:$PATH"
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Deploy to Render

Blueprint file: [`render.yaml`](render.yaml) (static site on Render CDN).

1. Push this repo to GitHub/GitLab.
2. In [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect the repo and apply the Blueprint.
4. Render runs `npm ci && npm run build` and publishes `dist`.

Service name: `kogsy-operator-demo` (free plan). SPA routes rewrite to `/index.html`.

## Agent guidance

- Project skill: `.cursor/skills/kogsy-operator-demo/`
- Project rule: `.cursor/rules/kogsy-operator-demo.mdc`
