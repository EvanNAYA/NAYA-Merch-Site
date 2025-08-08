import React from 'react';
import { useShopifyStyledContent } from '@/hooks/useShopifyStyledContent';
import { useShopifyPageContent } from '@/hooks/useShopifyTextFile';

const HEADER_HEIGHT_PX = 64;

const DEFAULT_TEXT = `We believe that transparency—where a product came from and who made it—shouldn't be a luxury, but a standard.\n\nWe partnered with KOTN and Everybody. World to ensure these products are ethically sourced and sustainably made.`;

const BrandStory = ({ text }: { text?: string }) => {
  // Fetch dynamic styled text from Shopify
  const { content: brandStoryStyled, loading: textLoading, error: textError } = useShopifyStyledContent("brandstory_text");
  // Fetch video URL from Shopify page content
  const { content: brandStoryVideoUrl } = useShopifyPageContent("brandstory_video");
  const cleanVideoUrl = brandStoryVideoUrl ? brandStoryVideoUrl.replace(/<[^>]*>/g, '').trim() : null;

  // Normalize URL for production (avoid mixed content, missing scheme)
  const normalizeUrl = (url: string | null): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('//')) return `https:${trimmed}`;
    if (trimmed.startsWith('http://')) return `https://${trimmed.slice(7)}`;
    if (trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/')) return trimmed; // local asset
    // If it's likely a domain/path without scheme, default to https
    if (/^[^\s]+\.[^\s]+/.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  };

  const normalizedVideoUrl = normalizeUrl(cleanVideoUrl);
  const displayVideoUrl = normalizedVideoUrl || "/60sBeirut.mp4";
  
  // Use fetched styled content first, then prop, then default
  const displayText = brandStoryStyled?.text || text || DEFAULT_TEXT;
  const textColor = brandStoryStyled?.color;
  
  console.log('📖 BrandStory text state:', {
    brandStoryStyled,
    textLoading,
    textError,
    propText: text,
    displayText: displayText.substring(0, 50) + '...',
    textColor,
    brandStoryVideoUrl,
    cleanVideoUrl,
    displayVideoUrl
  });
  
  // Show error on screen for debugging
  if (textError) {
    console.error('🚨 BRAND STORY TEXT ERROR:', textError);
  }

  return (
    <section
      className="relative flex items-center justify-center w-full bg-naya-hm py-0 pt-8 md:pt-0 sm:py-12 md:py-0 sm:min-h-auto sm:h-auto md:min-h-[90vh] md:h-[90vh] overflow-x-hidden md:overflow-visible"
    >
      <div
        className="relative flex items-center justify-center w-[95vw] max-w-[95vw] md:max-w-[1800px] aspect-[2.57/1] max-h-[700px] min-h-[250px] rounded-lg overflow-hidden shadow-lg"
      >
        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={displayVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={(e) => {
            // Fallback to local video if remote fails (e.g., mixed content, 403, CORS)
            const video = e.currentTarget as HTMLVideoElement;
            if (video.src !== window.location.origin + '/60sBeirut.mp4') {
              video.src = '/60sBeirut.mp4';
              video.play().catch(() => {});
            }
          }}
        />
        {/* Grey transparent overlay for dimming */}
        <div className="absolute inset-0 bg-gray-900/40 z-10" />
        {/* Centered static text, no background, always fully visible */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-2 md:px-8">
          <div
            className="text-naya-hm text-center text-lg md:text-3xl font-asc-r px-4 md:px-8 rounded-lg w-full max-w-5xl h-full min-h-[250px] md:min-h-[350px] max-h-[90%]"
            style={{
              background: 'transparent',
              minHeight: '250px',
              height: '100%',
              maxHeight: '90%',
              width: '100%',
              maxWidth: '900px',
              color: textColor || undefined,
              fontSize: 'clamp(1.125rem, 2.75vw, 2.5rem)',
              lineHeight: 1.3,
              textAlign: 'center',
              boxShadow: 'none',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'pre-line',
            }}
          >
            {textLoading ? "Loading..." : displayText}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
