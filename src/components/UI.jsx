// components/UI.jsx  — Stars, ImgCard, GuideCard, PlaceCard, CommentSection, SearchBar
import "../styles/Components.css";
import PlaceCard from "./placeCard/PlaceCard";

/* ── Stars ─────────────────────────────── */
export function Stars({ rating, size = "md" }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star star--${size} ${i <= rating ? "star--filled" : ""}`}>
          ★
        </span>
      ))}
    </span>
  );
}

/* ── ImgCard ────────────────────────────── */
export function ImgCard({ title, subtitle, img, onClick }) {
  return (
    <div className="img-card" onClick={onClick}>
      <img className="img-card__img" src={img} alt={title} />
      <div className="img-card__overlay">
        <div className="img-card__title">{title}</div>
        {subtitle && <div className="img-card__subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}

/* ── GuideCarouselCard ─────────────────── */


/* ── GuideListItem ──────────────────────── */
export function GuideListItem({ guide, onClick }) {
  return (
    <div className="guide-list-item" onClick={onClick}>
      <div className="guide-list-item__avatar-wrap">
        <img className="guide-list-item__avatar" src={guide.img} alt={guide.name} />
        <span className="guide-list-item__badge">{guide.verified ? <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#218521"><path d="m347-72-75-124-141-32 13-144-96-108 96-108-13-144 141-32 75-124 133 57 133-57 75 124 141 32-13 144 96 108-96 108 13 144-141 32-75 124-133-57-133 57Zm29-91 104-44 104 44 58-97 110-25-10-111 74-84-74-84 10-111-110-25-58-97-104 44-104-44-58 97-110 24 10 112-74 84 75 84-11 112 110 25 58 96Zm104-317Zm-51 144 238-237-51-51-187 186-85-84-51 51 136 135Z"/></svg> : ""}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div className="guide-list-item__name">{guide.name}</div>
        <div className="guide-list-item__meta"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#F19E39"><path d="M531-501q21-21 21-51t-21-51q-21-21-51-21t-51 21q-21 21-21 51t21 51q21 21 51 21t51-21Zm-51 310q119-107 179.5-197T720-549q0-105-68.5-174T480-792q-103 0-171.5 69T240-549q0 71 60.5 161T480-191Zm0 95Q323-227 245.5-339.5T168-549q0-134 89-224.5T480-864q133 0 222.5 90.5T792-549q0 97-77 209T480-96Zm0-456Z"/></svg>{guide.city}</div>
        <div className="guide-list-item__meta">🌐 {guide.languages.slice(0, 3).join(", ")} +</div>
      </div>
      <div className="guide-list-item__right">
        <Stars rating={guide.rating} />
        <div className="guide-list-item__read-more">Read more</div>
      </div>
    </div>
  );
}

/* ── PlaceCard ──────────────────────────── */
export function PlaceCardd({ place, onClick }) {
  return (
    <div className="place-card" onClick={onClick}>
      <img className="place-card__img" src={place.img} alt={place.title} />
      <div className="place-card__body">
        <div className="place-card__title">{place.title}</div>
        <Stars rating={place.rating} size="sm" />
        <div className="place-card__actions">
          <span className="place-card__action place-card__action--buy">Buy / rent</span>
          <span className="place-card__action place-card__action--learn">learn more</span>
          <span className="place-card__action place-card__action--share">share</span>
        </div>
      </div>
    </div>
  );
}

/* ── CommentSection ─────────────────────── */
export function CommentSection({ comments }) {
  return (
    <div className="comment-section">
      <div className="comment-section__title">Comments</div>

      {/* Input row */}
      <div className="comment-input-row">
        <div className="comment-input-avatar">👤</div>
        <input className="comment-input" placeholder="leave comment..." />
        <Stars rating={0} size="lg" />
      </div>
      <div className="comment-publish-row">
        <button className="btn btn-primary">Publish</button>
      </div>

      {/* Comment list */}
      {comments.map((c) => (
        <div key={c.id} className="comment-item">
          <div className="comment-item__header">
            <img className="comment-item__avatar" src={c.img} alt={c.user} />
            <span className="comment-item__user">{c.user}</span>
            <Stars rating={c.rating} />
          </div>
          <p className="comment-item__text">{c.text}</p>
          <div className="comment-item__meta">
            {c.likes} ♡ &nbsp; ▼ {c.dislikes} &nbsp; 🔴
          </div>
        </div>
      ))}
      <div className="load-more">load more</div>
    </div>
  );
}

/* ── SearchBar ──────────────────────────── */
export function SearchBar({ placeholder = "Explore..." }) {
  return (
    <div className="search-bar">
      <input className="search-bar__input" placeholder={placeholder} />
      <button className="search-bar__btn">🔍</button>
      <button className="search-bar__btn">⚙️</button>
      <button className="search-bar__btn">📅 Apr,05</button>
    </div>
  );
}
