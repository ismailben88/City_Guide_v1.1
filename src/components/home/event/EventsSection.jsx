import SectionSlider from "../slider/SectionSlider";
import EventCard from "./EventCard";

export default function EventsSection({ events = [], onEventClick }) {
  if (!events.length) return null;

  return (
    <SectionSlider
      title="Events"
      subtitle="What's on"
      viewAllHref="/events"
    >
      {events.map((e, i) => (
        <EventCard
          key={e.id}
          event={e}
          index={i}
          onClick={() => onEventClick?.(e)}
        />
      ))}
    </SectionSlider>
  );
}
