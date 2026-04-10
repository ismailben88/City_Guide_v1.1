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
      {places.map((p, index) => (
        <SlideCard
          key={p.id}
          index={index}
          variant="wide"
          // Correction : Ton API renvoie 'coverImage' et non 'img'
          img={p.coverImage} 
          // Correction : Ton API renvoie 'name' et non 'title'
          title={p.name}
          // Correction : Ton API renvoie 'cityName' (ou utilise p.city.name)
          subtitle={p.cityName || p.city?.name} 
          // FIX ERREUR OBJET : On passe le nom de la catégorie (String) au badge
          badge={p.category?.name || "Attraction"} 
          // Correction : Ton API renvoie 'averageRating'
          rating={p.averageRating}
          count={p.reviewCount}
          onClick={() => onPlaceClick?.(p)}
        />
      ))}
    </SectionSlider>
  );
}