// components/Logo.jsx
import "../styles/global.css";

export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none">
      {/* Right half — green */}
      <path
        d="M50 0 C77.6 0 100 22.4 100 50 C100 85 50 120 50 120 L50 0 Z"
        fill="#6b9c3e"
      />
      {/* Left half — dark brown */}
      <path
        d="M50 0 C22.4 0 0 22.4 0 50 C0 85 50 120 50 120 L50 0 Z"
        fill="#3d2b1a"
      />
      {/* Orange accent triangle */}
      <path d="M50 80 L75 100 L50 120 Z" fill="#c8761a" />
      {/* Cream circle bg */}
      <circle cx="50" cy="46" r="28" fill="#c8d98a" />
      {/* Green inner circle */}
      <circle cx="50" cy="46" r="21" fill="#6b9c3e" />
      {/* City skyline silhouette */}
      <g fill="#c8d98a">
        <rect x="34" y="40" width="4" height="13" rx="1" />
        <rect x="40" y="36" width="4" height="17" rx="1" />
        <rect x="46" y="31" width="5" height="22" rx="1" />
        <rect x="53" y="35" width="4" height="18" rx="1" />
        <rect x="59" y="39" width="4" height="14" rx="1" />
        {/* Windows */}
        <rect x="35" y="43" width="2" height="2" fill="#6b9c3e" />
        <rect x="41" y="39" width="2" height="2" fill="#6b9c3e" />
        <rect x="47" y="34" width="2" height="2" fill="#6b9c3e" />
        <rect x="54" y="38" width="2" height="2" fill="#6b9c3e" />
        <rect x="60" y="42" width="2" height="2" fill="#6b9c3e" />
      </g>
    </svg>
  );
}
