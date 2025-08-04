import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import CartSidebar from './CartSidebar';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import Footer from './Footer';
import { fetchShopifyStorefront } from '@/lib/shopify';

const CAROUSEL_HEIGHT = '50vh';
const CAROUSEL_MAX_WIDTH = '1125px'; // 900px * (75/60)
const ARROW_SIZE = 28;

// Map our collection names to Shopify collection handles
const COLLECTION_MAPPING = {
  'Light': 'accessories',
  'Medium': 'tees', 
  'Heavy': 'sweaters-sweatpants'
};

const SUGGESTED_PRODUCTS_QUERY = `
  query GetSuggestedProducts($collectionHandle: String!) {
    collectionByHandle(handle: $collectionHandle) {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            images(first: 10) { edges { node { url } } }
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

const ProductPage = ({ product }) => {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeError, setShowSizeError] = useState(false);
  
  // Use images from Shopify product
  const images = product.images?.edges?.map((edge) => edge.node.url) || [];
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    dragFree: false, // Disable dragFree to enable snapping
    slidesToScroll: 1,
    align: 'center' // Center the slides in the carousel
  });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  
  // Refs for dynamic carousel behavior
  const productNameRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [carouselHeight, setCarouselHeight] = useState('50vh');
  const [carouselTop, setCarouselTop] = useState(64); // header height
  const [isFooterReached, setIsFooterReached] = useState(false);
  const [carouselWidth, setCarouselWidth] = useState('50vw');
  
  // Debug: Log all available images
  console.log('Product images:', images);
  console.log('Total images count:', images.length);
  console.log('Full product object:', product);
  console.log('Product.images structure:', product.images);

  // Find the 'Size' option if it exists
  const sizeOption = product.options?.find((opt) => opt.name.toLowerCase() === 'size');
  const sizes = sizeOption ? sizeOption.values : null;

  // Carousel navigation
  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // Set up carousel event listeners
  useEffect(() => {
    if (emblaApi) {
      console.log('Embla API initialized');
      const onSelect = () => {
        setCarouselIndex(emblaApi.selectedScrollSnap());
      };
      
      emblaApi.on('select', onSelect);
      onSelect(); // Set initial index
      
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  // Fetch suggested products
  useEffect(() => {
    async function fetchSuggestedProducts() {
      setLoadingSuggested(true);
      try {
        // Determine which collection this product belongs to
        // For now, we'll use a simple approach - you can enhance this based on your product structure
        let collectionHandle = 'accessories'; // default
        
        // Try to determine collection based on product title or other attributes
        const productTitle = product.title.toLowerCase();
        if (productTitle.includes('tee') || productTitle.includes('shirt')) {
          collectionHandle = 'tees';
        } else if (productTitle.includes('sweater') || productTitle.includes('sweatpants') || productTitle.includes('hoodie')) {
          collectionHandle = 'sweaters-sweatpants';
        }

        // Fetch products from the same collection
        const res = await fetchShopifyStorefront(SUGGESTED_PRODUCTS_QUERY, { collectionHandle });
        let products = res.data?.collectionByHandle?.products?.edges || [];
        
        // Filter out the current product
        products = products.filter((edge: any) => edge.node.id !== product.id);
        
        // If we don't have enough products from the same collection, fetch random products
        if (products.length < 4) {
          const allProductsRes = await fetchShopifyStorefront(ALL_PRODUCTS_QUERY);
          const allProducts = allProductsRes.data?.products?.edges || [];
          
          // Filter out current product and products we already have
          const existingIds = new Set(products.map((p: any) => p.node.id));
          const additionalProducts = allProducts.filter((edge: any) => 
            edge.node.id !== product.id && !existingIds.has(edge.node.id)
          );
          
          // Add random products to fill the 2x2 grid
          const shuffled = additionalProducts.sort(() => 0.5 - Math.random());
          products = [...products, ...shuffled.slice(0, 4 - products.length)];
        }

        // Take only the first 4 products for 2x2 grid
        const suggested = products.slice(0, 4).map((edge: any) => ({
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

        setSuggestedProducts(suggested);
      } catch (error) {
        console.error('Error fetching suggested products:', error);
        setSuggestedProducts([]);
      } finally {
        setLoadingSuggested(false);
      }
    }

    if (product) {
      fetchSuggestedProducts();
    }
  }, [product]);

  // Dynamic carousel positioning and sizing
  useEffect(() => {
    const updateCarouselPosition = () => {
      if (productNameRef.current) {
        const productNameRect = productNameRef.current.getBoundingClientRect();
        
        // For sticky behavior: always position relative to product name
        const nameTopPosition = productNameRect.top;
        
        console.log('Updating carousel position:', {
          nameTop: nameTopPosition,
          scrollY: window.scrollY
        });
        
        // Ensure carousel doesn't go above header (64px)
        setCarouselTop(Math.max(64, nameTopPosition));
        
        // Fixed height
        setCarouselHeight('85vh');
      }
    };

    const checkFooter = () => {
      if (footerRef.current && carouselContainerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if footer is approaching
        const footerTop = footerRect.top;
        
        // If footer is visible and close to bottom, stop sticky behavior
        if (footerTop < viewportHeight && footerTop < viewportHeight - 100) {
          setIsFooterReached(true);
        } else {
          setIsFooterReached(false);
        }
      }
    };

    const handleScroll = () => {
      updateCarouselPosition();
      checkFooter();
    };

    // Initial positioning
    updateCarouselPosition();
    checkFooter();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCarouselPosition, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCarouselPosition);
    };
  }, [product]);

  const handleAddToCart = () => {
    if (sizes && !selectedSize) {
      setShowSizeError(true);
      return;
    }
    addToCart({
      id: product.id,
      name: product.title,
      price: Math.floor(Number(product.variants?.edges[0]?.node.price.amount)),
      image: images[0],
      size: sizes ? selectedSize : undefined,
    });
    setShowSizeError(false);
    setIsCartSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-naya-hm">
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
            <ArrowLeft size={21} color="#374151" className="transition-colors group-hover:text-naya-lg" />
            <span>BACK</span>
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
            CART ({cartCount})
          </button>
        </div>
      </div>
      {/* Main Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Column - Dynamic Carousel */}
        <div className="lg:relative">
          <div 
            ref={carouselContainerRef}
            className={`w-full ${isFooterReached ? 'absolute' : 'fixed'} block`}
            style={{ 
              top: isFooterReached ? 'auto' : `${carouselTop}px`,
              bottom: isFooterReached ? '10px' : '4px',
              left: 0,
              width: window.innerWidth >= 1024 ? '50vw' : '100vw', // 50vw on desktop, 100vw on mobile
              height: carouselHeight,
              maxHeight: '85vh',
              zIndex: 20
            }}
          >
            <div className="flex flex-col h-full w-full px-6">
              {/* Carousel - takes most of the space */}
              <div className="flex-1 relative w-full min-h-0">
                <div ref={emblaRef} className="overflow-hidden w-full h-full rounded-xl">
                  <div className="flex h-full">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex-shrink-0 h-full flex items-center justify-center" style={{ minWidth: '100%' }}>
                        <img 
                          src={img} 
                          alt={`${product.title} - Image ${idx + 1}`} 
                          className="max-h-full max-w-full object-contain rounded-xl" 
                          onLoad={() => console.log(`Image ${idx + 1} loaded:`, img)}
                          onError={() => console.log(`Image ${idx + 1} failed to load:`, img)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Arrows at bottom left - fixed height - only show if multiple images */}
              {images.length > 1 && (
                <div className="flex gap-4 justify-start py-4 flex-shrink-0 pl-6">
                  <button
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-naya-dg hover:bg-naya-lg transition-colors shadow"
                    onClick={scrollPrev}
                    aria-label="Previous image"
                  >
                    <ArrowLeft size={ARROW_SIZE} color="hsl(var(--naya-hm))" />
                  </button>
                  <button
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-naya-dg hover:bg-naya-lg transition-colors shadow"
                    onClick={scrollNext}
                    aria-label="Next image"
                  >
                    <ArrowLeft size={ARROW_SIZE} color="hsl(var(--naya-hm))" style={{ transform: 'rotate(180deg)' }} />
                  </button>
                  <div className="text-xs text-gray-500 flex items-center ml-4">
                    {carouselIndex + 1} / {images.length}
                  </div>
                </div>
              )}
            </div>
          </div>
          

        </div>
        
        {/* Right Column - Product Details */}
        <div className="flex flex-col px-6 pt-8">
          <h1 ref={productNameRef} className="text-3xl md:text-4xl font-asc-b text-naya-dg mb-4 text-left">{product.title}</h1>
          <div className="text-2xl md:text-3xl font-asc-m text-naya-dg mb-6 text-left">
            ${Math.floor(Number(product.variants?.edges[0]?.node.price.amount))}
          </div>
          <div className="mb-8 text-gray-700 font-pg-r text-xl leading-relaxed text-left">{product.description}</div>
          
          {/* Sizes (only if present) */}
          {sizes && sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex gap-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setShowSizeError(false); }}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-asc-m transition-colors
                      ${selectedSize === size
                        ? 'bg-naya-dg text-naya-hm border-naya-dg'
                        : 'bg-naya-hm text-naya-dg border-naya-dg hover:bg-naya-dg hover:text-naya-hm'}`}
                    style={{ outline: 'none' }}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <div className="text-red-600 text-sm font-pg-r mt-2">Please select a size to add to cart.</div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            className="w-48 py-4 rounded-lg font-pg-b text-lg transition-colors bg-naya-dg text-naya-hm hover:bg-naya-lg mb-6"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          
          {/* Product Features */}
          <div className="mb-6">
            <h3 className="text-lg font-asc-m text-naya-dg mb-3">Product Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-naya-lg rounded-full mr-3"></span>
                <span>Premium organic cotton</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-naya-lg rounded-full mr-3"></span>
                <span>Ethically made</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-naya-lg rounded-full mr-3"></span>
                <span>Designed in NYC</span>
              </div>
            </div>
          </div>

          
          {/* Suggested Products Section */}
          <div className="pb-16">
            <h2 className="text-2xl font-asc-m text-naya-dg mb-6">You Might Also Like</h2>
            {loadingSuggested ? (
              <div className="text-naya-dg">Loading suggested products...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {suggestedProducts.map((suggestedProduct) => (
                  <div key={suggestedProduct.id} className="border-2 border-naya-lg rounded-[15px] bg-white">
                    <ProductCard
                      name={suggestedProduct.name}
                      price={suggestedProduct.price}
                      image={suggestedProduct.image}
                      hoverImage={suggestedProduct.hoverImage}
                      id={suggestedProduct.id}
                      currency={suggestedProduct.currency}
                      shopifyId={suggestedProduct.shopifyId}
                      options={suggestedProduct.options}
                      variants={suggestedProduct.variants}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default ProductPage; 