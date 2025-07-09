const Footer = () => {
  return (
    <footer className="bg-naya-hm py-16 font-pg-r">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            {/* Replace NAYA text with logo image */}
            <img src="/NAYAGreen.png" alt="NAYA Logo" className="h-10 w-auto" />
            <p className="text-gray-600 text-sm font-pg-r">
              Fresh, healthy, and delicious Middle Eastern cuisine made with love and the finest ingredients.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-pg-r">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-600 font-pg-r">
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">Help</a></li>
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">Shop</a></li>
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">Nutrition</a></li>
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">Catering</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-pg-r">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 font-pg-r">
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">About Us</a></li>
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">Contact Us</a></li>
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-naya-lg transition-colors font-pg-r">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-pg-r">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4 font-pg-r">
              Stay updated with our latest news and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-naya-lg focus:border-transparent font-pg-r"
              />
              <button className="bg-naya-dg text-naya-hm px-4 py-2 text-sm hover:bg-opacity-90 transition-colors font-pg-r">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 font-pg-r">
            © 2025 NAYA, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
