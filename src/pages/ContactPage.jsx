// pages/ContactPage.jsx
import "../styles/Pages.css";

export default function ContactPage() {
  return (
    <div className="page-content">
      <div className="info-page">
        <h1 className="info-page__title">Contact Us</h1>
        <p className="info-page__text">
          We'd love to hear from you! Whether you have a question about our platform, want to
          become a verified guide, or need help with your account — our team is here to help.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 460 }}>
          {[
            ["Your Name", "text"],
            ["Email Address", "email"],
            ["Subject", "text"],
          ].map(([placeholder, type]) => (
            <input
              key={placeholder}
              type={type}
              placeholder={placeholder}
              style={{
                padding: "11px 14px",
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
              }}
            />
          ))}
          <textarea
            placeholder="Your message..."
            rows={5}
            style={{
              padding: "11px 14px",
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              resize: "vertical",
            }}
          />
          <button className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "11px 28px", fontSize: 14 }}>
            Send Message
          </button>
        </div>

        <div style={{ marginTop: 36 }}>
          <p className="info-page__text">✉️ CityGuide@gmail.com</p>
          <p className="info-page__text">📷 @CityGuide</p>
          <p className="info-page__text">🐦 @CityGuide</p>
        </div>
      </div>
    </div>
  );
}
