
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';
import Collections from '@/components/Collections';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ProductGrid />
      <BrandStory />
      <Collections />
      <Footer />
    </div>
  );
};

export default Index;
