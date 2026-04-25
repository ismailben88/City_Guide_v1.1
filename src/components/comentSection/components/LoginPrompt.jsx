export default function LoginPrompt() {
  return (
    <div style={{
      background: "white", border: "1.5px dashed #E8DFD0",
      borderRadius: "24px", padding: "24px", textAlign: "center",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>💬</div>
      <p style={{ margin: 0, fontSize: "13.5px", color: "#7A6A58" }}>
        Vous souhaitez partager votre expérience ?{" "}
        <a href="/login" style={{ color: "#d57a2a", fontWeight: 800, textDecoration: "none" }}>
          Connectez-vous
        </a>{" "}
        pour laisser un avis.
      </p>
    </div>
  );
}
