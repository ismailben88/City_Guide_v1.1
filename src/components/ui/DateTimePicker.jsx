// components/ui/DateTimePicker.jsx
// Reusable calendar + time picker — matches the iOS-style design in the mockup
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

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 999;
  width: 300px;
  background: #3a3a3c;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  animation: ${fadeIn} 0.18s ease;
  user-select: none;
`;

// ── Header row ──
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const MonthTitle = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  &::after {
    content: "›";
    color: #f5890a;
    font-size: 18px;
    margin-left: 2px;
  }
`;

const NavBtn = styled.button`
  background: none;
  border: none;
  color: #f5890a;
  font-size: 18px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.15s;
  &:hover { background: rgba(245,137,10,0.15); }
`;

const NavGroup = styled.div`
  display: flex;
  gap: 4px;
`;

// ── Day-of-week header ──
const DowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
`;

const DowCell = styled.span`
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #8e8e93;
  padding: 4px 0;
  text-transform: uppercase;
`;

// ── Date grid ──
const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayBtn = styled.button`
  background: ${({ $today, $selected }) =>
    $selected ? "transparent" : "none"};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: ${({ $empty }) => ($empty ? "default" : "pointer")};
  color: ${({ $today, $selected, $empty }) =>
    $empty
      ? "transparent"
      : $today && !$selected
      ? "#f5890a"
      : $selected
      ? "#fff"
      : "#fff"};
  position: relative;
  transition: background 0.15s;

  /* today ring */
  ${({ $today, $selected }) =>
    $today && !$selected &&
    `box-shadow: 0 0 0 1.5px #f5890a;`}

  /* selected fill */
  ${({ $selected }) =>
    $selected &&
    `background: rgba(245,137,10,0.7);`}

  &:hover {
    background: ${({ $empty, $selected }) =>
      $empty ? "none" : $selected ? "rgba(245,137,10,0.7)" : "rgba(255,255,255,0.12)"};
  }
`;

// ── Time row ──
const TimeDivider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 12px 0 10px;
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TimeLabel = styled.span`
  color: #fff;
  font-size: 15px;
  font-weight: 500;
`;

const TimeInput = styled.input`
  background: #636366;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  padding: 5px 10px;
  width: 90px;
  text-align: center;
  outline: none;
  cursor: pointer;
  &::-webkit-calendar-picker-indicator { display: none; }
`;

// ─── constants ───────────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

// ─── DateTimePicker component ─────────────────────────────────────────────────
export function DateTimePicker({ value, onChange, children }) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  const today = new Date();
  const init  = value ? new Date(value) : today;

  const [viewYear,  setViewYear]  = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());
  const [selDate,   setSelDate]   = useState(value ? init.getDate() : today.getDate());
  const [selMonth,  setSelMonth]  = useState(value ? init.getMonth() : today.getMonth());
  const [selYear,   setSelYear]   = useState(value ? init.getFullYear() : today.getFullYear());
  const [timeStr,   setTimeStr]   = useState(
    init.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  );

  // close on outside click
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day) => {
    if (!day) return;
    setSelDate(day);
    setSelMonth(viewMonth);
    setSelYear(viewYear);
    onChange?.({ date: new Date(viewYear, viewMonth, day), timeStr });
  };

  const handleTime = (e) => {
    setTimeStr(e.target.value);
    onChange?.({ date: new Date(selYear, selMonth, selDate), timeStr: e.target.value });
  };

  const cells = buildCalendar(viewYear, viewMonth);

  const isSelected = (day) =>
    day && day === selDate && viewMonth === selMonth && viewYear === selYear;

  const isToday = (day) =>
    day &&
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  return (
    <Wrap ref={ref}>
      {/* trigger — whatever you pass as children, or a default button */}
      <span onClick={() => setOpen(o => !o)} style={{ cursor: "pointer" }}>
        {children}
      </span>

      {open && (
        <Panel>
          {/* ── Month header ── */}
          <Header>
            <MonthTitle>{MONTHS[viewMonth]} {viewYear}</MonthTitle>
            <NavGroup>
              <NavBtn onClick={prevMonth}>‹</NavBtn>
              <NavBtn onClick={nextMonth}>›</NavBtn>
            </NavGroup>
          </Header>

          {/* ── Day of week labels ── */}
          <DowGrid>
            {DAYS_OF_WEEK.map(d => <DowCell key={d}>{d}</DowCell>)}
          </DowGrid>

          {/* ── Date cells ── */}
          <DateGrid>
            {cells.map((day, i) => (
              <DayBtn
                key={i}
                $empty={!day}
                $today={isToday(day)}
                $selected={isSelected(day)}
                onClick={() => selectDay(day)}
              >
                {day ?? ""}
              </DayBtn>
            ))}
          </DateGrid>

          {/* ── Time ── */}
          <TimeDivider />
          <TimeRow>
            <TimeLabel>Time</TimeLabel>
            <TimeInput
              type="time"
              value={timeStr}
              onChange={handleTime}
            />
          </TimeRow>
        </Panel>
      )}
    </Wrap>
  );
}
