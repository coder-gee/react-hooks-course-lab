import { useEffect, useState } from "react";
import StateCheckoutReference from "./StateCheckoutReference";
import { checkoutReservationTimers } from "../lib/reservationTimers";
import { ReservationCountdown } from "../components/ReservationCountdown";

export default function EffectCleanupCheckoutReference() {
  return <StateCheckoutReference detailsContent={<ReservationTimer />} />;
}

// Only the Details view mounts this child; Review unmounts it.
function ReservationTimer() {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    const intervalId = checkoutReservationTimers.setInterval(() => {
      setSeconds(remaining => Math.max(0, remaining - 1));
    }, 1000);
    return () => checkoutReservationTimers.clearInterval(intervalId);
  }, []);
  return <ReservationCountdown seconds={seconds} />;
}
