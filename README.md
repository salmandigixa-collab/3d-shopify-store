# STRIDES Shoes — 3D storefront project

This repository contains two implementation paths:

- **`demo/`** — a standalone storefront prototype with an interactive Three.js sneaker, product filters, colour swatches, a demo cart drawer, responsive layouts, and motion effects.
- **`shopify-theme/`** — Shopify Online Store 2.0 Liquid section/theme starter with a responsive homepage, collection-driven product cards, add-to-cart forms, and newsletter form.

## Start with the standalone demo

Use a local HTTP server because the Three.js code uses JavaScript modules.

```bash
cd demo
python -m http.server 8000
```

Open http://localhost:8000. You need an internet connection for CDN-hosted Three.js, fonts, and placeholder images.

See [demo/README.md](demo/README.md) for details and limitations.

## Shopify integration

The `shopify-theme/` directory contains theme files, not a complete downloadable production theme. Merge these into a compatible Shopify Online Store 2.0 theme, retaining that theme's existing configuration, snippets, locales, and other templates. Start with [shopify-theme/README.md](shopify-theme/README.md).

## Before launch

The standalone cart and newsletter are demo-only. Product photos are placeholders. Shopify checkout, payments, shipping, tax, inventory, customer accounts, email subscriptions, analytics, privacy consent, and domain must be configured and tested before selling. The procedural Three.js sneaker is an interactive stylized model; use a licensed optimized GLB/GLTF asset if you want a photorealistic viewer.

## Repository map

```
demo/
  index.html
  styles.css
  app.js
  README.md
shopify-theme/
  layout/theme.liquid
  templates/index.json
  sections/main-sneaker-store.liquid
  assets/sneaker-store.css
  assets/sneaker-store.js
  README.md
```
