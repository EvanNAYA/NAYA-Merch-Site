import React from 'react';
import ProductPage from '@/components/ProductPage';

const ProductExample = () => {
  // Example product data - this would typically come from an API or database
  const exampleProduct = {
    id: '1',
    name: 'The Edition Hat',
    price: '18',
    originalPrice: '25',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A premium edition hat crafted with sustainable materials. This comfortable, stylish hat features our signature design and is perfect for everyday wear. Made with organic cotton and featuring embroidered details that celebrate Middle Eastern heritage.',
    sizes: ['S/M', 'L/XL'],
    colors: ['Navy', 'Black', 'Olive'],
    category: 'Hats & Accessories',
    inStock: true,
    rating: 4.5,
    reviews: 127,
  };

  return <ProductPage product={exampleProduct} />;
};

export default ProductExample; 