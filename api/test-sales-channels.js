// Test different methods for sales channel assignment
export default async function handler(req, res) {
  try {
    const shopifyDomain = process.env.VITE_SHOPIFY_DOMAIN;
    const adminToken = process.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    const cleanDomain = shopifyDomain?.replace('https://', '').replace('http://', '');
    const baseUrl = `https://${cleanDomain}/admin/api/2023-10/`;

    // Helper for REST API
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
        const errorText = await response.text();
        return { error: `${response.status} ${response.statusText}`, body: errorText };
      }
      
      return await response.json();
    };

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
        const errorText = await response.text();
        return { error: `${response.status} ${response.statusText}`, body: errorText };
      }
      
      return await response.json();
    };

    const tests = [];

    // Get a test product
    const products = await shopifyAdminAPI('products.json?vendor=Printify&limit=1');
    const testProduct = products.products?.[0];
    
    if (!testProduct) {
      return res.status(400).json({ error: 'No Printify products found for testing' });
    }

    console.log(`🧪 Testing with product: ${testProduct.title} (ID: ${testProduct.id})`);

    // Test 1: Publications endpoint (we know this fails)
    console.log('\n🧪 Test 1: Publications API');
    const pubTest = await shopifyAdminAPI(`products/${testProduct.id}/publications.json`);
    tests.push({
      method: 'REST Publications',
      endpoint: `products/${testProduct.id}/publications.json`,
      success: !pubTest.error,
      result: pubTest.error || 'Success',
      data: pubTest.error ? null : pubTest
    });

    // Test 2: GraphQL Product Publications
    console.log('\n🧪 Test 2: GraphQL Product Publications');
    const gqlProductQuery = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          publications(first: 10) {
            edges {
              node {
                publication {
                  id
                  name
                }
                publishDate
              }
            }
          }
        }
      }
    `;
    
    const gqlProdTest = await shopifyGraphQL(gqlProductQuery, { 
      id: `gid://shopify/Product/${testProduct.id}` 
    });
    tests.push({
      method: 'GraphQL Product Publications',
      query: 'product.publications',
      success: !gqlProdTest.error && !gqlProdTest.data?.errors,
      result: gqlProdTest.error || (gqlProdTest.data?.errors ? JSON.stringify(gqlProdTest.data.errors) : 'Success'),
      data: gqlProdTest.error ? null : gqlProdTest.data
    });

    // Test 3: GraphQL Publications List
    console.log('\n🧪 Test 3: GraphQL Publications List');
    const gqlPubsQuery = `
      query getPublications {
        publications(first: 10) {
          edges {
            node {
              id
              name
              app {
                id
                title
              }
            }
          }
        }
      }
    `;
    
    const gqlPubsTest = await shopifyGraphQL(gqlPubsQuery);
    tests.push({
      method: 'GraphQL Publications List',
      query: 'publications',
      success: !gqlPubsTest.error && !gqlPubsTest.data?.errors,
      result: gqlPubsTest.error || (gqlPubsTest.data?.errors ? JSON.stringify(gqlPubsTest.data.errors) : 'Success'),
      data: gqlPubsTest.error ? null : gqlPubsTest.data
    });

    // Test 4: Try to publish to specific channel via GraphQL
    console.log('\n🧪 Test 4: GraphQL Publish Product');
    const publishMutation = `
      mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            ... on Product {
              id
              title
            }
          }
          shop {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Try to publish to the first Hydrogen channel we found
    const hydrogenChannelId = '274804736370'; // From your test results
    const publishTest = await shopifyGraphQL(publishMutation, {
      id: `gid://shopify/Product/${testProduct.id}`,
      input: [{
        publicationId: `gid://shopify/Publication/${hydrogenChannelId}`
      }]
    });
    
    tests.push({
      method: 'GraphQL Publish Product',
      mutation: 'publishablePublish',
      success: !publishTest.error && !publishTest.data?.errors && !publishTest.data?.publishablePublish?.userErrors?.length,
      result: publishTest.error || 
              (publishTest.data?.errors ? JSON.stringify(publishTest.data.errors) : 
               (publishTest.data?.publishablePublish?.userErrors?.length ? JSON.stringify(publishTest.data.publishablePublish.userErrors) : 'Success')),
      data: publishTest.error ? null : publishTest.data
    });

    // Test 5: REST Product update with publications
    console.log('\n🧪 Test 5: REST Product Update');
    const updateTest = await shopifyAdminAPI(`products/${testProduct.id}.json`, 'PUT', {
      product: {
        id: testProduct.id,
        published: true,
        published_scope: 'global' // Try global instead of web
      }
    });
    
    tests.push({
      method: 'REST Product Update',
      endpoint: `products/${testProduct.id}.json`,
      success: !updateTest.error,
      result: updateTest.error || 'Success',
      data: updateTest.error ? null : updateTest.product
    });

    return res.status(200).json({
      success: true,
      message: 'Sales Channel Tests Complete',
      testProduct: {
        id: testProduct.id,
        title: testProduct.title
      },
      tests: tests,
      summary: {
        total: tests.length,
        passed: tests.filter(t => t.success).length,
        failed: tests.filter(t => !t.success).length
      },
      availableChannels: [
        { id: '272748249458', name: 'Online Store' },
        { id: '274804736370', name: 'Hydrogen' },
        { id: '274804769138', name: 'Hydrogen' }
      ]
    });

  } catch (error) {
    console.error('❌ Sales channel test failed:', error);
    return res.status(500).json({ 
      error: error.message
    });
  }
}