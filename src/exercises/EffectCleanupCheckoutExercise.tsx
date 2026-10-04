import { useEffect, useState } from "react";
import StateCheckoutReference from "../references/StateCheckoutReference";
import { checkoutReservationTimers } from "../lib/reservationTimers";
import { ReservationCountdown } from "../components/ReservationCountdown";

// UI, styles, state and interval service are supplied. The countdown is inactive.
export default function EffectCleanupCheckoutExercise() {
  return <StateCheckoutReference detailsContent={<ReservationTimer />} />;
}

// Only the Details view mounts this child; Review unmounts it.
function ReservationTimer() {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    // TODO 1: start checkoutReservationTimers.setInterval(callback, 1000)
    // and keep the returned interval identifier.
    // TODO 2: inside the callback, use setSeconds with a functional updater
    // to subtract one without going below zero. Hint:
    // setSeconds(previous => Math.max(0, previous - 1));
    // previous is the pending state value React supplies to this updater.
    // Keep the updater pure: calculate the next number, with no side effects.
    // Clamping to zero changes the number; it does NOT clear the interval.
    // TODO 3: return cleanup that calls checkoutReservationTimers.clearInterval
    // with that same identifier.
    // Remove these compile-only placeholders when you implement the steps:
    void checkoutReservationTimers;
    void setSeconds;
  }, []);
  return <ReservationCountdown seconds={seconds} />;
}
