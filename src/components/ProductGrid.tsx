import ProductCard from './ProductCard';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchShopifyStorefront } from '@/lib/shopify';
import { useShopifyPageContent } from '@/hooks/useShopifyTextFile';

const SHOPIFY_MAIN_CAROUSEL_HANDLE = "main-carousel";

const PRODUCT_QUERY = `
  query GetMainCarouselCollection {
    collectionByHandle(handle: "${SHOPIFY_MAIN_CAROUSEL_HANDLE}") {
      products(first: 10) {
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

const ProductGrid = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });
  const [isHovered, setIsHovered] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  // Fetch dynamic header text from Shopify
  const { content: headerText, loading: headerLoading, error: headerError } = useShopifyPageContent("productgrid_header");
  
  // Use fetched content if available, otherwise fallback to default
  const displayHeaderText = headerText || "Featured Products";
  
  console.log('🛍️ ProductGrid header state:', {
    headerText,
    headerLoading,
    headerError,
    displayHeaderText
  });
  
  // Show error on screen for debugging
  if (headerError) {
    console.error('🚨 HEADER TEXT ERROR:', headerError);
  }

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetchShopifyStorefront(PRODUCT_QUERY);
      const edges = res.data?.collectionByHandle?.products?.edges || [];
      const products = edges.map((edge: any) => ({
        id: edge.node.id,
        shopifyId: edge.node.id,
        name: edge.node.title,
        price: Math.floor(Number(edge.node.variants.edges[0]?.node.price.amount)),
        currency: edge.node.variants.edges[0]?.node.price.currencyCode,
        image: edge.node.images.edges[0]?.node.url,
        hoverImage: edge.node.images.edges[1]?.node.url || edge.node.images.edges[0]?.node.url, // Use second image or fallback to first
        options: edge.node.options,
        variants: edge.node.variants.edges.map((v: any) => v.node),
      }));
      console.log('Shopify products:', products);
      setProducts(products);
    }
    fetchProducts();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-0 bg-naya-hm overflow-x-hidden min-h-[95vh] flex flex-col justify-between">
      <div className="w-full relative flex flex-col h-screen">
        <div className="text-left mb-8 px-4 sm:px-6 lg:px-8 pt-16">
          <h2 className="text-4xl font-asc-m text-naya-dg mb-4">
            {headerLoading ? "Loading..." : displayHeaderText}
          </h2>
        </div>
        <div
          className="relative flex items-center bg-naya-dg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Carousel Arrows */}
          {isHovered && (
            <>
              <button
                className="absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-naya-lg text-naya-hm rounded-full p-2 shadow hover:scale-110 transition-all"
                onClick={scrollPrev}
                aria-label="Scroll left"
                style={{ opacity: 0.9 }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-naya-lg text-naya-hm rounded-full p-2 shadow hover:scale-110 transition-all"
                onClick={scrollNext}
                aria-label="Scroll right"
                style={{ opacity: 0.9 }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          {/* Embla Carousel */}
          <div ref={emblaRef} className="overflow-hidden w-full">
            <div className="flex gap-6 md:gap-8 touch-pan-x h-[70vh] items-center pl-6 md:pl-8 pr-6 md:pr-8" style={{ touchAction: 'pan-x pan-y' }}>
              {products.map((product, index) => (
                <div className="min-w-[60vw] sm:min-w-[40vw] md:min-w-[35vw] lg:min-w-[28vw] xl:min-w-[22vw] max-w-[75vw] sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[32vw] xl:max-w-[26vw] flex-shrink-0 border-2 border-naya-lg bg-naya-hm flex flex-col items-stretch rounded-[15px]" key={product.id}>
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
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;
