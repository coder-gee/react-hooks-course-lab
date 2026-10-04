import "./reservation-countdown.css";
import { useSyncExternalStore } from "react";
import { checkoutReservationTimers, type ReservationTimers } from "../lib/reservationTimers";

export function ReservationCountdown({ seconds, demo = false }: { seconds: number; demo?: boolean }) {
  const time = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  return <aside className="flash-sale-countdown" aria-label="Flash sale countdown">
    <div><span className="eyebrow">FLASH SALE COUNTDOWN</span>
      <strong>{seconds === 0 ? "Demo countdown finished" : "Your demo sale window"}</strong>
      <p>{demo ? "Local demo · Unmount and remount this banner to test cleanup." : "Local demo · Review stops the timer. Edit details starts a new 30 seconds."}</p>
    </div>
    <output aria-label="Flash sale time remaining">{time}</output>
  </aside>;
}
export function TimerDiagnostic({ timers = checkoutReservationTimers, compact = false }: { timers?: ReservationTimers; compact?: boolean }) {
  const stats = useSyncExternalStore(timers.observe, timers.getSnapshot);
  return <div className={`checkout-diagnostic timer-diagnostic${compact ? " compact" : ""}`} aria-label="Countdown timer diagnostics">
    <span><b>{stats.active}</b> active timers{!compact && <> · {stats.setups} setups · {stats.cleanups} cleanups</>}</span>
    <span className="timer-ticks"><output aria-label="Timer ticks">{stats.ticks}</output> timer ticks</span>
    <small>{compact ? "Unmount the banner: Fix stops ticks; Run leaves its interval running." : "Watch this counter in Review: continued ticks expose missing cleanup. Working reference: zero active timers in Review; one on Edit details."}</small>
  </div>;
}
