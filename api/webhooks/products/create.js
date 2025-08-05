// Vercel serverless function for handling Printify product creation
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

    console.log(`🔄 Processing Printify product: ${product.title}`);

    // Shopify Admin API configuration
    const shopifyDomain = process.env.VITE_SHOPIFY_DOMAIN;
    const adminToken = process.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    // Clean domain - remove https:// if present
    const cleanDomain = shopifyDomain?.replace('https://', '').replace('http://', '');
    const baseUrl = `https://${cleanDomain}/admin/api/2023-10/`;

    // Helper function for Shopify Admin API calls
    const shopifyAdminAPI = async (endpoint, method = 'GET', data = null) => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });
      
      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    };

    // Step 1: Get current product publications
    const publications = await shopifyAdminAPI(`products/${product.id}/publications.json`);
    console.log('Current publications:', publications);

    // Step 2: Remove from Online Store (channel_id 1)
    const onlineStorePub = publications.publications?.find(pub => pub.channel_id === 1);
    if (onlineStorePub) {
      await shopifyAdminAPI(
        `products/${product.id}/publications/${onlineStorePub.id}.json`, 
        'DELETE'
      );
      console.log('✅ Removed from Online Store');
    }

    // Step 3: Add to Hydrogen/Storefront API
    // First, get available sales channels to find Hydrogen channel ID
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
      console.log('✅ Added to Hydrogen sales channel');
    }

    // Step 4: Add to main-carousel collection (optional)
    // First find the collection by handle
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
        console.log('✅ Added to main-carousel collection');
      } catch (collectError) {
        console.log('⚠️ Collection assignment skipped (might already exist)');
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Successfully configured ${product.title}` 
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}