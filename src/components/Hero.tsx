import React from "react";
import { useNavigate } from "react-router-dom";
import { useShopifyPageContent } from "@/hooks/useShopifyTextFile";
import { useShopifyStyledContent } from "@/hooks/useShopifyStyledContent";

const Hero = () => {
  const navigate = useNavigate();
  const { content: heroTextStyled, loading, error } = useShopifyStyledContent("hero_maintext");
  const { content: heroSubtextStyled, loading: subtextLoading, error: subtextError } = useShopifyStyledContent("hero_subtext");
  const { content: heroButtonTextStyled, loading: buttonLoading, error: buttonError } = useShopifyStyledContent("hero_buttontext");
  const { content: heroImageUrl } = useShopifyPageContent("hero_image");
  
  // Show error on screen for debugging
  if (error) {
    console.error('🚨 MAIN TEXT ERROR:', error);
  }
  if (subtextError) {
    console.error('🚨 SUBTEXT ERROR:', subtextError);
  }
  if (buttonError) {
    console.error('🚨 BUTTON TEXT ERROR:', buttonError);
  }
  
  // Use fetched styled content if available, otherwise fallback to defaults
  const displayText = heroTextStyled?.text || "Middle Eastern Goodness";
  const displaySubtext = heroSubtextStyled?.text || "Discover our collection of sustainably-made merchandise that celebrates heritage and the spirit of the Middle East.";
  const displayButtonText = heroButtonTextStyled?.text || "Shop All";
  
  // Extract colors from styled content
  const mainTextColor = heroTextStyled?.color;
  const subtextColor = heroSubtextStyled?.color;
  const buttonTextColor = heroButtonTextStyled?.color;
  
  // Clean the image URL and use it for background
  const cleanImageUrl = heroImageUrl ? heroImageUrl.replace(/<[^>]*>/g, '').trim() : null;
  const displayImageUrl = cleanImageUrl || "/HeaderHolder.jpg";
  
  console.log('🎭 Hero component state:', { 
    heroTextStyled, 
    loading, 
    error,
    hasContent: !!heroTextStyled,
    heroSubtextStyled,
    subtextLoading,
    subtextError,
    hasSubtext: !!heroSubtextStyled,
    heroButtonTextStyled,
    buttonLoading,
    buttonError,
    hasButtonText: !!heroButtonTextStyled,
    heroImageUrl,
    cleanImageUrl,
    displayImageUrl,
    mainTextColor,
    subtextColor,
    buttonTextColor
  });
  
  return (
    <section className="relative bg-gray-100 overflow-hidden min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)]">
      <div className="absolute inset-0">
        <img
          src={displayImageUrl}
          alt="NAYA team members, wearing NAYA merch, working together to cook delicious bowls and rolls for store guests"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-naya-hm max-w-4xl mx-auto px-4">
          <h1 
            className="text-4xl md:text-6xl mb-6 leading-tight font-asc-b"
            style={{ color: mainTextColor || undefined }}
          >
            {loading ? "Loading..." : displayText}
          </h1>
          <p 
            className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto font-pg-r"
            style={{ color: subtextColor || undefined }}
          >
            {subtextLoading ? "Loading..." : displaySubtext}
          </p>
          <button 
            className="bg-naya-dg text-naya-hm px-8 py-3 rounded-lg transition-all hover:bg-naya-lg hover:scale-105 font-pg-r"
            style={{ color: buttonTextColor || undefined }}
            onClick={() => navigate('/shop-all')}
          >
            {buttonLoading ? "Loading..." : displayButtonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
