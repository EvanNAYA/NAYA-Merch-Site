interface CollectionCardProps {
  name: string;
  subtitle: string;
  image: string;
}

const CollectionCard = ({ name, subtitle, image }: CollectionCardProps) => {
  return (
    <div className="relative w-full h-full aspect-square border border-black rounded-[15px] overflow-hidden flex items-center justify-center group bg-gray-100">
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-2">
        <h3 className="text-white text-2xl md:text-3xl font-light uppercase tracking-wider text-center drop-shadow-md">
          {name}
        </h3>
        <span className="text-white text-base md:text-lg font-normal text-center mt-2 drop-shadow-md">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default CollectionCard;
