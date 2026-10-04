import { useEffect, useRef, useState } from "react";
// @snippet custom
export function useCountdown(initialSeconds = 30) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [restartVersion, setRestartVersion] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    setSeconds(initialSeconds);
    const timer = setInterval(() => {
      setSeconds(previous => Math.max(0, previous - 1));
    }, 1000);
    timerRef.current = timer;
    return () => {
      clearInterval(timer);
      if (timerRef.current === timer) timerRef.current = null;
    };
  }, [initialSeconds, restartVersion]);
  function stop() {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    timerRef.current = null;
  }
  return { seconds, stop, restart: () => setRestartVersion(v => v + 1) };
}
// @end custom
