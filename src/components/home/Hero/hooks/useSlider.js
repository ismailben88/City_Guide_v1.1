import { useState, useEffect, useRef, useCallback } from "react";
import { SLIDES, DURATION, TRANSITION } from "../heroData";

export function useSlider() {
  const [cur,  setCur]  = useState(0);
  const [prev, setPrev] = useState(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (busy || idx === cur) return;
      setBusy(true);
      setPrev(cur);
      setCur(idx);
      setTimeout(() => { setPrev(null); setBusy(false); }, TRANSITION);
    },
    [busy, cur],
  );

  const goNext = useCallback(() => goTo((cur + 1) % SLIDES.length), [cur, goTo]);
  const goPrev = useCallback(() => goTo((cur - 1 + SLIDES.length) % SLIDES.length), [cur, goTo]);

  const reset = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(goNext, DURATION);
  }, [goNext]);

  useEffect(() => {
    timer.current = setInterval(goNext, DURATION);
    return () => clearInterval(timer.current);
  }, [goNext]);

  return { cur, prev, goTo, goNext, goPrev, reset };
}
