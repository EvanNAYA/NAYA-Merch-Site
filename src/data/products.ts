export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  description: string;
  sizes?: string[];
  colors?: string[];
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "The Edition Hat",
    price: "18",
    originalPrice: "25",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A premium edition hat crafted with sustainable materials. This comfortable, stylish hat features our signature design and is perfect for everyday wear. Made with organic cotton and featuring embroidered details that celebrate Middle Eastern heritage.",
    sizes: ["S/M", "L/XL"],
    colors: ["Navy", "Black", "Olive"],
    category: "Hats & Accessories",
    inStock: true,
    rating: 4.5,
    reviews: 127,
  },
  {
    id: "2",
    name: "The Kale Camo Hoodie",
    price: "120",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A cozy hoodie with a unique kale camo print. Sustainably made and perfect for cool weather.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Green", "Gray"],
    category: "Hoodies",
    inStock: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "3",
    name: "The Edition Ringer Tee",
    price: "48",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A classic ringer tee with a modern twist. Made from organic cotton for all-day comfort.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Navy"],
    category: "Tees",
    inStock: false,
    rating: 4.2,
    reviews: 54,
  },
  {
    id: "4",
    name: "The Salad Mares Tee",
    price: "35",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A fun tee inspired by salad lovers everywhere. Soft, sustainable, and stylish.",
    sizes: ["S", "M", "L"],
    colors: ["Green", "White"],
    category: "Tees",
    inStock: true,
    rating: 4.0,
    reviews: 33,
  },
  {
    id: "5",
    name: "Organic Cotton Cap",
    price: "25",
    image: "https://images.unsplash.com/photo-1575428652377-a2d80e2040f5?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2040f5?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A classic cap made from 100% organic cotton. Adjustable and comfortable for all-day wear.",
    sizes: ["One Size"],
    colors: ["Blue", "Black"],
    category: "Hats & Accessories",
    inStock: true,
    rating: 4.7,
    reviews: 61,
  },
  {
    id: "6",
    name: "Eco Friendly Tote",
    price: "15",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A reusable tote bag made from eco-friendly materials. Perfect for groceries, books, and more.",
    sizes: ["One Size"],
    colors: ["Natural"],
    category: "Bags",
    inStock: true,
    rating: 4.9,
    reviews: 44,
  },
];

// Helper function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
}; 