import { useNewsletterSignup } from '@/hooks/useNewsletterSignup';

const SOCIALS = [
  {
    href: 'https://www.facebook.com/eatnaya/',
    label: 'Facebook',
    svg: (
      <svg viewBox="0 0 512 512" height="16" width="auto" fill="currentColor" className="mx-auto my-auto" aria-hidden="true">
        <g>
          <path d="M324.6,0c-72.1,0-114.4,38.1-114.4,124.8v76.3h-91.4v91.4h91.4V512h91.4V292.6h73.1l18.3-91.4h-91.4v-60.9
c0-32.7,10.7-48.9,41.3-48.9h50.1V3.8C384.5,2.6,359.2,0,324.6,0z"/>
        </g>
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/eatnaya',
    label: 'Instagram',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
        <g transform="translate(5.5,5.5)">
          <rect x="0" y="0" width="13" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="6.5" cy="6.5" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="10.2" cy="2.8" r="1" fill="currentColor"/>
        </g>
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/eatnaya',
    label: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
        <text x="4" y="18" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="16" letterSpacing="1" fill="currentColor">in</text>
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@eatnaya',
    label: 'TikTok',
    svg: (
      <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
      </svg>
    ),
  },
];

const Footer = () => {
  const {
    email,
    setEmail,
    isLoading,
    isSuccess,
    error,
    handleSubmit
  } = useNewsletterSignup();

  return (
    <footer className="bg-naya-hm pt-24 font-pg-r">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 col-span-2 sm:col-span-2 md:col-span-1">
            {/* Replace NAYA text with logo image */}
            <img src="/NAYADarkGreen.png" alt="NAYA Logo" className="h-10 w-auto" />
            <p className="text-gray-600 text-sm font-pg-r">
              Fresh, healthy, and delicious Middle Eastern cuisine made with love and the finest ingredients.
            </p>
            {/* Social Icons */}
            <div className="flex gap-2 pt-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group"
                >
                  <span
                    className="relative flex items-center justify-center w-[30px] h-[30px] rounded-full border border-naya-dg bg-naya-hm transition-colors duration-200 group-hover:bg-naya-dg overflow-visible"
                  >
                    <span
                      className="absolute inset-0 flex items-center justify-center text-naya-dg transition-colors duration-200 group-hover:text-naya-hm overflow-visible"
                      style={{ zIndex: 10 }}
                    >
                      {social.svg}
                    </span>
                    <span className="sr-only">{social.label}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-pg-r">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-600 font-pg-r">
              <li><a href="https://www.eatnaya.com/store-locator/" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">Locations</a></li>
              <li><a href="https://order.eatnaya.com/?_gl=1*1hhjm0d*_gcl_au*MTY3MzgwMDEuMTc0OTIyMjgwMg..*_ga*MTUzMzIzMDI2NS4xNzQ4ODg2ODUy*_ga_ZC39T2VN8E*czE3NTIxNjAwMjAkbzU3JGcxJHQxNzUyMTYwMTkwJGo1OSRsMCRoODU0NTQ4MDg5" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">Order</a></li>
              <li><a href="https://images.getbento.com/accounts/68d11e9348e2111e15250c0329f33fdc/media/dXXZywbSDWEcoYWnyoxA_MA_MENU_NUTRITIONAL_GUIDE_060225_1.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">Nutrition</a></li>
              <li><a href="https://www.eatnaya.com/catering-menu/" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">Catering</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-pg-r">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 font-pg-r">
              <li><a href="https://www.eatnaya.com/mission/purpose/who-we-are/" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">About Us</a></li>
              <li><a href="https://www.eatnaya.com/contact-us/" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">Contact Us</a></li>
              <li><a href="https://www.eatnaya.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">Privacy Policy</a></li>
              <li><a href="https://www.eatnaya.com/careers/" target="_blank" rel="noopener noreferrer" className="hover:text-naya-lg transition-colors font-pg-r">Careers</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h4 className="font-semibold text-gray-900 mb-4 font-pg-r">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4 font-pg-r">
              Stay updated with our latest news and special offers.
            </p>
            
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-green-800 text-sm font-pg-r">
                  ✅ Thank you for subscribing! You'll receive our latest updates soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className={`flex-1 px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-naya-lg focus:border-transparent font-pg-r ${
                      error ? 'border-red-300' : 'border-gray-300'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`bg-naya-dg text-naya-hm px-4 py-2 text-sm transition-colors font-pg-r ${
                      isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-opacity-90'
                    }`}
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {error && (
                  <p className="text-red-600 text-xs font-pg-r">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 font-pg-r">
            © 2025 NAYA, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
