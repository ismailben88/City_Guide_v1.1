// pages/GuidePage.jsx
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery, setFilterCategory, setFilterMinRating,
  setFilterCity, setFilterLanguage, setFilterVerified,
  setFilterSpeciality, setFilterSortBy,
  setFilterAvailDay, setFilterAvailHour,
  resetFilters, setSelectedGuide, loadMore,
  selectSearchQuery, selectFilters, selectFilteredGuides,
  selectTopGuides, selectVisibleCount,
  selectCities, selectLanguages, selectSpecialities,
} from "../store/slices/guideSlice";

import { GuideListItem } from "../components/UI";
import "../styles/Pages.css";
import "../styles/GuidePage.css";
import GuideCard from "../components/home/guide/GuideCard";
import { useNavigation } from "../hooks/useNavigation";

// ─── constants ────────────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const SIDEBAR_CATEGORIES = [
  { key: "All",             label: "All" },
  { key: "Rating",          label: "⭐ Rating" },
  { key: "City",            label: "📍 City" },
  { key: "Language spoken", label: "🌐 Language" },
  { key: "Verified guides", label: "✅ Verified" },
  { key: "Speciality",      label: "🎯 Speciality" },
  { key: "Availability",    label: "📅 Availability" },
];

const SORT_OPTIONS = [
  { value: "score",  label: "Score ▼" },
  { value: "rating", label: "Rating ▼" },
  { value: "name",   label: "Name A→Z" },
];

