import CollectionCard from './CollectionCard';

const collections = [
  {
    name: 'Light',
    subtitle: '(Hats, Socks, Accessories)',
    image: '/CollectionsPlaceholder.jpg',
  },
  {
    name: 'Medium',
    subtitle: '(Tees)',
    image: '/CollectionsPlaceholder.jpg',
  },
  {
    name: 'Heavy',
    subtitle: '(Sweatshirts, Sweatpants)',
    image: '/CollectionsPlaceholder.jpg',
  },
];

const HEADER_HEIGHT_PX = 64;

const Collections = () => {
  return (
    <div className="overflow-x-hidden w-full">
      <section
        className="py-0 bg-naya-hm flex flex-col justify-between overflow-x-hidden w-full"
        style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)` }}
      >
        <div className="w-full flex flex-col h-full mx-auto overflow-x-hidden">
          <div className="text-left mb-8 px-4 pt-16">
            <h2 className="text-4xl font-asc-m text-naya-dg mb-4">NAYA's Collections</h2>
          </div>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="flex gap-6 md:gap-8 w-full justify-center overflow-x-hidden">
              {collections.map((collection, index) => (
                <div
                  className="min-w-[180px] max-w-[320px] md:min-w-[250px] md:max-w-[400px] flex-shrink-0 h-[60vh]"
                  key={index}
                >
                  <CollectionCard
                    name={collection.name}
                    subtitle={collection.subtitle}
                    image={collection.image}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;
