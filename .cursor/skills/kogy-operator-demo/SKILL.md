---
name: kogy-operator-demo
description: >-
  Build and extend the Kogy operator demo: mock tenant inbound calls, AI
  thinking trees (grocery vs medical), auto-order account checks, and the
  operator dashboard with AI/manual intervene. Use when working on kogy_demo,
  operator dashboard, tenant calls, thinking tree, grocery/milk, foot/medical,
  physiotherapy, auto-order, or call takeover.
---

# Kogy Operator Demo

Demo for call-center operators. All external systems are mocked.

## Product flow

1. Inbound tenant call loads mock tenant profile + account flags.
2. Tenant states a request (demo scripts below).
3. AI shows user transcript + a visible thinking tree.
4. Actions run only against mocks (grocery list, schedule, physio order, wallet).
5. Operator watches AI live and can intervene → switch call to manual.

## Demo call scripts

| Call | Intent | Expected thinking path |
|------|--------|------------------------|
| Milk about to end | Grocery | Classify grocery → add milk to list → schedule morning outcall reminder |
| Foot hurts | Medical | Classify medical → assess urgency → if non-emergency, order physiotherapy when allowed |

## Auto-order rules (mock)

Before placing any paid order, check tenant account:

- `autoOrderEnabled` must be true
- Item price ≤ `maxAutoOrderPrice`
- Wallet/balance ≥ price (or payment method has funds)

If any check fails, stop auto-order and surface reason in the thinking tree / operator panel. Do not invent real payment APIs.

## Dashboard requirements

Operator must see:

- Live AI connection status (connected / thinking / acting / manual)
- Tenant profile strip (name, id, preferences, auto-order flags, balance)
- Call transcript (tenant input)
- Thinking tree (branch decisions + leaf actions)
- Proposed / completed actions
- **Intervene** control that turns the call from AI to manual

## Pricing & demo bookings

- Top nav: **Pricing** and **Book a demo** both open the pricing page (Book a demo scrolls to tiers).
- Each tier **Book a demo** opens a dialog for **email** + **phone**, then logs the lead with selected **price level** (`tierId`, `priceMonthly`) for reporting / CSV export.
- Anchors for $1,999: GoGoGrandparent (up to $409/mo consumer), After Hour Solutions ($2,000–$4,500/mo tour AI).

## Tech conventions

- React + TypeScript + Vite
- **Google Material Design only** via MUI (`@mui/material`, `@mui/icons-material`)
- Mock data in `src/mocks/`; no real telephony, EHR, or payment integrations
- Keep demo deterministic and replayable from the two scripted calls

## When extending

1. Add new intents as thinking-tree branches, not new top-level apps.
2. Keep operator intervene as a first-class control on every live call view.
3. Prefer Material components (AppBar, Drawer, TreeView patterns, Cards for interactive panels only when interaction needs a container).

## Reference

- Domain model and mock shapes: [reference.md](reference.md)
