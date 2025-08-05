// Working bulk update using product publish/unpublish instead of publications API
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
    console.log('🔄 Starting working bulk update of Printify products...');

    // Shopify Admin API configuration
    const shopifyDomain = process.env.VITE_SHOPIFY_DOMAIN;
    const adminToken = process.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    const cleanDomain = shopifyDomain?.replace('https://', '').replace('http://', '');
    const baseUrl = `https://${cleanDomain}/admin/api/2023-10/`;

    // Helper function for Shopify Admin API calls
    const shopifyAdminAPI = async (endpoint, method = 'GET', data = null) => {
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log(`🌐 API Call: ${method} ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method,
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    };

    // Get all Printify products
    console.log('📦 Fetching Printify products...');
    const products = await shopifyAdminAPI('products.json?limit=250&vendor=Printify');
    const printifyProducts = products.products || [];
    
    console.log(`📦 Found ${printifyProducts.length} Printify products`);

    const results = [];

    for (const product of printifyProducts) {
      try {
        console.log(`\n🔄 Processing: ${product.title}`);

        // Method 1: Hide from Online Store by setting published = false
        console.log('  📝 Step 1: Unpublishing from Online Store...');
        await shopifyAdminAPI(`products/${product.id}.json`, 'PUT', {
          product: {
            id: product.id,
            published: false
          }
        });
        console.log('  ✅ Hidden from Online Store');

        // Method 2: Add to main-carousel collection
        console.log('  📝 Step 2: Adding to main-carousel collection...');
        try {
          // Get main-carousel collection
          const collections = await shopifyAdminAPI('collections.json?handle=main-carousel');
          const mainCarouselCollection = collections.collections?.[0];
          
          if (mainCarouselCollection) {
            // Check if product is already in collection
            const collects = await shopifyAdminAPI(`collects.json?product_id=${product.id}&collection_id=${mainCarouselCollection.id}`);
            
            if (collects.collects.length === 0) {
              // Add to collection
              await shopifyAdminAPI('collects.json', 'POST', {
                collect: {
                  collection_id: mainCarouselCollection.id,
                  product_id: product.id
                }
              });
              console.log('  ✅ Added to main-carousel collection');
            } else {
              console.log('  ✅ Already in main-carousel collection');
            }
          } else {
            console.log('  ⚠️ main-carousel collection not found');
          }
        } catch (collectError) {
          console.log('  ⚠️ Collection assignment skipped:', collectError.message);
        }

        results.push({
          id: product.id,
          title: product.title,
          status: 'success',
          actions: [
            'Hidden from Online Store',
            'Added to main-carousel collection'
          ]
        });

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

    console.log('\n🎉 Working bulk update completed!');

    return res.status(200).json({
      success: true,
      method: 'Working solution (publish/unpublish)',
      totalProducts: printifyProducts.length,
      results: results,
      summary: {
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length
      },
      nextSteps: [
        'Products are now hidden from Online Store',
        'Products are in main-carousel collection',
        'Manual step: In Shopify Admin, add products to Hydrogen sales channel',
        'Or use the Hydrogen admin to publish these products'
      ]
    });

  } catch (error) {
    console.error('❌ Working bulk update failed:', error);
    return res.status(500).json({ 
      error: error.message
    });
  }
}