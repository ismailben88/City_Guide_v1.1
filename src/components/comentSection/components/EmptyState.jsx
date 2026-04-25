export default function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "52px 24px", background: "white",
      border: "1.5px dashed #E8DFD0", borderRadius: "24px", gap: "10px",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <span style={{ fontSize: "38px" }}>💬</span>
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#7A6A58" }}>
        Aucun avis pour le moment
      </p>
      <p style={{ margin: 0, fontSize: "12px", color: "#B0A090" }}>
        Soyez le premier à partager votre expérience !
      </p>
    </div>
  );
}
