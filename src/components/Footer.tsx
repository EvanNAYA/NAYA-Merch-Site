
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-sweetgreen">sweetgreen</h3>
            <p className="text-gray-600 text-sm">
              Connecting people to real food by building a transparent supply chain.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-sweetgreen transition-colors">Help</a></li>
              <li><a href="#" className="hover:text-sweetgreen transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-sweetgreen transition-colors">Nutrition</a></li>
              <li><a href="#" className="hover:text-sweetgreen transition-colors">Catering</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-sweetgreen transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-sweetgreen transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-sweetgreen transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sweetgreen transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4">
              Get updates on new releases and special offers
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sweetgreen focus:border-transparent"
              />
              <button className="bg-sweetgreen text-white px-4 py-2 text-sm hover:bg-opacity-90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Press Mentions */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-8">As Seen In</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <span className="text-lg font-bold">GQ</span>
            <span className="text-lg font-bold">FOOD&WINE</span>
            <span className="text-lg font-bold">AdAge</span>
            <span className="text-lg font-bold">VOGUE</span>
            <span className="text-lg font-bold">The New York Times</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2024 sweetgreen, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
