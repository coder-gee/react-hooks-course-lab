import { useEffect, useState } from "react";
import type { ReservationTimers } from "../lib/reservationTimers";
import { ReservationCountdown } from "../components/ReservationCountdown";

// @snippet leakingTimer
export function LeakingReservation({ timers }: { timers: ReservationTimers }) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    timers.setInterval(() => {
      setSeconds(remaining => Math.max(0, remaining - 1));
    }, 1000);
    // Missing cleanup: the interval keeps ticking after unmount.
  }, [timers]);
  return <ReservationCountdown seconds={seconds} demo />;
}
// @end leakingTimer

// @snippet cleanedTimer
export function CleanReservation({ timers }: { timers: ReservationTimers }) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    const intervalId = timers.setInterval(() => {
      setSeconds(remaining => Math.max(0, remaining - 1));
    }, 1000);
    return () => timers.clearInterval(intervalId);
  }, [timers]);
  return <ReservationCountdown seconds={seconds} demo />;
}
// @end cleanedTimer
