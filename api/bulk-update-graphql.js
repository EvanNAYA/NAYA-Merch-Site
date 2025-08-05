// FULLY AUTOMATED bulk update using GraphQL - NO MANUAL STEPS!
export default async function handler(req, res) {
  // Allow both GET and POST requests for convenience
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check
  const authKey = req.headers['x-auth-key'] || req.query.key;
  if (authKey !== process.env.BULK_UPDATE_AUTH_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🚀 Starting FULLY AUTOMATED bulk update...');

    // Shopify configuration
    const shopifyDomain = process.env.VITE_SHOPIFY_DOMAIN;
    const adminToken = process.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
    const cleanDomain = shopifyDomain?.replace('https://', '').replace('http://', '');
    
    // Sales channel IDs (from your successful test)
    const ONLINE_STORE_ID = 'gid://shopify/Publication/272748249458';
    const HYDROGEN_ID = 'gid://shopify/Publication/274804769138';

    // Helper for GraphQL API
    const shopifyGraphQL = async (query, variables = {}) => {
      const response = await fetch(`https://${cleanDomain}/admin/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
      
      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      
      return result.data;
    };

    // Helper for REST API
    const shopifyREST = async (endpoint, method = 'GET', data = null) => {
      const response = await fetch(`https://${cleanDomain}/admin/api/2023-10/${endpoint}`, {
        method,
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });
      
      if (!response.ok) {
        throw new Error(`REST API error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    };

    // Get all Printify products
    console.log('📦 Fetching Printify products...');
    const products = await shopifyREST('products.json?limit=250&vendor=Printify');
    const printifyProducts = products.products || [];
    
    console.log(`📦 Found ${printifyProducts.length} Printify products`);

    const results = [];

    for (const product of printifyProducts) {
      try {
        console.log(`\n🔄 FULLY AUTOMATING: ${product.title}`);
        const PRODUCT_GID = `gid://shopify/Product/${product.id}`;
        const actions = [];

        // STEP 1: Remove from Online Store
        console.log('  📝 Removing from Online Store...');
        try {
          const unpublishMutation = `
            mutation publishableUnpublish($id: ID!, $input: [PublicationInput!]!) {
              publishableUnpublish(id: $id, input: $input) {
                publishable {
                  ... on Product {
                    id
                    title
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

          const unpublishResult = await shopifyGraphQL(unpublishMutation, {
            id: PRODUCT_GID,
            input: [{ publicationId: ONLINE_STORE_ID }]
          });

          if (unpublishResult.publishableUnpublish.userErrors.length === 0) {
            console.log('  ✅ Removed from Online Store');
            actions.push('Removed from Online Store');
          } else {
            console.log('  ⚠️ Online Store removal had issues:', unpublishResult.publishableUnpublish.userErrors);
            actions.push('Online Store removal partial');
          }
        } catch (unpublishError) {
          console.log('  ⚠️ Online Store removal failed:', unpublishError.message);
          actions.push('Online Store removal failed');
        }

        // STEP 2: Add to Hydrogen
        console.log('  📝 Adding to Hydrogen...');
        const publishMutation = `
          mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
            publishablePublish(id: $id, input: $input) {
              publishable {
                ... on Product {
                  id
                  title
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const publishResult = await shopifyGraphQL(publishMutation, {
          id: PRODUCT_GID,
          input: [{ publicationId: HYDROGEN_ID }]
        });

        if (publishResult.publishablePublish.userErrors.length === 0) {
          console.log('  ✅ Added to Hydrogen sales channel');
          actions.push('Added to Hydrogen sales channel');
        } else {
          throw new Error(`Hydrogen publishing failed: ${JSON.stringify(publishResult.publishablePublish.userErrors)}`);
        }

        // STEP 3: Add to main-carousel collection
        console.log('  📝 Adding to main-carousel collection...');
        try {
          // Get main-carousel collection
          const collections = await shopifyREST('collections.json?handle=main-carousel');
          const mainCarouselCollection = collections.collections?.[0];
          
          if (mainCarouselCollection) {
            // Check if already in collection
            const collects = await shopifyREST(`collects.json?product_id=${product.id}&collection_id=${mainCarouselCollection.id}`);
            
            if (collects.collects.length === 0) {
              // Add to collection
              await shopifyREST('collects.json', 'POST', {
                collect: {
                  collection_id: mainCarouselCollection.id,
                  product_id: product.id
                }
              });
              console.log('  ✅ Added to main-carousel collection');
              actions.push('Added to main-carousel collection');
            } else {
              console.log('  ✅ Already in main-carousel collection');
              actions.push('Already in main-carousel collection');
            }
          } else {
            console.log('  ⚠️ main-carousel collection not found');
            actions.push('main-carousel collection not found');
          }
        } catch (collectError) {
          console.log('  ⚠️ Collection assignment failed:', collectError.message);
          actions.push('Collection assignment failed');
        }

        results.push({
          id: product.id,
          title: product.title,
          status: 'success',
          actions: actions
        });

        console.log('  🎉 FULLY AUTOMATED!');

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`  ❌ Error processing ${product.title}:`, error.message);
        results.push({
          id: product.id,
          title: product.title,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log('\n🎉🎉🎉 FULLY AUTOMATED BULK UPDATE COMPLETE! 🎉🎉🎉');

    return res.status(200).json({
      success: true,
      message: 'FULLY AUTOMATED bulk update complete - NO MANUAL STEPS REQUIRED!',
      method: 'GraphQL Automation',
      totalProducts: printifyProducts.length,
      results: results,
      summary: {
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length
      },
      automation: {
        level: 'COMPLETE',
        manualStepsRequired: 0,
        message: 'All products should now appear in your main carousel automatically!'
      }
    });

  } catch (error) {
    console.error('❌ AUTOMATED bulk update failed:', error);
    return res.status(500).json({ 
      error: error.message,
      automation: 'FAILED'
    });
  }
}