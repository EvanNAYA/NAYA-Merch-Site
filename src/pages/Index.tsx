
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';
import Collections from '@/components/Collections';
import Footer from '@/components/Footer';
import ASI from '@/components/ASI';

const Index = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--naya-hm))' }}>
      <Header />
      <Hero />
      <ProductGrid />
      <BrandStory />
      <Collections />
      <ASI />
      <div style={{ height: '3rem', background: 'hsl(var(--naya-hm))' }} />
      <Footer />
    </div>
  );
};

export default Index;
