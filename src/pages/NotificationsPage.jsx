// pages/NotificationsPage.jsx
import { useState } from "react";
import { notifications, notificationCategories } from "../data/index";
import "../styles/Pages.css";

export default function NotificationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? notifications
      : notifications.filter((n) => n.category === activeCategory);

  return (
    <div className="notif-page page-content">
      {/* ── Sidebar ── */}
      <div className="notif-sidebar">
        <div className="notif-sidebar__title">Notifications</div>
        {notificationCategories.map((cat) => (
          <div
            key={cat}
            className={`notif-cat ${activeCategory === cat ? "notif-cat--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="notif-content">
        {/* Toolbar */}
        <div className="notif-toolbar">
          <input className="notif-toolbar__input" placeholder="search" />
          <button className="notif-toolbar__btn">📅 Apr,05</button>
          <button className="notif-toolbar__btn">♡</button>
          <button className="notif-toolbar__btn">🗑️</button>
          <button className="notif-toolbar__btn">🕐</button>
        </div>

        {/* Notification items */}
        {filtered.map((n) => (
          <div key={n.id} className="notif-item">
            <div className="notif-item__row">
              <span className="notif-item__icon">{n.icon}</span>
              <p className="notif-item__text">{n.text}</p>
              <div className="notif-item__actions">
                <button className="notif-item__action-btn">♡</button>
                <button className="notif-item__action-btn">🗑️</button>
              </div>
            </div>
            <div className="notif-item__meta">
              {n.date} &nbsp;&nbsp; {n.time}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#aaa", padding: 40, fontSize: 14 }}>
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
