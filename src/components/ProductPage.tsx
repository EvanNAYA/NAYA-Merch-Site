import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    price: string;
    originalPrice?: string;
    image: string;
    images?: string[]; // Additional product images
    description: string;
    sizes?: string[];
    colors?: string[];
    category: string;
    inStock: boolean;
    rating?: number;
    reviews?: number;
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const images = product.images || [product.image];

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', {
      product: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-naya-hm">
      {/* Header */}
      <div className="bg-naya-hm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-naya-dg hover:text-naya-lg transition-colors font-pg-r"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-4">
            <button className="text-naya-dg hover:text-naya-lg transition-colors">
              <Heart size={20} />
            </button>
            <button className="text-naya-dg hover:text-naya-lg transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? 'border-naya-lg'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-asc-m text-naya-dg mb-2">
                {product.name}
              </h1>
              {product.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating!)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-pg-r">
                    ({product.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-asc-b text-naya-dg">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through font-pg-r">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-asc-m text-naya-dg mb-2">Description</h3>
              <p className="text-gray-700 font-pg-r leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-asc-m text-naya-dg mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-pg-r transition-colors ${
                        selectedSize === size
                          ? 'border-naya-lg bg-naya-lg text-naya-hm'
                          : 'border-gray-300 text-gray-700 hover:border-naya-lg'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-asc-m text-naya-dg mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-pg-r transition-colors ${
                        selectedColor === color
                          ? 'border-naya-lg bg-naya-lg text-naya-hm'
                          : 'border-gray-300 text-gray-700 hover:border-naya-lg'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-asc-m text-naya-dg mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-naya-lg transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-pg-r">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-naya-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 rounded-lg font-pg-b text-lg transition-colors ${
                  product.inStock
                    ? 'bg-naya-dg text-naya-hm hover:bg-opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              {!product.inStock && (
                <p className="text-sm text-red-600 font-pg-r text-center">
                  This item is currently out of stock
                </p>
              )}
            </div>

            {/* Product Info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-sm font-pg-r">
                <span className="text-gray-600">Category:</span>
                <span className="text-naya-dg">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm font-pg-r">
                <span className="text-gray-600">Availability:</span>
                <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-asc-m text-naya-dg mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with related products */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="font-pg-r text-gray-900 mb-2">Related Product</h3>
              <p className="font-pg-r text-naya-dg">$XX</p>
            </div>
            {/* Add more related product cards as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 