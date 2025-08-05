import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchShopifyStorefront } from '@/lib/shopify';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartContext';
import CartSidebar from '@/components/CartSidebar';

const COLLECTION_QUERY = `
  query GetCollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      description
      image {
        url
      }
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
  }
`;

const Collection = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      try {
        const res = await fetchShopifyStorefront(COLLECTION_QUERY, { handle });
        setCollection(res.data?.collectionByHandle);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (handle) {
      fetchCollection();
    }
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-naya-hm flex items-center justify-center">
        <div className="text-naya-dg">loading collection...</div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-naya-hm flex flex-col items-center justify-center">
        <h1 className="text-3xl font-asc-m text-naya-dg mb-4">collection not found</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="text-naya-dg underline font-pg-r"
        >
          go back
        </button>
      </div>
    );
  }

  const products = collection.products.edges.map((edge: any) => ({
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
            className="flex items-center space-x-2 font-asc-r text-xl text-gray-700 hover:text-naya-lg transition-colors h-full"
          >
            <ArrowLeft size={21} color="#374151" className="transition-colors group-hover:text-naya-lg translate-y-[1px]" />
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
            className="font-asc-r text-xl text-gray-700 hover:text-naya-lg transition-colors h-full flex items-center"
            onClick={() => setIsCartSidebarOpen(true)}
            aria-label="Open cart"
          >
            cart ({cartCount})
          </button>
        </div>
      </div>

      {/* Collection Title and Breadcrumbs */}
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
            <li>
              <button 
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    window.scrollTo(0, document.body.scrollHeight * 0.6);
                  }, 100);
                }}
                className="hover:text-naya-lg transition-colors font-asc-r"
              >
                collections
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-naya-dg font-asc-m whitespace-pre-line">
              {collection.title.toLowerCase().replace(/,/g, '\n')}
            </li>
          </ol>
        </nav>
        
        {/* Collection Title */}
        <h1 className="text-4xl font-asc-b text-naya-dg mb-2 whitespace-pre-line">
          {collection.title.toLowerCase().replace(/,/g, '\n')}
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
            <p className="text-naya-dg font-asc-m">no products found in this collection.</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Collection; 