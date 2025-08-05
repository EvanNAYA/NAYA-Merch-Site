import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useState, useMemo, useEffect, useRef } from 'react';

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Helper function to display size labels nicely
  const getSizeDisplayLabel = (size: any) => {
    console.log('🔍 ProductCard size value received:', `"${size}"`, 'Type:', typeof size, 'Full object:', size);
    
    // Handle different data types
    let sizeString = '';
    if (typeof size === 'string') {
      sizeString = size;
    } else if (typeof size === 'object' && size !== null) {
      // If it's an object, try to get the value property
      sizeString = size.value || size.title || size.name || String(size);
    } else {
      sizeString = String(size);
    }
    
    const cleanSize = sizeString?.trim(); // Remove any whitespace
    console.log('🔍 ProductCard cleaned size string:', `"${cleanSize}"`);
    
    // Case-insensitive check for "one size" in any capitalization
    if (cleanSize?.toLowerCase() === 'one size') {
      console.log('✅ ProductCard converting to OS');
      return 'OS';
    }
    console.log('➡️ ProductCard keeping original size:', cleanSize);
    return cleanSize;
  };

  // Helper function to get appropriate text size based on string length
  const getSizeTextClass = (sizeLabel: string) => {
    if (sizeLabel.length > 2) {
      return 'text-[10px]'; // Extra small for longer labels like "22oz"
    }
    return 'text-xs'; // Standard size for short labels like "OS", "S", "M", "L"
  };

  // Helper function to sort sizes in the correct order
  const sortSizes = (sizes: any[]) => {
    // Standard clothing size order
    const standardSizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
    
    // Get display labels for all sizes
    const sizesWithLabels = sizes.map(size => ({
      original: size,
      display: getSizeDisplayLabel(size).toUpperCase() // Convert to uppercase for comparison
    }));
    
    // Check if all sizes are standard clothing sizes (or "OS" for One Size)
    const allStandardSizes = sizesWithLabels.every(item => 
      standardSizeOrder.includes(item.display) || item.display === 'OS'
    );
    
    if (allStandardSizes) {
      // Sort according to standard order
      console.log('🔄 ProductCard sorting standard clothing sizes');
      return sizesWithLabels.sort((a, b) => {
        // Handle "OS" (One Size) - put it first
        if (a.display === 'OS') return -1;
        if (b.display === 'OS') return 1;
        
        const indexA = standardSizeOrder.indexOf(a.display);
        const indexB = standardSizeOrder.indexOf(b.display);
        return indexA - indexB;
      }).map(item => item.original);
    } else {
      // Non-standard sizes (like oz measurements) - keep original order
      console.log('🔄 ProductCard keeping original order for non-standard sizes');
      return sizes;
    }
  };

  // Extract available sizes from options or variants
  const availableSizes = useMemo(() => {
    console.log('🔍 ProductCard extracting sizes from options:', options, 'variants:', variants);
    
    if (options) {
      // Find the size option
      const sizeOption = options.find(option => 
        option.name?.toLowerCase().includes('size') || 
        option.displayName?.toLowerCase().includes('size')
      );
      console.log('🔍 ProductCard found size option:', sizeOption);
      
      if (sizeOption && sizeOption.values) {
        const extractedSizes = sizeOption.values.map((value: any) => value.value || value);
        console.log('🔍 ProductCard extracted sizes from options:', extractedSizes);
        return extractedSizes;
      }
    }
    
    if (variants) {
      // Extract unique sizes from variants
      const sizes = variants
        .map(variant => variant.title || variant.size)
        .filter(size => size)
        .filter((size, index, array) => array.indexOf(size) === index);
      console.log('🔍 ProductCard extracted sizes from variants:', sizes);
      return sizes;
    }
    
    console.log('🔍 ProductCard no sizes found, returning empty array');
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

  // Handle clicks outside the component to hide size selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowSizeSelection(false);
        setSelectedSize('');
      }
    };

    // Only add the event listener if size selection is showing
    if (showSizeSelection) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSizeSelection]);

  return (
    <div 
      ref={cardRef}
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
            add to cart
          </button>
        ) : (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 opacity-100 z-30">
            {sortSizes(availableSizes).map((size) => {
              const displayLabel = getSizeDisplayLabel(size);
              const textSizeClass = getSizeTextClass(displayLabel);
              return (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSizeSelect(size);
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${textSizeClass} font-asc-m transition-colors bg-naya-hm text-naya-dg border-naya-dg hover:bg-naya-dg hover:text-naya-hm shadow-lg`}
                style={{ outline: 'none' }}
                aria-label={`Select size ${displayLabel}`}
              >
                {displayLabel}
              </button>
              );
            })}
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
