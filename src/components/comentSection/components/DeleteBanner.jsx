import Btn from "./Btn";

export default function DeleteBanner({ onConfirm, onCancel }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "12px 14px", marginTop: "12px",
      background: "#FEF2F2", border: "1px solid #FECACA",
      borderRadius: "14px", animation: "cs_fadeIn 0.2s ease",
    }}>
      <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
      <p style={{ flex: 1, margin: 0, fontSize: "12px", color: "#DC2626", fontWeight: 500 }}>
        Supprimer cet avis définitivement ?
      </p>
      <Btn ghost onClick={onCancel} small>Annuler</Btn>
      <Btn danger onClick={onConfirm} small>Supprimer</Btn>
    </div>
  );
}
