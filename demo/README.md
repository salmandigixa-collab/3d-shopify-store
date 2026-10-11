# STRIDES Shoes Pakistan — Premium 3D Storefront

A responsive sneaker storefront concept with a procedural Three.js 3D hero shoe, richer motion design, product search and category filters, eight sneaker product cards, colour swatches, favourites, and a demo shopping bag. Prices are displayed in Pakistani rupees (PKR).

## Run the standalone preview on Windows

1. Download the repository ZIP and extract it.
2. Open the extracted repository, then open the `demo` folder.
3. Click File Explorer's address bar, type `cmd`, and press Enter.
4. In Command Prompt run:

   ```bash
   python -m http.server 8000
   ```

5. Open http://localhost:8000 in your browser. Keep the Command Prompt window open while testing.

You need an internet connection for the Three.js CDN, Google Fonts, and remote product photos.

## What is included

- Dark navigation, lime accents, editorial hero layout, animated orbit graphics, floating product details, and a drag-to-rotate 3D sneaker.
- 8 sample products across running, lifestyle, training, and basketball categories, with PKR prices.
- Search, category filters, product colour selectors, favourites, add-to-bag interactions, subtotal calculation, and responsive mobile layout.
- Scroll reveals, hover transitions, subtle idle animation, and reduced-motion support.

## Important prototype notes

- The 3D hero sneaker is built from procedural geometry. It is an enhanced stylized model, not a photorealistic scanned sneaker or a licensed GLB asset.
- Product photos are remote Unsplash images and may not exactly match the sample product names or available colourways.
- Cart, favourites, and newsletter are front-end demonstrations. Checkout, stock, delivery fees, customer accounts, email collection, and payment processing are not connected.
- The Shopify theme in `shopify-theme/` is a separate starter. A live store requires importing products, configuring policies and shipping, and connecting Shopify checkout/payment settings.
