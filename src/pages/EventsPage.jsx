// pages/EventsPage.jsx
import { useState, useEffect, useMemo } from "react";
import "../styles/EventsPage.css";

// ─── helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const CATEGORY_ICONS = {
  music:   "🎵",
  art:     "🎨",
  sport:   "🏃",
  culture: "🏺",
};

// ─── EventCard ────────────────────────────────────────────────────────────────
function EventCard({ event, featured = false }) {
  return (
    <article className={`ev-card ${featured ? "ev-card--featured" : ""}`}>
      <div className="ev-card__img-wrap">
        <img src={event.img} alt={event.title} className="ev-card__img" />
        <span className="ev-card__badge ev-card__badge--free">
          {event.isFree ? "Free" : "Paid"}
        </span>
        <span className="ev-card__badge ev-card__badge--cat">
          {CATEGORY_ICONS[event.category] ?? "📅"} {event.category}
        </span>
      </div>
      <div className="ev-card__body">
        <p className="ev-card__city">📍 {event.city}</p>
        <h3 className="ev-card__title">{event.title}</h3>
        {featured && (
          <p className="ev-card__desc">{event.description}</p>
        )}
        <div className="ev-card__footer">
          <span className="ev-card__date">🗓 {formatDate(event.date)}</span>
          <button className="ev-card__cta">
            {event.isFree ? "Register Free" : "Get Tickets"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── EventsPage ───────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [freeFilter, setFreeFilter]         = useState("all");   // all | free | paid
  const [sortOrder, setSortOrder]           = useState("asc");   // asc | desc

  // ── fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch("http://localhost:3001/events", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
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

  // ── derived values ────────────────────────────────────────────────────────
  const categories = useMemo(
    () => ["all", ...new Set(events.map((e) => e.category))],
    [events]
  );

  const filtered = useMemo(() => {
    let list = [...events];

    if (categoryFilter !== "all")
      list = list.filter((e) => e.category === categoryFilter);

    if (freeFilter === "free")  list = list.filter((e) => e.isFree);
    if (freeFilter === "paid")  list = list.filter((e) => !e.isFree);

    list.sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return sortOrder === "asc" ? diff : -diff;
    });

    return list;
  }, [events, categoryFilter, freeFilter, sortOrder]);

  const [featured, ...rest] = filtered;

  // ── render ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="ev-page__loading">
      <div className="ev-page__spinner" />
      <p>Loading events…</p>
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

      {/* ── Page Header ── */}
      <header className="ev-page__header">
        <div className="ev-page__header-overlay">
          <h1 className="ev-page__header-title">Upcoming Events</h1>
          <p className="ev-page__header-sub">
            Festivals, concerts & experiences across Morocco
          </p>
        </div>
      </header>

      {/* ── Filters Bar ── */}
      <div className="ev-page__filters">

        {/* Category tabs */}
        <div className="ev-filters__group">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`ev-filters__tab ${categoryFilter === cat ? "ev-filters__tab--active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === "all" ? "All" : `${CATEGORY_ICONS[cat] ?? "📅"} ${cat}`}
            </button>
          ))}
        </div>

        {/* Free / Paid */}
        <div className="ev-filters__group">
          {["all", "free", "paid"].map((val) => (
            <button
              key={val}
              className={`ev-filters__pill ${freeFilter === val ? "ev-filters__pill--active" : ""}`}
              onClick={() => setFreeFilter(val)}
            >
              {val === "all" ? "All prices" : val === "free" ? "🎟 Free" : "💳 Paid"}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ev-filters__sort">
          <label className="ev-filters__sort-label">Sort by date</label>
          <button
            className="ev-filters__sort-btn"
            onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
          >
            {sortOrder === "asc" ? "Earliest first ↑" : "Latest first ↓"}
          </button>
        </div>

      </div>

      {/* ── Results count ── */}
      <div className="ev-page__count">
        {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="ev-page__empty">
          <span>🗓</span>
          <p>No events match your filters.</p>
          <button
            className="ev-page__reset"
            onClick={() => { setCategoryFilter("all"); setFreeFilter("all"); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="ev-page__content">

          {/* ── Featured event ── */}
          {featured && (
            <section className="ev-page__featured">
              <h2 className="ev-page__section-title">✨ Featured Event</h2>
              <EventCard event={featured} featured />
            </section>
          )}

          {/* ── Grid ── */}
          {rest.length > 0 && (
            <section className="ev-page__grid-section">
              <h2 className="ev-page__section-title">All Events</h2>
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