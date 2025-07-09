import React from 'react';
import { X } from 'lucide-react';
import { useCart } from './CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 z-50 h-full bg-white shadow-lg transition-transform duration-300 w-[90vw] max-w-[400px] min-w-[260px] flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Top bar */}
      <div className="w-full flex items-center justify-between bg-black text-white" style={{ height: 64 }}>
        <span className="font-asc-r text-lg px-6">Your Cart</span>
        <button
          className="h-full px-6 flex items-center justify-center text-naya-hm text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close cart"
        >
          <X size={28} />
        </button>
      </div>
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">Your cart is empty.</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 mb-6 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">${item.price}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700 ml-2"
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                <X size={20} />
              </button>
            </div>
          ))
        )}
      </div>
      {/* Cart Footer (optional: total, checkout button) */}
      {/* <div className="p-4 border-t">Total: ...</div> */}
    </div>
  );
};

export default CartSidebar; 