# STRIDE — animated sneaker storefront for Shopify

A responsive Shopify Online Store 2.0 homepage concept with a floating sneaker hero, cursor tilt, scroll reveals, category links, product cards, quick add-to-cart forms, technology feature panel, and newsletter signup.

## Files

- `layout/theme.liquid` — theme layout and assets
- `templates/index.json` — homepage section configuration
- `sections/main-sneaker-store.liquid` — editable storefront section
- `assets/sneaker-store.css` — styling, responsive layouts, and motion
- `assets/sneaker-store.js` — pointer tilt, scroll reveal, and mobile navigation

## Install in Shopify

1. In Shopify admin, go to **Online Store → Themes**.
2. Duplicate your current theme first, then download the duplicate as a backup.
3. This folder contains the storefront files, not a complete replacement for every file in a production theme. Copy the files into a compatible Online Store 2.0 theme, preserving its existing config, locales, snippets, and other templates. Merge the layout markup/assets if your theme already has a `theme.liquid`.
4. In the theme editor, open the homepage and add **3D sneaker storefront** if it is not already selected.
5. Choose a real collection in the section settings and ensure products have images, prices, variants, and inventory.
6. Update category URLs, policy links, brand name, copy, and product imagery before launch.

## Important notes

- The homepage uses Shopify Liquid and native Shopify product/cart/customer forms; it is not a standalone Next.js app.
- Hero and technology images currently use remote Unsplash URLs as visual placeholders. Replace them with licensed product photography hosted in Shopify Files for production.
- The featured products are read from the selected Shopify collection. The preview fallback cards appear only when the collection is empty or unavailable.
- This is a theme section/starter, not a configured Shopify store. Checkout, payments, shipping, taxes, domain, policies, and live inventory must be configured in Shopify admin.
- No third-party 3D model is required: the hero uses layered art, CSS floating motion, and pointer tilt. A true rotatable 3D shoe requires a licensed GLB/GLTF model and a WebGL viewer.
