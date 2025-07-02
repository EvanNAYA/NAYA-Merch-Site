
import { useState } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-sweetgreen">sweetgreen</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-sweetgreen transition-colors">Shop</a>
            <a href="#" className="text-gray-700 hover:text-sweetgreen transition-colors">Info</a>
            <a href="#" className="text-gray-700 hover:text-sweetgreen transition-colors">About</a>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <ShoppingBag className="h-5 w-5" />
              <span className="ml-2 text-sm">Cart (0)</span>
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-sweetgreen">Shop</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-sweetgreen">Info</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-sweetgreen">About</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
