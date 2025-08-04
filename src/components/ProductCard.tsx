import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useState, useMemo } from 'react';

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  originalPrice?: string;
  id?: string; // Add optional id prop
  hoverImage?: string; // New prop for hover image
  currency?: string;
  shopifyId?: string;
  options?: any[];
  variants?: any[];
}

const ProductCard = ({ name, price, image, originalPrice, id, hoverImage, options, variants }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [showSizeSelection, setShowSizeSelection] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Extract available sizes from options or variants
  const availableSizes = useMemo(() => {
    if (options) {
      // Find the size option
      const sizeOption = options.find(option => 
        option.name?.toLowerCase().includes('size') || 
        option.displayName?.toLowerCase().includes('size')
      );
      if (sizeOption && sizeOption.values) {
        return sizeOption.values.map((value: any) => value.value || value);
      }
    }
    
    if (variants) {
      // Extract unique sizes from variants
      const sizes = variants
        .map(variant => variant.title || variant.size)
        .filter(size => size)
        .filter((size, index, array) => array.indexOf(size) === index);
      return sizes;
    }
    
    return [];
  }, [options, variants]);

  // Check if we need size selection
  const needsSizeSelection = availableSizes.length > 1;

  const handleClick = () => {
    // Navigate to product page with the product id
    if (id) {
      // URL encode the Shopify Global ID to handle special characters
      const encodedId = encodeURIComponent(id);
      navigate(`/product/${encodedId}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (needsSizeSelection && !showSizeSelection) {
      // Show size selection interface
      setShowSizeSelection(true);
      return;
    }
    
    // If no size selection needed or we're in size selection mode, add to cart
    const sizeToAdd = needsSizeSelection ? selectedSize : (availableSizes[0] || 'M');
    
    addToCart({
      id: id || name,
      name,
      price: Number(price),
      image,
      size: sizeToAdd,
    });
    
    setShowToast(true);
    setShowSizeSelection(false);
    setSelectedSize('');
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Automatically add to cart after selecting size
    addToCart({
      id: id || name,
      name,
      price: Number(price),
      image,
      size,
    });
    
    setShowToast(true);
    setShowSizeSelection(false);
    setSelectedSize('');
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleCancelSizeSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSizeSelection(false);
    setSelectedSize('');
  };

  return (
    <div 
      className="group cursor-pointer flex flex-col h-full justify-between relative"
      onClick={handleClick}
    >
      <div className="aspect-[4/5] bg-gray-100 mb-4 overflow-hidden h-[80%] relative group/image rounded-t-[15px]">
        {/* Main product image */}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-300 absolute inset-0 z-10 rounded-t-[15px] ${
            hoverImage && hoverImage !== image ? 'group-hover/image:scale-105 group-hover/image:opacity-0' : 'group-hover/image:scale-105'
          }`}
        />
        {/* Hover image - only render if different from main image */}
        {hoverImage && hoverImage !== image && (
          <img
            src={hoverImage}
            alt="Product hover preview"
            className="w-full h-full object-cover transition-opacity duration-300 absolute inset-0 z-20 opacity-0 group-hover/image:opacity-100 rounded-t-[15px]"
          />
        )}
        {/* Add to Cart Button or Size Selection - Overlay on image */}
        {!showSizeSelection ? (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 bg-naya-dg text-naya-hm py-2 rounded font-semibold hover:bg-naya-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-30"
          >
            Add to Cart
          </button>
        ) : (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4/5 bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-100 z-30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-asc-r text-gray-700">Select Size:</span>
              <button
                onClick={handleCancelSizeSelection}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSizeSelect(size);
                  }}
                  className="text-xs py-1 px-2 border border-gray-300 rounded hover:bg-naya-dg hover:text-naya-hm transition-colors duration-200 font-asc-r"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-1 text-left px-4 pb-4">
        <h3 className="text-sm font-asc-r text-gray-900">{name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-asc-r text-gray-900">${Math.floor(Number(price))}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through font-asc-r">${Math.floor(Number(originalPrice))}</span>
          )}
        </div>
      </div>
      {showToast && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-20 bg-naya-dg text-naya-hm px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
          Added to cart!
        </div>
      )}
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3.5s both;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
