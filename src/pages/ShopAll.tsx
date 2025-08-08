import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchShopifyStorefront } from '@/lib/shopify';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartContext';
import CartSidebar from '@/components/CartSidebar';

const ALL_PRODUCTS_QUERY = `
  query GetAllProducts {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          images(first: 2) { edges { node { url } } }
          options { name values }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

const ShopAll = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetchShopifyStorefront(ALL_PRODUCTS_QUERY);
        const edges = res.data?.products?.edges || [];
        
        const mappedProducts = edges.map((edge: any) => ({
          id: edge.node.id,
          shopifyId: edge.node.id,
          name: edge.node.title,
          price: Math.floor(Number(edge.node.variants.edges[0]?.node.price.amount)),
          currency: edge.node.variants.edges[0]?.node.price.currencyCode,
          image: edge.node.images.edges[0]?.node.url,
          hoverImage: edge.node.images.edges[1]?.node.url || edge.node.images.edges[0]?.node.url,
          options: edge.node.options,
          variants: edge.node.variants.edges.map((v: any) => v.node),
        }));
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-naya-hm flex items-center justify-center">
        <div className="text-naya-dg">loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-naya-hm">
      {/* Dimming Overlay */}
      {isCartSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartSidebarOpen(false)}
        />
      )}
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartSidebarOpen} onClose={() => setIsCartSidebarOpen(false)} />
      
      {/* Header */}
      <div className="bg-naya-hm px-4 sticky top-0 z-30 shadow-lg" style={{ height: 64 }}>
        <div className="max-w-7xl mx-auto flex items-center h-full" />
        {/* Back button */}
        <div className="absolute top-0 left-0 h-full flex items-center pl-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-2 font-asc-r text-xl text-naya-dg hover:text-naya-lg transition-colors h-full"
          >
            <ArrowLeft size={21} className="translate-y-[1px]" />
            <span>back</span>
          </button>
        </div>
        {/* NAYA Logo - Center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex items-center">
          <button
            onClick={() => navigate('/')} 
            className="h-full flex items-center group"
            aria-label="Go to home page"
          >
            <div className="relative h-11 w-auto">
              <img 
                src="/NAYADarkGreen.png" 
                alt="NAYA" 
                className="h-11 w-auto transition-opacity duration-200 group-hover:opacity-0"
              />
              <img 
                src="/NAYALightGreen.png" 
                alt="NAYA" 
                className="h-11 w-auto transition-opacity duration-200 opacity-0 group-hover:opacity-100 absolute top-0 left-0"
              />
            </div>
          </button>
        </div>
        {/* Cart (N) button */}
        <div className="absolute top-0 right-0 h-full flex items-center pr-8">
          <button
            className="font-asc-r text-xl text-naya-dg hover:text-naya-lg transition-colors h-full flex items-center"
            onClick={() => setIsCartSidebarOpen(true)}
            aria-label="Open cart"
          >
            cart ({cartCount})
          </button>
        </div>
      </div>

      {/* Page Title and Breadcrumbs */}
      <div className="px-6 pt-8 pb-6">
        {/* Breadcrumbs */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm font-asc-r text-gray-600">
            <li>
              <button 
                onClick={() => navigate('/')}
                className="hover:text-naya-lg transition-colors font-asc-r"
              >
                home
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-naya-dg font-asc-m">
              shop all
            </li>
          </ol>
        </nav>
        
        {/* Page Title */}
        <h1 className="text-4xl font-asc-b text-naya-dg mb-2">
          shop all
        </h1>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        {products.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
            {products.map((product: any) => (
              <div key={product.id} className="border-2 border-naya-lg rounded-[15px] bg-white w-80 h-[500px]">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  hoverImage={product.hoverImage}
                  id={product.id}
                  currency={product.currency}
                  shopifyId={product.shopifyId}
                  options={product.options}
                  variants={product.variants}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-naya-dg font-asc-m">no products found.</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShopAll;