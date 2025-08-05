import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductPage from '@/components/ProductPage';
import { fetchShopifyStorefront } from '@/lib/shopify';

const PRODUCT_QUERY = `
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      title
      description
      tags
      images(first: 10) { edges { node { url } } }
      options {
        name
        values
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        // Decode the URL parameter to get the original Shopify Global ID
        const decodedId = id ? decodeURIComponent(id) : null;
        const res = await fetchShopifyStorefront(PRODUCT_QUERY, { id: decodedId });
        setProduct(res.data?.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-naya-hm">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-naya-hm">
        <h1 className="text-3xl font-asc-m text-naya-dg mb-4">Product Not Found</h1>
        <button onClick={() => navigate(-1)} className="text-naya-dg underline font-pg-r">Go Back</button>
      </div>
    );
  }

  return <ProductPage product={product} />;
};

export default Product; 