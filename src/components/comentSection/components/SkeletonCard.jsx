export default function SkeletonCard({ delay = 0 }) {
  return (
    <div style={{
      background: "white", border: "1.5px solid #F3EDE2",
      borderRadius: "24px", padding: "20px 22px",
      animation: `cs_shimmer 1.6s ease-in-out ${delay}s infinite`,
    }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F3EDE2", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 13, width: "38%", background: "#F3EDE2", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 10, width: "22%", background: "#FAF7F2", borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ paddingLeft: 56, marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
        {[100, 85, 65].map((w, i) => (
          <div key={i} style={{ height: 11, background: "#FAF7F2", borderRadius: 8, width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
