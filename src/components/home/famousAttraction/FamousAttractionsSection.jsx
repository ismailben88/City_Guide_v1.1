// components/home/FamousAttractionsSection.jsx
import SectionSlider from "../slider/SectionSlider";
import SlideCard from "../slider/SlideCard";

export default function FamousAttractionsSection({ places, onPlaceClick }) {
  if (!places?.length) return null;

  return (
    <SectionSlider
      title="Famous attractions"
      subtitle="Must-see"
      viewAllHref="/places"
    >
      {places.map((p) => (
        <SlideCard
          key={p.id}
          img={p.img}
          title={p.title}
          subtitle={p.subtitle}
          badge={p.category}
          rating={p.rating}
          count={p.reviewCount}
          onClick={() => onPlaceClick(p)}
        />
      ))}
    </SectionSlider>
  );
}
