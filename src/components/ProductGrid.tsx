
import ProductCard from './ProductCard';

const ProductGrid = () => {
  const products = [
    {
      name: "The Edition Hat",
      price: "18",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "The Kale Camo Hoodie",
      price: "120",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "The Edition Ringer Tee",
      price: "48",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "The Salad Mares Tee",
      price: "35",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Organic Cotton Cap",
      price: "25",
      image: "https://images.unsplash.com/photo-1575428652377-a2d80e2040f5?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Eco Friendly Tote",
      price: "15",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thoughtfully designed merchandise that celebrates our commitment to fresh, sustainable ingredients
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
