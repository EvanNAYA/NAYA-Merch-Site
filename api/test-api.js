// Simple API test to debug Shopify Admin API connection
export default async function handler(req, res) {
  try {
    // Shopify Admin API configuration
    const shopifyDomain = process.env.VITE_SHOPIFY_DOMAIN;
    const adminToken = process.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    // Clean domain - remove https:// if present
    const cleanDomain = shopifyDomain?.replace('https://', '').replace('http://', '');
    const baseUrl = `https://${cleanDomain}/admin/api/2023-10/`;
    
    console.log('🔧 Testing API with:', {
      domain: cleanDomain,
      hasToken: !!adminToken,
      tokenPrefix: adminToken?.substring(0, 10) + '...',
      baseUrl
    });

    // Helper function for Shopify Admin API calls
    const shopifyAdminAPI = async (endpoint, method = 'GET') => {
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log(`🌐 Testing: ${method} ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method,
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`📡 Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error body:`, errorText);
        return { error: `${response.status} ${response.statusText}`, body: errorText };
      }
      
      return await response.json();
    };

    const tests = [];

    // Test 1: Shop info
    console.log('\n🧪 Test 1: Shop Info');
    const shopTest = await shopifyAdminAPI('shop.json');
    tests.push({
      test: 'Shop Info',
      endpoint: 'shop.json',
      success: !shopTest.error,
      result: shopTest.error || `Shop: ${shopTest.shop?.name}`,
      data: shopTest.error ? null : { name: shopTest.shop?.name, domain: shopTest.shop?.domain }
    });

    // Test 2: Products list
    console.log('\n🧪 Test 2: Products List');
    const productsTest = await shopifyAdminAPI('products.json?limit=5');
    tests.push({
      test: 'Products List',
      endpoint: 'products.json?limit=5',
      success: !productsTest.error,
      result: productsTest.error || `Found ${productsTest.products?.length} products`,
      data: productsTest.error ? null : productsTest.products?.map(p => ({ id: p.id, title: p.title, vendor: p.vendor }))
    });

    // Test 3: Printify products specifically
    console.log('\n🧪 Test 3: Printify Products');
    const printifyTest = await shopifyAdminAPI('products.json?vendor=Printify&limit=5');
    tests.push({
      test: 'Printify Products',
      endpoint: 'products.json?vendor=Printify&limit=5',
      success: !printifyTest.error,
      result: printifyTest.error || `Found ${printifyTest.products?.length} Printify products`,
      data: printifyTest.error ? null : printifyTest.products?.map(p => ({ id: p.id, title: p.title }))
    });

    // Test 4: Publications endpoint (if we have a product)
    if (printifyTest.products?.length > 0) {
      const testProductId = printifyTest.products[0].id;
      console.log(`\n🧪 Test 4: Publications for product ${testProductId}`);
      const publicationsTest = await shopifyAdminAPI(`products/${testProductId}/publications.json`);
      tests.push({
        test: 'Publications API',
        endpoint: `products/${testProductId}/publications.json`,
        success: !publicationsTest.error,
        result: publicationsTest.error || `Found publications`,
        data: publicationsTest.error ? null : publicationsTest
      });
    }

    // Test 5: Sales channels
    console.log('\n🧪 Test 5: Sales Channels');
    const channelsTest = await shopifyAdminAPI('publications.json');
    tests.push({
      test: 'Sales Channels',
      endpoint: 'publications.json',
      success: !channelsTest.error,
      result: channelsTest.error || `Found sales channels`,
      data: channelsTest.error ? null : channelsTest.publications?.map(p => ({ id: p.id, name: p.name, channel_id: p.channel_id }))
    });

    return res.status(200).json({
      success: true,
      message: 'API Tests Complete',
      config: {
        domain: cleanDomain,
        hasToken: !!adminToken,
        baseUrl
      },
      tests: tests,
      summary: {
        total: tests.length,
        passed: tests.filter(t => t.success).length,
        failed: tests.filter(t => !t.success).length
      }
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}