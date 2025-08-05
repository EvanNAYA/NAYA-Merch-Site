import CollectionCard from './CollectionCard';
import { useEffect, useState } from 'react';
import { fetchShopifyStorefront } from '@/lib/shopify';
import { useShopifyStyledContent } from '@/hooks/useShopifyStyledContent';

// Map our collection names to Shopify collection handles
const COLLECTION_MAPPING = {
  'Light': 'accessories',
  'Medium': 'tees', 
  'Heavy': 'sweaters-sweatpants'
};

const COLLECTIONS_QUERY = `
  query GetCollections {
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
          image {
            url
          }
        }
      }
    }
  }
`;

const HEADER_HEIGHT_PX = 64;

const Collections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch dynamic header text from Shopify
  const { content: headerStyled, loading: headerLoading, error: headerError } = useShopifyStyledContent("collections_header");
  
  // Use fetched styled content if available, otherwise fallback to default
  const displayHeaderText = headerStyled?.text || "NAYA's Collections";
  const headerColor = headerStyled?.color;
  
  console.log('🏪 Collections header state:', {
    headerStyled,
    headerLoading,
    headerError,
    displayHeaderText,
    headerColor
  });
  
  // Show error on screen for debugging
  if (headerError) {
    console.error('🚨 COLLECTIONS HEADER ERROR:', headerError);
  }

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetchShopifyStorefront(COLLECTIONS_QUERY);
        const edges = res.data?.collections?.edges || [];
        
        // Map our collection handles to Shopify data, using actual collection titles
        const mappedCollections = Object.entries(COLLECTION_MAPPING).map(([displayName, handle]) => {
          const shopifyCollection = edges.find((edge: any) => edge.node.handle === handle);
          const originalName = shopifyCollection?.node?.title || handle;
          // Convert to lowercase and replace commas with line breaks
          const processedName = originalName.toLowerCase().replace(/,/g, '\n');
          return {
            name: processedName,
            subtitle: '', // Remove subtitle
            image: shopifyCollection?.node?.image?.url || '/CollectionsPlaceholder.jpg',
            handle: handle,
            shopifyId: shopifyCollection?.node?.id
          };
        });
        
        setCollections(mappedCollections);
      } catch (error) {
        console.error('Error fetching collections:', error);
         // Fallback to static data if Shopify fetch fails
        setCollections([
          {
            name: 'accessories',
            subtitle: '',
            image: '/CollectionsPlaceholder.jpg',
            handle: 'accessories',
          },
          {
            name: 'tees',
            subtitle: '',
            image: '/CollectionsPlaceholder.jpg',
            handle: 'tees',
          },
          {
            name: 'sweaters &\nsweatpants',
            subtitle: '',
            image: '/CollectionsPlaceholder.jpg',
            handle: 'sweaters-sweatpants',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="overflow-x-hidden w-full">
              <section
        className="pt-0 pb-16 bg-naya-hm flex flex-col justify-between overflow-x-hidden w-full"
        style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)` }}
      >
          <div className="w-full flex flex-col h-full mx-auto overflow-x-hidden">
            <div className="text-left mb-8 px-4 pt-16">
              <h2 
                className="text-4xl font-asc-m text-naya-dg mb-4"
                style={{ color: headerColor || undefined }}
              >
                {headerLoading ? "Loading..." : displayHeaderText}
              </h2>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-naya-dg">Loading collections...</div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full">
      <section
        className="pt-0 pb-16 bg-naya-hm flex flex-col justify-between overflow-x-hidden w-full min-h-[60vh] md:min-h-[calc(100vh-64px)]"
        data-collections-section
        id="collections"
      >
        <div className="w-full flex flex-col h-full mx-auto overflow-x-hidden">
          <div className="text-left mb-8 px-4 pt-16">
            <h2 className="text-4xl font-asc-m text-naya-dg mb-4">
              {headerLoading ? "Loading..." : displayHeaderText}
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center w-full py-12 pb-16 bg-naya-dg">
            <div className="flex gap-4 md:gap-8 w-full justify-start overflow-x-auto overflow-y-visible px-4 scrollbar-hide md:justify-center md:overflow-x-visible md:px-0" style={{ scrollBehavior: 'smooth', touchAction: 'pan-x pan-y' }}>
              {collections.map((collection, index) => (
                <div
                  className="min-w-[140px] max-w-[240px] md:min-w-[250px] md:max-w-[400px] flex-shrink-0 h-[45vh] md:h-[60vh] border-2 border-naya-lg p-0 rounded-[15px] overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-20 relative"
                  key={collection.handle}
                >
                  <CollectionCard
                    name={collection.name}
                    subtitle={collection.subtitle}
                    image={collection.image}
                    handle={collection.handle}
                    shopifyId={collection.shopifyId}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;
