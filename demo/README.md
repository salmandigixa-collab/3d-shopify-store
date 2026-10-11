# STRIDES Shoes — standalone interactive storefront

A no-build static storefront prototype with a custom Three.js sneaker assembled from procedural 3D geometry. The hero model can be dragged to rotate and zoomed with the wheel or trackpad. It also includes a responsive navigation, product-category filters, colour swatches, a demo bag drawer, and scroll reveal animations.

## Run locally

Because this project uses JavaScript modules and an import map, open it through a local web server instead of double-clicking the HTML file.

**Python**
```bash
cd demo
python -m http.server 8000
```
Then visit http://localhost:8000.

**Node.js**
```bash
npx serve .
```
Run that command from the `demo` directory and open the local URL it prints.

The Three.js module and fonts load from CDNs, so an internet connection is needed. A WebGL-capable, up-to-date browser is recommended.

## What works in this prototype

- Interactive Three.js sneaker: drag to rotate, wheel/trackpad to zoom, reset view.
- Custom-generated 3D geometry: no external 3D model download required for the prototype.
- Responsive storefront and mobile menu.
- Product category filters and colour swatch selection.
- Client-side demo bag with quantity changes and remove actions.
- Scroll-triggered reveals and reduced-motion support.

## Prototype limitations

- Product images are remote editorial placeholders, not verified product inventory or guaranteed licensed commercial assets. Replace with your own product photography.
- The cart is stored in JavaScript memory only. Refreshing the page clears it; it does not connect to Shopify or accept payment.
- The newsletter form only displays a confirmation message and does not collect or send emails.
- Product details, sizes, inventory, tax, shipping, checkout, analytics, privacy consent, and customer accounts are not connected.
- The procedural sneaker is a stylized geometry model. For a more photorealistic product configurator, replace it with a properly licensed, optimized GLB/GLTF asset and preserve the OrbitControls setup.

## Connect to Shopify later

Recommended path:
1. Create and configure the Shopify store, products, variants/sizes, inventory, shipping, payment provider, tax settings, policies, and domain.
2. Move the storefront into a Shopify Online Store 2.0 theme or use Shopify's Storefront API with a headless frontend.
3. Replace demo product data with Shopify product/variant data.
4. Replace local cart state with Shopify cart API/cart permalinks and redirect checkout to Shopify's hosted checkout.
5. Replace the newsletter demo with Shopify's customer/newsletter form or a connected email provider.
6. Test checkout, mobile layout, keyboard accessibility, performance, image licensing, and policies before launch.

The `shopify-theme/` folder in the repository is a separate Liquid theme-section starter; it is not a complete production theme archive. Merge its section/assets into a compatible Online Store 2.0 theme.
