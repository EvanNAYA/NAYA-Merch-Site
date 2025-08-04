import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from './CartContext';
import { createShopifyCheckout } from '../lib/checkout';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    console.log('Starting checkout with cart:', cart);
    setIsCheckingOut(true);
    try {
      const checkout = await createShopifyCheckout(cart);
      console.log('Checkout result:', checkout);
      if (checkout?.webUrl) {
        // Redirect to Shopify checkout
        window.location.href = checkout.webUrl;
      } else {
        console.error('No webUrl in checkout response');
        alert('Unable to create checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error details:', error);
      alert(`Checkout error: ${error.message || 'Please try again.'}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 z-50 h-full bg-naya-hm shadow-lg transition-transform duration-300 w-[95vw] sm:w-[95vw] md:w-[33vw] max-w-[460px] min-w-[299px] flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Top bar */}
      <div className="w-full flex items-center justify-between bg-naya-dg text-white" style={{ height: 64 }}>
        <span className="font-asc-b text-xl px-6 text-naya-lg">CART ({cartCount})</span>
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
          <div className="text-center text-gray-500 mt-8 font-pg-r">Your cart is empty.</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex mb-6 border-b pb-4 h-32">
              <div className="h-full flex items-stretch p-0">
                <img src={item.image} alt={item.name} className="w-24 h-full object-cover border-r border-gray-300 flex-shrink-0 p-0 m-0" />
              </div>
              <div className="flex-1 flex flex-col justify-center pl-6 pr-2 h-full">
                <div className="font-asc-r font-semibold text-lg leading-tight mb-1">{item.name}</div>
                <div className="text-lg text-gray-500 font-pg-r leading-tight mb-1">${Math.floor(item.price)}</div>
                {item.size && (
                  <div className="text-base text-gray-700 font-pg-r leading-tight mb-2">Size: <span className="font-semibold">{item.size}</span></div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center rounded-full bg-naya-dg px-4 py-1 font-pg-r text-naya-hm text-lg min-w-[90px] justify-between">
                    <button
                      className="px-2 text-naya-hm focus:outline-none"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span className="mx-2 select-none w-6 text-center inline-block">{item.quantity}</span>
                    <button
                      className="px-2 text-naya-hm focus:outline-none"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 ml-2"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Cart Footer (optional: total, checkout button) */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="font-asc-r text-naya-dg text-xl">ESTIMATED TOTAL</span>
          <span className="font-asc-r text-naya-dg text-xl">
            ${Math.floor(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
          </span>
        </div>
        <button
          className="w-full rounded-full bg-naya-dg text-naya-hm font-asc-r py-2 text-xl transition-colors hover:bg-naya-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCheckout}
          disabled={cart.length === 0 || isCheckingOut}
        >
          {isCheckingOut ? 'PROCESSING...' : 'CHECK OUT'}
        </button>
      </div>
    </div>
  );
};

export default CartSidebar; 