
const BrandStory = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-light leading-relaxed">
            We believe that transparency—where a product came from and who made it—shouldn't be a luxury, but a standard.
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            We partnered with KOTN and Everybody.World to ensure these products are ethically sourced and sustainably made.
          </p>
          
          <button className="text-white border border-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all">
            Learn More
          </button>
        </div>
      </div>
      
      <div className="mt-16">
        <img
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=2000&q=80"
          alt="Farm workers in field"
          className="w-full h-64 md:h-80 object-cover opacity-80"
        />
      </div>
    </section>
  );
};

export default BrandStory;
