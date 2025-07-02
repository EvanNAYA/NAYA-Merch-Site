
const Hero = () => {
  return (
    <section className="relative h-[70vh] bg-gray-100 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=2600&q=80"
          alt="Fresh vegetables in field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
            Good Things Grow Here
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Discover our collection of sustainably-made merchandise that celebrates fresh, local ingredients and the farmers who grow them.
          </p>
          <button className="bg-sweetgreen text-white px-8 py-3 rounded-sm hover:bg-opacity-90 transition-all hover-scale">
            Shop Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
