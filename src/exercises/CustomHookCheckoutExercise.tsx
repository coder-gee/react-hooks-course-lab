import { useEffect, useRef, useState } from "react";
import StateCheckoutReference from "../references/StateCheckoutReference";
import "../components/sale-topbar.css";
import { ReservationCountdown } from "../components/ReservationCountdown";

// TODO 1: create src/exercises/hooks/useCountdown.ts (a NEW file, not a rename).
// Export useCountdown(initialSeconds), then import it here from "./hooks/useCountdown".
// Move the banner's working state, timer ref and Effect into that file; return seconds.
// Move the React Hook imports there too once both callers use the new Hook.
// The initial duration is used on mount. Cleanup clears this caller's timer.

// Only Details mounts this caller. Review unmounts it; Edit mounts a fresh timer.
function FlashSaleTimer() {
  // TODO 2: replace this inline logic with a call to your extracted Hook.
  const [seconds, setSeconds] = useState(30);
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
  return <ReservationCountdown seconds={seconds} />;
}
// This independent caller stays mounted in Review and unmounts on leaving the lab.
function TopBarSaleTimer() {
  // TODO 3: reuse your Hook here with 45 seconds instead of duplicating logic.
  const [seconds, setSeconds] = useState(45);
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
  return <div className="sale-topbar" aria-label="Top bar sale countdown">
    <span>SALE <output aria-label="Top bar sale seconds">{seconds}s</output></span>
  </div>;
}
export default function CustomHookCheckoutExercise() {
  return <StateCheckoutReference detailsContent={<FlashSaleTimer />} topbarContent={<TopBarSaleTimer />} />;
}
