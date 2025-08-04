import { useState } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartSidebar from './CartSidebar';
import { useCart } from './CartContext';

const HEADER_HEIGHT_PX = 64;

const shopLinks = [
  { label: 'SHOP ALL', href: 'https://eatnaya.com' },
  { label: 'T-SHIRTS', href: 'https://eatnaya.com' },
  { label: 'SWEATERS', href: 'https://eatnaya.com' },
  { label: 'ACCESSORIES', href: 'https://eatnaya.com' },
  { label: 'MISCELLANEOUS', href: 'https://eatnaya.com' },
];

const infoLinks = [
  { label: 'FAQS', href: 'https://eatnaya.com' },
  { label: 'SHIPPING', href: 'https://eatnaya.com' },
  { label: 'RETURNS', href: 'https://eatnaya.com' },
  { label: 'CONTACT', href: 'https://eatnaya.com' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const { cart } = useCart();

  // Handle body scroll lock when any drawer is open
  if (typeof window !== 'undefined') {
    document.body.style.overflow = (isShopDrawerOpen || isInfoDrawerOpen || isCartSidebarOpen) ? 'hidden' : '';
  }

  // Handlers for mutual exclusivity
  const openShopDrawer = () => {
    setIsInfoDrawerOpen(false);
    setIsCartSidebarOpen(false);
    setIsShopDrawerOpen(true);
  };
  const openInfoDrawer = () => {
    setIsShopDrawerOpen(false);
    setIsCartSidebarOpen(false);
    setIsInfoDrawerOpen(true);
  };
  const openCartSidebar = () => {
    setIsShopDrawerOpen(false);
    setIsInfoDrawerOpen(false);
    setIsCartSidebarOpen(true);
  };
  const closeDrawers = () => {
    setIsShopDrawerOpen(false);
    setIsInfoDrawerOpen(false);
    setIsCartSidebarOpen(false);
  };

  // Determine color states
  const shopColor = (isShopDrawerOpen || isInfoDrawerOpen) ? 'text-naya-lg' : 'text-naya-dg hover:text-naya-lg';
  const infoColor = (isShopDrawerOpen || isInfoDrawerOpen) ? 'text-naya-lg' : 'text-naya-dg hover:text-naya-lg';
  const cartColor = isCartSidebarOpen ? 'text-naya-lg' : 'text-naya-dg hover:text-naya-lg';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Overlay for side drawers */}
      {(isShopDrawerOpen || isInfoDrawerOpen || isCartSidebarOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
          onClick={closeDrawers}
        />
      )}
      
      {/* SHOP Side Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full bg-naya-hm shadow-lg transition-transform duration-300 flex flex-col overflow-hidden
          ${isShopDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[33vw] max-w-[400px] min-w-[260px] md:w-[33vw] md:max-w-[500px] md:min-w-[320px]
          sm:w-[90vw] sm:max-w-[90vw] sm:min-w-[0]`}
        style={{ width: isShopDrawerOpen ? (window.innerWidth < 640 ? '90vw' : '33vw') : undefined }}
        onClick={e => e.stopPropagation()}
      >
        {/* Full-width black top bar with X only */}
        <div
          className="w-full flex items-center justify-end bg-naya-dg"
          style={{ height: HEADER_HEIGHT_PX }}
        >
          <button
            className="h-full px-6 flex items-center justify-center text-naya-hm text-2xl focus:outline-none"
            onClick={closeDrawers}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>
        {/* Links */}
        <nav className="flex flex-col gap-2 mt-8 px-8">
          {shopLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="font-asc-r text-naya-dg text-2xl py-2 transition-colors hover:text-naya-lg active:text-naya-lg focus:text-naya-lg"
              style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
              onClick={e => {
                e.preventDefault();
                window.location.href = link.href;
                closeDrawers();
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      
      {/* INFO Side Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full bg-naya-hm shadow-lg transition-transform duration-300 flex flex-col
          ${isInfoDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[33vw] max-w-[400px] min-w-[260px] md:w-[33vw] md:max-w-[500px] md:min-w-[320px]
          sm:w-[90vw] sm:max-w-[90vw] sm:min-w-[0]`}
        style={{ width: isInfoDrawerOpen ? (window.innerWidth < 640 ? '90vw' : '33vw') : undefined }}
        onClick={e => e.stopPropagation()}
      >
        {/* Full-width black top bar with X only */}
        <div
          className="w-full flex items-center justify-end bg-naya-dg"
          style={{ height: HEADER_HEIGHT_PX }}
        >
          <button
            className="h-full px-6 flex items-center justify-center text-naya-hm text-2xl focus:outline-none"
            onClick={closeDrawers}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>
        {/* Links */}
        <nav className="flex flex-col gap-2 mt-8 px-8">
          {infoLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="font-asc-r text-naya-dg text-2xl py-2 transition-colors hover:text-naya-lg active:text-naya-lg focus:text-naya-lg"
              style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
              onClick={e => {
                e.preventDefault();
                window.location.href = link.href;
                closeDrawers();
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      
      {/* CART Sidebar */}
      <CartSidebar isOpen={isCartSidebarOpen} onClose={closeDrawers} />
      
      {/* SHOP and INFO buttons - positioned absolutely above everything */}
      <div className="fixed top-0 left-0 z-[80] flex items-center h-16 px-3 md:px-8 pointer-events-none">
        <nav className="flex items-center h-full gap-4 md:gap-8 pointer-events-auto">
          <button
            className={`h-full flex items-center text-lg ${isShopDrawerOpen ? 'font-asc-b' : 'font-asc-r'} transition-colors ${shopColor}`}
            style={{ outline: 'none', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            onClick={openShopDrawer}
          >
            SHOP
          </button>
          <button
            className={`h-full flex items-center text-lg ${isInfoDrawerOpen ? 'font-asc-b' : 'font-asc-r'} transition-colors ${infoColor}`}
            style={{ outline: 'none', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            onClick={openInfoDrawer}
          >
            INFO
          </button>
        </nav>
      </div>
      
      {/* Header */}
      <header className="w-full bg-naya-hm border-b border-gray-200 fixed top-0 z-30 shadow-lg">
        <div className="relative flex items-center justify-between h-16 px-3 md:px-8">
          {/* Left Navigation - invisible spacer */}
          <nav className="flex items-center h-full gap-4 md:gap-8 invisible">
            <div className="h-full flex items-center text-lg">SHOP</div>
            <div className="h-full flex items-center text-lg">INFO</div>
          </nav>

          {/* Logo Centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <a
              href="https://eatnaya.com"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <img
                src={isLogoHovered ? "/NAYALightGreen.png" : "/NAYADarkGreen.png"}
                alt="NAYA Logo"
                className={`cursor-pointer ${isLogoHovered ? 'h-11' : 'h-11'}`}
              />
            </a>
          </div>

          {/* Right side cart */}
          <div className="flex items-center h-full">
            <Button
              variant="ghost"
              size="sm"
              className={`h-full px-2 md:px-0 font-asc-r text-lg hover:bg-transparent transition-colors ${cartColor}`}
              onClick={openCartSidebar}
            >
              CART ({cartCount})
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-naya-lg">Shop</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-naya-lg">Info</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-naya-lg">About</a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
