
interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  originalPrice?: string;
}

const ProductCard = ({ name, price, image, originalPrice }: ProductCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1">
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
