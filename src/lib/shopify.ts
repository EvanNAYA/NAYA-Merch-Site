export const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
export const SHOPIFY_STOREFRONT_PUBLIC_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
export const SHOPIFY_STOREFRONT_PRIVATE_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
export const SHOPIFY_CUSTOMER_ACCOUNT_API_TOKEN = import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_API_TOKEN;
// Admin token not needed for Storefront API approach
// export const SHOPIFY_ADMIN_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;

// Example fetcher for Storefront API
export async function fetchShopifyStorefront(query: string, variables = {}, token: string = SHOPIFY_STOREFRONT_PUBLIC_TOKEN) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// Note: Admin API functions removed due to CORS restrictions in frontend applications
// For Admin API access, use a backend server or Shopify App Proxy

// Function to fetch page content from Shopify using Storefront API
export async function fetchShopifyPageContent(pageHandle: string): Promise<string> {
  try {
    console.log('🔍 Fetching page content for handle:', pageHandle);
    
    // First, let's try to list all available pages to see what we can access
    const allPagesQuery = `
      query GetAllPages {
        pages(first: 250) {
          edges {
            node {
              id
              title
              handle
              body
            }
          }
        }
      }
    `;
    
    console.log('📋 Fetching all pages first to see what\'s available...');
    const allPagesResult = await fetchShopifyStorefront(allPagesQuery);
    console.log('📋 All pages response:', allPagesResult);
    
    if (allPagesResult.data?.pages?.edges) {
      const availablePages = allPagesResult.data.pages.edges.map((edge: any) => edge.node.handle);
      console.log('📋 Available page handles:', availablePages);
    }
    
    // Now try to fetch the specific page
    const pageQuery = `
      query GetPageByHandle($handle: String!) {
        pageByHandle(handle: $handle) {
          id
          title
          body
          bodySummary
        }
      }
    `;
    
    const pageResult = await fetchShopifyStorefront(pageQuery, { handle: pageHandle });
    
    console.log('📄 Specific page API response:', pageResult);
    
    if (pageResult.errors) {
      console.error('❌ Shopify GraphQL errors:', pageResult.errors);
      throw new Error(`Failed to fetch page from Shopify: ${JSON.stringify(pageResult.errors)}`);
    }
    
    const page = pageResult.data?.pageByHandle;
    
    if (!page) {
      throw new Error(`Page with handle "${pageHandle}" not found in Shopify. Check that the page is published and visible.`);
    }
    
    console.log('✅ Page content retrieved:', page.body);
    
    // Return the page body content
    return page.body;
  } catch (error) {
    console.error('❌ Error fetching Shopify page content:', error);
    throw error;
  }
}

// Legacy file function (kept for reference, but won't work from frontend)
export async function fetchShopifyTextFile(filename: string): Promise<string> {
  throw new Error('Admin API cannot be accessed from frontend due to CORS. Use fetchShopifyPageContent instead.');
} 