// ─── FilterPanel ──────────────────────────────────────────────────────────────
function FilterPanel() {
  const dispatch  = useDispatch();
  const filters   = useSelector(selectFilters);
  const cities    = useSelector(selectCities);
  const languages = useSelector(selectLanguages);
  const specs     = useSelector(selectSpecialities);
  const category  = filters.category;

  if (category === "All") return null;

  // ── Availability ──────────────────────────────────────────────────────────
  if (category === "Availability") {
    return (
      <div className="filter-panel">
        <div className="filter-panel__section">
          <div className="filter-panel__label">Day of the week</div>
          <div className="filter-panel__tags">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                className={`filter-panel__tag ${filters.availDay === day ? "filter-panel__tag--active" : ""}`}
                onClick={() => dispatch(setFilterAvailDay(filters.availDay === day ? "" : day))}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-panel__section">
          <div className="filter-panel__label">Time of day</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="time"
              className="filter-panel__select"
              value={filters.availHour}
              onChange={(e) => dispatch(setFilterAvailHour(e.target.value))}
              style={{ flex: 1 }}
            />
            {filters.availHour && (
              <button
                onClick={() => dispatch(setFilterAvailHour(""))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 14 }}
                title="Clear time"
              >✕</button>
            )}
          </div>
        </div>

        {/* active summary chip */}
        {(filters.availDay || filters.availHour) && (
          <div style={{
            marginTop: 4,
            padding: "5px 10px",
            background: "rgba(107,156,62,0.1)",
            borderRadius: 8,
            fontSize: 11,
            color: "#6b9c3e",
            fontWeight: 700,
          }}>
            {filters.availDay && `📅 ${filters.availDay}`}
            {filters.availDay && filters.availHour && "  ·  "}
            {filters.availHour && `🕐 ${filters.availHour}`}
          </div>
        )}
      </div>
    );
  }

  // ── All existing panels — unchanged ───────────────────────────────────────
  return (
    <div className="filter-panel">
      {category === "Rating" && (
        <div className="filter-panel__section">
          <div className="filter-panel__label">Note minimum</div>
          <div className="filter-panel__stars-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`filter-panel__star-btn ${filters.minRating === n ? "filter-panel__star-btn--active" : ""}`}
                onClick={() => dispatch(setFilterMinRating(filters.minRating === n ? 0 : n))}
              >
                {"★".repeat(n)}
              </button>
            ))}
          </div>
        </div>
      )}

      {category === "City" && (
        <div className="filter-panel__section">
          <div className="filter-panel__label">Ville</div>
          <select
            className="filter-panel__select"
            value={filters.city}
            onChange={(e) => dispatch(setFilterCity(e.target.value))}
          >
            <option value="">Toutes</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {category === "Language spoken" && (
        <div className="filter-panel__section">
          <div className="filter-panel__label">Langue</div>
          <select
            className="filter-panel__select"
            value={filters.language}
            onChange={(e) => dispatch(setFilterLanguage(e.target.value))}
          >
            <option value="">Toutes</option>
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      )}

      {category === "Verified guides" && (
        <div className="filter-panel__section">
          <label className="filter-panel__checkbox">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => dispatch(setFilterVerified(e.target.checked))}
            />
            <span>Guides vérifiés uniquement</span>
          </label>
        </div>
      )}

      {category === "Speciality" && (
        <div className="filter-panel__section">
          <div className="filter-panel__label">Spécialité</div>
          <div className="filter-panel__tags">
            <button
              className={`filter-panel__tag ${!filters.speciality ? "filter-panel__tag--active" : ""}`}
              onClick={() => dispatch(setFilterSpeciality(""))}
            >Toutes</button>
            {specs.map((s) => (
              <button
                key={s}
                className={`filter-panel__tag ${filters.speciality === s ? "filter-panel__tag--active" : ""}`}
                onClick={() => dispatch(setFilterSpeciality(filters.speciality === s ? "" : s))}
              >{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const dispatch       = useDispatch();
  const searchQuery    = useSelector(selectSearchQuery);
  const filters        = useSelector(selectFilters);
  const filteredGuides = useSelector(selectFilteredGuides);
  const topGuides      = useSelector(selectTopGuides);
  const visibleCount   = useSelector(selectVisibleCount);
  const { goToGuide }  = useNavigation();

  const guidesToShow = filteredGuides.slice(0, visibleCount);
  const hasMore      = filteredGuides.length > visibleCount;

  const activeFiltersCount = [
    filters.minRating > 0,
    filters.city        !== "",
    filters.language    !== "",
    filters.verifiedOnly,
    filters.speciality  !== "",
    filters.availDay    !== "",
    filters.availHour   !== "",
  ].filter(Boolean).length;

  const handleGuideClick = (guide) => {
    dispatch(setSelectedGuide(guide));
    goToGuide(guide);
  };

  return (
    <div className="page-content">
      {/* ── Hero ── */}
      <div className="guide-page__hero">
        <img src="https://images.unsplash.com/photo-1539020140153-e479b8e201e7?w=1400" alt="Morocco" />
      </div>

      {/* ── Search bar ── */}
      <div className="guide-searchbar">
        <div className="guide-searchbar__inner">
          <span className="guide-searchbar__icon">🔍</span>
          <input
            className="guide-searchbar__input"
            placeholder="Rechercher par nom, ville, langue, spécialité..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          {searchQuery && (
            <button className="guide-searchbar__clear" onClick={() => dispatch(setSearchQuery(""))}>✕</button>
          )}
        </div>

        {(searchQuery || activeFiltersCount > 0) && (
          <div className="guide-searchbar__meta">
            <span className="guide-searchbar__count">
              {filteredGuides.length} guide{filteredGuides.length !== 1 ? "s" : ""} trouvé{filteredGuides.length !== 1 ? "s" : ""}
            </span>
            <button className="guide-searchbar__reset" onClick={() => dispatch(resetFilters())}>
              ✕ Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* ── Top Guides carousel ── */}
      <div className="guide-page__carousel-wrap">
        <h2 className="guide-page__carousel-title">Top Guides</h2>
        <div className="scroll-row">
          {topGuides.map((g) => (
            <GuideCard key={g.id} guide={g} onClick={() => handleGuideClick(g)} />
          ))}
        </div>
      </div>

      {/* ── Layout : sidebar + list ── */}
      <div className="guide-page__layout">

        {/* Sidebar */}
        <div className="filter-sidebar">
          <div className="filter-sidebar__header">
            <span className="filter-sidebar__title">Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="filter-sidebar__badge">{activeFiltersCount}</span>
            )}
          </div>

          {SIDEBAR_CATEGORIES.map(({ key, label }) => (
            <div
              key={key}
              className={`filter-item ${filters.category === key ? "filter-item--active" : ""}`}
              onClick={() => dispatch(setFilterCategory(key))}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>{label}</span>
              {/* green dot when availability has active values */}
              {key === "Availability" && (filters.availDay || filters.availHour) && (
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#6b9c3e", flexShrink: 0,
                }} />
              )}
            </div>
          ))}

          <FilterPanel />

          {/* Sort */}
          <div className="filter-sidebar__sort">
            <div className="filter-panel__label">Trier par</div>
            <select
              className="filter-panel__select"
              value={filters.sortBy}
              onChange={(e) => dispatch(setFilterSortBy(e.target.value))}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Guide list */}
        <div className="guide-page__list">
          {guidesToShow.length === 0 ? (
            <div className="guide-page__empty">
              <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>🔍</span>
              <p style={{ color: "#888", marginBottom: 14 }}>
                Aucun guide ne correspond à votre recherche.
              </p>
              <button className="btn btn-outline" onClick={() => dispatch(resetFilters())}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            guidesToShow.map((g) => (
              <GuideListItem key={g.id} guide={g} onClick={() => handleGuideClick(g)} />
            ))
          )}

          {hasMore && (
            <div className="load-more" onClick={() => dispatch(loadMore())}>
              Voir plus ({filteredGuides.length - visibleCount} restants) ▼
            </div>
          )}
        </div>
      </div>
    </div>
  );
}