import { useEffect, useRef, useState } from "react";

// Extracted timer logic: each caller owns its state, timer ref and Effect.
export function useCountdown(initialSeconds = 30) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(previous => Math.max(0, previous - 1));
    }, 1000);
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, []);
  return seconds;
}
