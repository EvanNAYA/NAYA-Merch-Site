import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  originalPrice?: string;
  id?: string; // Add optional id prop
}

const ProductCard = ({ name, price, image, originalPrice, id }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to product page with the product id
    navigate(`/product/${id || '1'}`);
  };

  return (
    <div 
      className="group cursor-pointer p-4 flex flex-col h-full justify-between"
      onClick={handleClick}
    >
      <div className="aspect-[4/5] bg-gray-100 mb-4 overflow-hidden h-[80%]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1 text-left">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-900">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
