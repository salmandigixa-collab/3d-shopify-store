export const shopifyConfig = {
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  storefrontApiVersion: '2024-01'
};

export async function getShopifyProducts() {
  if (!shopifyConfig.storefrontAccessToken || shopifyConfig.storeDomain.includes('your-store')) {
    return [];
  }

  const response = await fetch(
    `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.storefrontApiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken
      },
      body: JSON.stringify({
        query: `{
          products(first: 6) {
            edges {
              node {
                id
                title
                description
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }`
      })
    }
  );

  const data = await response.json();
  return data?.data?.products?.edges ?? [];
}
