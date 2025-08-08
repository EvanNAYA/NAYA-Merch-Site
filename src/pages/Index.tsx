
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';
import Collections from '@/components/Collections';
import Footer from '@/components/Footer';
import ASI from '@/components/ASI';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'hsl(var(--naya-hm))', overflowX: 'hidden', maxWidth: '100vw' }}>
      <Header />
      <div className="h-16"></div>
      <Hero />
      <ProductGrid />
      <BrandStory />
      <Collections />
      {/* On mobile, go directly to footer after collections; keep ASI and spacer only on desktop */}
      <div className="hidden md:block">
        <ASI />
        <div className="pb-6" style={{ height: '4rem', background: 'hsl(var(--naya-hm))' }} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
