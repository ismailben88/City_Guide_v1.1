// components/home/TopDestinationsSection.jsx
import SectionSlider from "../slider/SectionSlider";
import SlideCard from "../slider/SlideCard";

export default function TopDestinationsSection({ destinations }) {
  if (!destinations?.length) return null;

  return (
    <SectionSlider
      title="Top Destinations this season"
      subtitle="Trending"
      viewAllHref="/destinations"
    >
      {destinations.map((d) => (
        <SlideCard
          key={d.id}
          img={d.img}
          title={d.title}
          subtitle={d.distance || d.region}
          badge={d.region}
          rating={d.rating}
          variant="wide"
        />
      ))}
    </SectionSlider>
  );
}
