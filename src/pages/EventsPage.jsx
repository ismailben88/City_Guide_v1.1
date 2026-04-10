import { useState, useEffect, useMemo } from "react";
import "../styles/EventsPage.css";

// ─── helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "Date à venir";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
};

const CATEGORY_ICONS = {
  music: "🎵",
  art: "🎨",
  sport: "🏃",
  culture: "🏺",
};

// ─── EventCard ────────────────────────────────────────────────────────────────
function EventCard({ event, featured = false }) {
  // Correction : On vérifie le prix pour déterminer si c'est gratuit
  const isFree = event.ticketPrice === 0;

  return (
    <article className={`ev-card ${featured ? "ev-card--featured" : ""}`}>
      <div className="ev-card__img-wrap">
        {/* Correction : On utilise coverImage au lieu de img */}
        <img src={event.coverImage} alt={event.title} className="ev-card__img" />
        <span className={`ev-card__badge ${isFree ? "ev-card__badge--free" : "ev-card__badge--paid"}`}>
          {isFree ? "Gratuit" : `${event.ticketPrice} DH`}
        </span>
        <span className="ev-card__badge ev-card__badge--cat">
           📅 {event.category?.name || "Événement"}
        </span>
      </div>
      <div className="ev-card__body">
        {/* Correction ERREUR OBJET : On affiche event.city.name au lieu de l'objet entier */}
        <p className="ev-card__city">📍 {event.city?.name || "Maroc"}</p>
        <h3 className="ev-card__title">{event.title}</h3>
        {featured && (
          <p className="ev-card__desc">{event.description}</p>
        )}
        <div className="ev-card__footer">
          {/* Correction : createdAt ou une date spécifique de l'event */}
          <span className="ev-card__date">🗓 {formatDate(event.createdAt)}</span>
          <button className="ev-card__cta">
            {isFree ? "S'inscrire" : "Billetterie"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── EventsPage ───────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [freeFilter, setFreeFilter] = useState("all"); 
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch("http://localhost:3001/events", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de la récupération des événements");
        return res.json();
      })
      .then((data) => { setEvents(data); setLoading(false); })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  // Correction : On récupère les catégories depuis l'objet category
  const categories = useMemo(
    () => ["all", ...new Set(events.map((e) => e.category?.name).filter(Boolean))],
    [events]
  );

  const filtered = useMemo(() => {
    let list = [...events];

    if (categoryFilter !== "all")
      list = list.filter((e) => e.category?.name === categoryFilter);

    if (freeFilter === "free") list = list.filter((e) => e.ticketPrice === 0);
    if (freeFilter === "paid") list = list.filter((e) => e.ticketPrice > 0);

    list.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return sortOrder === "asc" ? diff : -diff;
    });

    return list;
  }, [events, categoryFilter, freeFilter, sortOrder]);

  // On sépare le premier événement pour la section "Featured"
  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (loading) return (
    <div className="ev-page__loading">
      <div className="ev-page__spinner" />
      <p>Chargement des événements...</p>
    </div>
  );

  if (error) return (
    <div className="ev-page__error">
      <span>⚠️</span>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="ev-page">
      <header className="ev-page__header">
        <div className="ev-page__header-overlay">
          <h1 className="ev-page__header-title">Événements à venir</h1>
          <p className="ev-page__header-sub">
            Festivals, concerts et expériences partout au Maroc
          </p>
        </div>
      </header>

      <div className="ev-page__filters">
        <div className="ev-filters__group">
          {categories.map((cat) => (
            <button
              key={cat} // La clé est maintenant une string unique
              className={`ev-filters__tab ${categoryFilter === cat ? "ev-filters__tab--active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === "all" ? "Tous" : cat}
            </button>
          ))}
        </div>

        <div className="ev-filters__group">
          {["all", "free", "paid"].map((val) => (
            <button
              key={val}
              className={`ev-filters__pill ${freeFilter === val ? "ev-filters__pill--active" : ""}`}
              onClick={() => setFreeFilter(val)}
            >
              {val === "all" ? "Tous les prix" : val === "free" ? "🎟 Gratuit" : "💳 Payant"}
            </button>
          ))}
        </div>

        <div className="ev-filters__sort">
          <button
            className="ev-filters__sort-btn"
            onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
          >
            {sortOrder === "asc" ? "Plus récents ↑" : "Plus anciens ↓"}
          </button>
        </div>
      </div>

      <div className="ev-page__count">
        {filtered.length} événement{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
      </div>

      {filtered.length === 0 ? (
        <div className="ev-page__empty">
          <span>🗓</span>
          <p>Aucun événement ne correspond à vos filtres.</p>
          <button className="ev-page__reset" onClick={() => { setCategoryFilter("all"); setFreeFilter("all"); }}>
            Réinitialiser
          </button>
        </div>
      ) : (
        <div className="ev-page__content">
          {featured && (
            <section className="ev-page__featured">
              <h2 className="ev-page__section-title">✨ À la une</h2>
              <EventCard event={featured} featured />
            </section>
          )}

          {rest.length > 0 && (
            <section className="ev-page__grid-section">
              <h2 className="ev-page__section-title">Tous les événements</h2>
              <div className="ev-page__grid">
                {rest.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}