import React from "react";

const Hero = () => {
  return (
    <section className="relative bg-gray-100 overflow-hidden min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)]">
      <div className="absolute inset-0">
        <img
          src="/HeaderHolder.jpg"
          alt="NAYA team members, wearing NAYA merch, working together to cook delicious bowls and rolls for store guests"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-naya-hm max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl mb-6 leading-tight font-asc-b">
            Middle Eastern Goodness
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto font-pg-r">
            Discover our collection of sustainably-made merchandise that celebrates heritage and the spirit of the Middle East.
          </p>
          <button className="bg-naya-dg text-naya-hm px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all hover:scale-105 font-pg-r">
            Shop Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
