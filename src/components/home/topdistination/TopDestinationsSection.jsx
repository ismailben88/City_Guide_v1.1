import SectionSlider from "../slider/SectionSlider";
import SlideCard from "../slider/SlideCard";

export default function TopDestinationsSection({ destinations }) {
  if (!destinations?.length) return null;

  return (
    <SectionSlider
      title={`Top Destinations en ${destinations[0]?.seasonLabel || 'cette saison'}`}
      subtitle="Tendances"
      viewAllHref="/destinations"
    >
      {destinations.map((d, index) => (
        <SlideCard
          key={d.id}
          index={index}
          variant="wide"
          // Correction : Ton script utilise 'coverImage'
          img={d.coverImage} 
          // Correction : Ton script utilise 'name'
          title={d.name}
          // On affiche le nombre d'événements prévus cette saison
          subtitle={`${d.upcomingEvents || 0} événements à venir`}
          // Correction : On s'assure que badge reçoit une String
          badge={d.region || "Maroc"}
          // Si tu n'as pas de rating sur les villes, on peut mettre une valeur par défaut 
          // ou l'enlever si SlideCard le permet
          rating={d.rating || 5.0}
        />
      ))}
    </SectionSlider>
  );
}