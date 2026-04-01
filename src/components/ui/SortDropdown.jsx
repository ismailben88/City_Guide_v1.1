// components/ui/SortDropdown.jsx
// Reusable "sort by" dropdown — triggered by any child element
import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// ─── animations ──────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

// ─── styled components ────────────────────────────────────────────────────────
const Wrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 999;
  min-width: 200px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.13);
  padding: 6px 0;
  animation: ${fadeIn} 0.15s ease;
  border: 1px solid var(--color-border, #eee);
`;

const MenuLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-muted, #aaa);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding: 8px 14px 4px;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--color-border, #eee);
  margin: 4px 0;
`;

const Option = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 9px 14px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ $active }) => ($active ? "var(--color-primary, #2d6a4f)" : "var(--color-dark, #1a1a1a)")};
  font-weight: ${({ $active }) => ($active ? "700" : "400")};
  transition: background 0.13s;

  &:hover {
    background: var(--color-primary-bg, #eaf4ee);
  }

  /* checkmark for active */
  &::after {
    content: ${({ $active }) => ($active ? '"✓"' : '""')};
    margin-left: auto;
    color: var(--color-primary, #2d6a4f);
    font-size: 13px;
  }
`;

// ─── default sort options ─────────────────────────────────────────────────────
const DEFAULT_OPTIONS = [
  { value: "recent",   label: "Most Recent",   icon: "🕐" },
  { value: "oldest",   label: "Oldest First",  icon: "🕰" },
  { value: "unread",   label: "Unread First",  icon: "🔵" },
  { value: "az",       label: "A → Z",         icon: "🔤" },
];

// ─── SortDropdown component ───────────────────────────────────────────────────
export function SortDropdown({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  label = "Sort by",
  children,
}) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);

  // close on outside click
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const select = (val) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <Wrap ref={ref}>
      <span onClick={() => setOpen(o => !o)} style={{ cursor: "pointer" }}>
        {children}
      </span>

      {open && (
        <Menu>
          <MenuLabel>{label}</MenuLabel>
          <Divider />
          {options.map((opt) => (
            <Option
              key={opt.value}
              $active={value === opt.value}
              onClick={() => select(opt.value)}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </Option>
          ))}
        </Menu>
      )}
    </Wrap>
  );
}
