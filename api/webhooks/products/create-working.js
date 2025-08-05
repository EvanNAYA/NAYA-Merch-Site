// FULLY AUTOMATED Printify product webhook using GraphQL
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const product = req.body;
    
    // Check if product is from Printify
    if (product.vendor !== 'Printify') {
      return res.status(200).json({ message: 'Not a Printify product, skipping' });
    }

    console.log(`🔄 FULLY AUTOMATED processing: ${product.title}`);

    // Shopify configuration
    const shopifyDomain = process.env.VITE_SHOPIFY_DOMAIN;
    const adminToken = process.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
    const cleanDomain = shopifyDomain?.replace('https://', '').replace('http://', '');
    
    // Sales channel IDs (from your test results)
    const ONLINE_STORE_ID = 'gid://shopify/Publication/272748249458';
    const HYDROGEN_ID = 'gid://shopify/Publication/274804769138';
    const PRODUCT_GID = `gid://shopify/Product/${product.id}`;

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

    const actions = [];

    // STEP 1: Remove from Online Store
    console.log('📝 Step 1: Removing from Online Store...');
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
        console.log('✅ Removed from Online Store');
        actions.push('Removed from Online Store');
      } else {
        console.log('⚠️ Online Store removal had issues:', unpublishResult.publishableUnpublish.userErrors);
        actions.push('Online Store removal had issues');
      }
    } catch (unpublishError) {
      console.log('⚠️ Online Store removal failed:', unpublishError.message);
      actions.push('Online Store removal failed');
    }

    // STEP 2: Add to Hydrogen
    console.log('📝 Step 2: Adding to Hydrogen...');
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
      console.log('✅ Added to Hydrogen sales channel');
      actions.push('Added to Hydrogen sales channel');
    } else {
      throw new Error(`Hydrogen publishing failed: ${JSON.stringify(publishResult.publishablePublish.userErrors)}`);
    }

    // STEP 3: Add to main-carousel collection
    console.log('📝 Step 3: Adding to main-carousel collection...');
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
          console.log('✅ Added to main-carousel collection');
          actions.push('Added to main-carousel collection');
        } else {
          console.log('✅ Already in main-carousel collection');
          actions.push('Already in main-carousel collection');
        }
      } else {
        console.log('⚠️ main-carousel collection not found');
        actions.push('main-carousel collection not found');
      }
    } catch (collectError) {
      console.log('⚠️ Collection assignment failed:', collectError.message);
      actions.push('Collection assignment failed');
    }

    console.log('🎉 FULLY AUTOMATED processing complete!');

    return res.status(200).json({ 
      success: true, 
      message: `FULLY AUTOMATED: ${product.title} configured successfully`,
      productId: product.id,
      productTitle: product.title,
      actions: actions,
      automation: 'COMPLETE - No manual steps required!'
    });

  } catch (error) {
    console.error('❌ Automation failed:', error);
    return res.status(500).json({ 
      error: error.message,
      automation: 'FAILED - Manual intervention required'
    });
  }
}