import { fetchShopifyStorefront } from './shopify';

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_PRODUCT_VARIANTS_QUERY = `
  query GetProductVariants($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 50) {
        edges {
          node {
            id
            title
            selectedOptions {
              name
              value
            }
            availableForSale
          }
        }
      }
    }
  }
`;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

async function getVariantIdForProductAndSize(productId: string, size?: string) {
  try {
    console.log(`Looking up variants for product ${productId} with size ${size}`);
    
    const response = await fetchShopifyStorefront(GET_PRODUCT_VARIANTS_QUERY, { id: productId });
    const product = response.data?.product;
    
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    const variants = product.variants.edges.map((edge: any) => edge.node);
    console.log('Available variants:', variants);

    if (!size) {
      // If no size specified, return the first available variant
      const firstVariant = variants.find((v: any) => v.availableForSale);
      if (!firstVariant) {
        throw new Error(`No available variants for product ${productId}`);
      }
      return firstVariant.id;
    }

    // Find variant that matches the size
    const matchingVariant = variants.find((variant: any) => {
      return variant.selectedOptions.some((option: any) => 
        option.name.toLowerCase() === 'size' && option.value === size
      );
    });

    if (!matchingVariant) {
      throw new Error(`No variant found for product ${productId} with size ${size}`);
    }

    if (!matchingVariant.availableForSale) {
      throw new Error(`Variant for product ${productId} with size ${size} is not available for sale`);
    }

    return matchingVariant.id;
  } catch (error) {
    console.error('Error getting variant ID:', error);
    throw error;
  }
}

export async function createShopifyCheckout(cartItems: CartItem[]) {
  try {
    console.log('=== CART CREATE DEBUG START ===');
    console.log('Creating cart for items:', cartItems);
    console.log('Environment check:', {
      domain: import.meta.env.VITE_SHOPIFY_DOMAIN,
      hasToken: !!import.meta.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
      tokenPreview: import.meta.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN?.substring(0, 10) + '...'
    });

    // Convert cart items to variant IDs
    const lineItemsPromises = cartItems.map(async (item) => {
      const variantId = await getVariantIdForProductAndSize(item.id, item.size);
      console.log(`Resolved variant ID ${variantId} for product ${item.id} size ${item.size}`);
      return {
        merchandiseId: variantId,
        quantity: item.quantity
      };
    });

    const lines = await Promise.all(lineItemsPromises);
    console.log('Final cart lines:', lines);

    const variables = {
      input: {
        lines
      }
    };

    console.log('Sending cart create mutation with variables:', variables);
    const response = await fetchShopifyStorefront(CREATE_CART_MUTATION, variables);
    console.log('Full cart API response:', JSON.stringify(response, null, 2));
    
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new Error(`GraphQL Error: ${response.errors[0].message}`);
    }

    if (response.data?.cartCreate?.userErrors?.length > 0) {
      const errors = response.data.cartCreate.userErrors;
      console.error('Cart creation errors:', errors);
      throw new Error(`Cart Error: ${errors[0].message}`);
    }

    const cart = response.data?.cartCreate?.cart;
    console.log('Final cart object:', cart);
    console.log('=== CART CREATE DEBUG END ===');
    
    // Return cart with checkoutUrl (equivalent to old checkout webUrl)
    return {
      webUrl: cart?.checkoutUrl,
      id: cart?.id,
      totalPrice: cart?.cost?.totalAmount
    };
  } catch (error) {
    console.error('=== CART CREATE ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}