import { useState, useEffect } from 'react';
import { fetchShopifyPageContent } from '@/lib/shopify';

interface UseShopifyPageContentReturn {
  content: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useShopifyPageContent(pageHandle: string): UseShopifyPageContentReturn {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      console.log('🔍 Starting to fetch page content:', pageHandle);
      setLoading(true);
      setError(null);
      const pageContent = await fetchShopifyPageContent(pageHandle);
      
      // Strip HTML tags to get just the text content
      const textContent = pageContent.replace(/<[^>]*>/g, '').trim();
      
      console.log('✅ Successfully fetched page content:', textContent);
      setContent(textContent);
    } catch (err) {
      console.error('❌ Error fetching page content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch page content');
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

// Legacy export for backwards compatibility
export const useShopifyTextFile = useShopifyPageContent;