export default function AlertBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "12px 16px", background: "#FEF2F2",
      border: "1px solid #FECACA", borderRadius: "14px",
      fontSize: "13px", color: "#DC2626",
      animation: "cs_fadeIn 0.2s ease",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <span style={{ fontSize: "16px" }}>⚠️</span>
      {message}
    </div>
  );
}
