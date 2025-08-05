import { useState, useEffect } from 'react';
import { fetchShopifyPageContent } from '@/lib/shopify';

interface StyledContent {
  text: string;
  color?: string;
  rawHtml: string;
}

interface UseShopifyStyledContentReturn {
  content: StyledContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Function to extract color from HTML content
function extractColorFromHtml(html: string): { text: string; color?: string; rawHtml: string } {
  if (!html) {
    return { text: '', rawHtml: html };
  }

  // First, get the plain text by stripping all HTML tags
  const text = html.replace(/<[^>]*>/g, '').trim();
  
  // Look for color in various HTML patterns
  let color: string | undefined;
  
  // Pattern 1: Direct style attribute with color
  const styleColorMatch = html.match(/style\s*=\s*["'][^"']*color\s*:\s*([^;"']+)/i);
  if (styleColorMatch) {
    color = styleColorMatch[1].trim();
  }
  
  // Pattern 2: Font tag with color attribute
  const fontColorMatch = html.match(/<font[^>]*color\s*=\s*["']?([^"'\s>]+)/i);
  if (fontColorMatch) {
    color = fontColorMatch[1];
  }
  
  // Pattern 3: Span or div with color in style
  const spanColorMatch = html.match(/<(?:span|div)[^>]*style\s*=\s*["'][^"']*color\s*:\s*([^;"']+)/i);
  if (spanColorMatch) {
    color = spanColorMatch[1].trim();
  }
  
  // Pattern 4: CSS class-based color (if specific patterns are used)
  // This would need to be customized based on how Shopify handles colored text
  
  // Clean up the color value
  if (color) {
    color = color.replace(/['"]/g, '').trim();
    // Convert common color names or ensure it's a valid CSS color
    if (color && !color.startsWith('#') && !color.startsWith('rgb') && !color.startsWith('hsl')) {
      // If it's a named color, keep it as is
      // You might want to validate against a list of valid CSS color names
    }
  }
  
  console.log('🎨 Color extraction:', {
    originalHtml: html,
    extractedText: text,
    extractedColor: color
  });
  
  return {
    text,
    color,
    rawHtml: html
  };
}

export function useShopifyStyledContent(pageHandle: string): UseShopifyStyledContentReturn {
  const [content, setContent] = useState<StyledContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      console.log('🎨 Starting to fetch styled content:', pageHandle);
      setLoading(true);
      setError(null);
      const pageContent = await fetchShopifyPageContent(pageHandle);
      
      // Extract both text and color information
      const styledContent = extractColorFromHtml(pageContent);
      
      console.log('✅ Successfully fetched styled content:', styledContent);
      setContent(styledContent);
    } catch (err) {
      console.error('❌ Error fetching styled content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch styled content');
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageHandle) {
      fetchContent();
    }
  }, [pageHandle]);

  const refetch = () => {
    fetchContent();
  };

  return {
    content,
    loading,
    error,
    refetch,
  };
}