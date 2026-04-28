// Shared primitives for the settings section

export function PSCard({ children, className = '' }) {
  return (
    <div className={`ps-card ${className}`} style={{ padding: 'var(--ps-pad)' }}>
      {children}
    </div>
  );
}

export function PSCardHead({ eyebrow, eyebrowIcon, title, subtitle, right }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: 'var(--ps-ink-3)', letterSpacing: '0.06em' }}>
          {eyebrowIcon} {eyebrow}
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          {title && (
            <h3 className="m-0 text-[18px] font-semibold leading-tight" style={{ fontFamily: 'var(--ps-font-display)', color: 'var(--ps-ink)' }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="m-0 mt-1 text-[12px] leading-relaxed" style={{ color: 'var(--ps-ink-3)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {right && <div className="flex-shrink-0">{right}</div>}
      </div>
    </div>
  );
}

export function Toggle({ isOn, onChange, label, disabled = false }) {
  return (
    <button
      role="switch"
      aria-checked={isOn}
      onClick={disabled ? undefined : onChange}
      aria-label={label}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2"
      style={{
        width: 36, height: 20, padding: '2px', border: 'none', cursor: disabled ? 'default' : 'pointer',
        background: isOn ? 'var(--ps-green)' : 'var(--ps-line-2)',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        className="block rounded-full bg-white transition-transform duration-200"
        style={{
          width: 16, height: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transform: isOn ? 'translateX(16px)' : 'translateX(0)',
        }}
      />
    </button>
  );
}

export function Chip({ selected, onClick, children }) {
  return (
    <button
      aria-pressed={selected}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-150 border"
      style={{
        background:   selected ? 'var(--ps-green-soft)' : 'transparent',
        borderColor:  selected ? 'var(--ps-green-2)'    : 'var(--ps-line)',
        color:        selected ? 'var(--ps-green-2)'    : 'var(--ps-ink-3)',
        cursor: 'pointer',
        fontFamily: 'var(--ps-font-ui)',
      }}
    >
      {selected && <span>✓</span>} {children}
    </button>
  );
}

export function ProgressBar({ value }) {
  return (
    <div className="ps-progress">
      <div className="ps-progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function BadgeMini({ children, color = 'green' }) {
  const styles = {
    green:  { background: 'var(--ps-green-soft)',  color: 'var(--ps-green-2)'  },
    orange: { background: 'var(--ps-orange-soft)', color: 'var(--ps-orange)'   },
    danger: { background: '#fde8e0',               color: 'var(--ps-danger)'   },
  };
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={styles[color] || styles.green}>
      {children}
    </span>
  );
}

export function PSFieldLabel({ children }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--ps-ink-3)' }}>
      {children}
    </label>
  );
}

export function PSInput({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`ps-field-input ${className}`}
    />
  );
}

export function PSTextarea({ value, onChange, placeholder, maxLength, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      className="ps-field-textarea"
    />
  );
}

export function PSSelect({ value, onChange, children, className = '' }) {
  return (
    <select value={value} onChange={onChange} className={`ps-field-select ${className}`}>
      {children}
    </select>
  );
}

export function PsBtnPrimary({ onClick, children, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-opacity duration-150"
      style={{ background: 'var(--ps-green)', color: '#fff', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, fontFamily: 'var(--ps-font-ui)' }}
    >
      {children}
    </button>
  );
}

export function PsBtnOutline({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-150 hover:border-[--ps-ink-3]"
      style={{ background: 'transparent', border: '1px solid var(--ps-line)', color: 'var(--ps-ink-2)', cursor: 'pointer', fontFamily: 'var(--ps-font-ui)' }}
    >
      {children}
    </button>
  );
}

export function PsBtnGhost({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium transition-colors duration-150"
      style={{ background: 'transparent', border: 'none', color: 'var(--ps-ink-3)', cursor: 'pointer', fontFamily: 'var(--ps-font-ui)' }}
    >
      {children}
    </button>
  );
}
