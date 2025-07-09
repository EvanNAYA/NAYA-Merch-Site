import ProductCard from './ProductCard';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductGrid = () => {
  const products = [
    {
      id: "1",
      name: "The Edition Hat",
      price: "18",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "2",
      name: "The Kale Camo Hoodie",
      price: "120",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "3",
      name: "The Edition Ringer Tee",
      price: "48",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "4",
      name: "The Salad Mares Tee",
      price: "35",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "5",
      name: "Organic Cotton Cap",
      price: "25",
      image: "https://images.unsplash.com/photo-1575428652377-a2d80e2040f5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "6",
      name: "Eco Friendly Tote",
      price: "15",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-0 bg-naya-hm overflow-x-hidden min-h-screen flex flex-col justify-between">
      <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 flex flex-col h-screen">
        <div className="text-left mb-8 px-4 sm:px-6 lg:px-8 pt-16">
          <h2 className="text-4xl font-asc-m text-naya-dg mb-4">Featured Products</h2>
        </div>
        <div
          className="relative flex-1 flex items-center"
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
            <div className="flex gap-6 md:gap-8 touch-pan-x px-6 md:px-8 h-[70vh] items-center">
              {products.map((product, index) => (
                <div className="min-w-[180px] max-w-[320px] md:min-w-[250px] md:max-w-[400px] flex-shrink-0 border border-black bg-naya-hm h-full flex items-center justify-center rounded-[15px]" key={index}>
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    id={product.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Filler space below carousel if needed */}
        <div className="flex-1" />
      </div>
    </section>
  );
};

export default ProductGrid;
