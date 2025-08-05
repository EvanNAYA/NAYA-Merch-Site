// Bulk update existing Printify products - run this once to fix current products
export default async function handler(req, res) {
  // Allow both GET and POST requests for convenience
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check - you can make this more secure
  const authKey = req.headers['x-auth-key'] || req.query.key;
  if (authKey !== process.env.BULK_UPDATE_AUTH_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Starting bulk update of Printify products...');

    // Shopify Admin API configuration
    const shopifyDomain = process.env.VITE_SHOPIFY_DOMAIN;
    const adminToken = process.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    // Clean domain - remove https:// if present
    const cleanDomain = shopifyDomain?.replace('https://', '').replace('http://', '');
    const baseUrl = `https://${cleanDomain}/admin/api/2023-10/`;
    
    console.log('🔧 Debug info:', {
      domain: cleanDomain,
      hasToken: !!adminToken,
      tokenPrefix: adminToken?.substring(0, 10) + '...',
      baseUrl
    });

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
        throw new Error(`Shopify API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return response.json();
    };

    // First, test basic API connection with shop info
    console.log('🧪 Testing API connection...');
    try {
      const shopInfo = await shopifyAdminAPI('shop.json');
      console.log('✅ API connection successful! Shop:', shopInfo.shop?.name);
    } catch (testError) {
      console.error('❌ API connection test failed:', testError.message);
      return res.status(500).json({ 
        error: 'Failed to connect to Shopify Admin API', 
        details: testError.message,
        debug: {
          domain: cleanDomain,
          hasToken: !!adminToken,
          baseUrl
        }
      });
    }

    // Get all Printify products
    console.log('📦 Fetching Printify products...');
    const products = await shopifyAdminAPI('products.json?limit=250&vendor=Printify');
    const printifyProducts = products.products || [];
    
    console.log(`📦 Found ${printifyProducts.length} Printify products`);

    const results = [];

    for (const product of printifyProducts) {
      try {
        console.log(`\n🔄 Processing: ${product.title}`);

        // Get current publications
        const publications = await shopifyAdminAPI(`products/${product.id}/publications.json`);
        
        // Remove from Online Store (channel_id 1)
        const onlineStorePub = publications.publications?.find(pub => pub.channel_id === 1);
        if (onlineStorePub) {
          await shopifyAdminAPI(
            `products/${product.id}/publications/${onlineStorePub.id}.json`, 
            'DELETE'
          );
          console.log('  ✅ Removed from Online Store');
        }

        // Add to Hydrogen/Storefront API
        const channels = await shopifyAdminAPI('publications.json');
        const hydrogenChannel = channels.publications?.find(pub => 
          pub.name?.toLowerCase().includes('hydrogen') || 
          pub.name?.toLowerCase().includes('storefront')
        );

        if (hydrogenChannel) {
          await shopifyAdminAPI(`products/${product.id}/publications.json`, 'POST', {
            publication: {
              channel_id: hydrogenChannel.channel_id,
              published: true
            }
          });
          console.log('  ✅ Added to Hydrogen sales channel');
        }

        // Add to main-carousel collection
        const collections = await shopifyAdminAPI('collections.json?handle=main-carousel');
        const mainCarouselCollection = collections.collections?.[0];
        
        if (mainCarouselCollection) {
          try {
            await shopifyAdminAPI('collects.json', 'POST', {
              collect: {
                collection_id: mainCarouselCollection.id,
                product_id: product.id
              }
            });
            console.log('  ✅ Added to main-carousel collection');
          } catch (collectError) {
            console.log('  ⚠️ Collection assignment skipped (might already exist)');
          }
        }

        results.push({
          id: product.id,
          title: product.title,
          status: 'success'
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

    console.log('\n🎉 Bulk update completed!');

    return res.status(200).json({
      success: true,
      totalProducts: printifyProducts.length,
      results: results,
      summary: {
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length
      }
    });

  } catch (error) {
    console.error('❌ Bulk update failed:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}