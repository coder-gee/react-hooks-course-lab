import { useEffect, useState } from "react";
import { createReservationTimers } from "../lib/reservationTimers";
import { CleanReservation, LeakingReservation } from "../demos/ReservationTimers";
import { TimerDiagnostic } from "./ReservationCountdown";

export function ReservationTimerLab({ fixed }: { fixed: boolean }) {
  const [timers] = useState(createReservationTimers);
  const [mounted, setMounted] = useState(true);
  useEffect(() => () => timers.dispose(), [timers]);
  return <div className="connection-lab">
    {mounted ? (fixed ? <CleanReservation timers={timers} /> : <LeakingReservation timers={timers} />)
      : <p>Countdown banner unmounted.</p>}
    <button className="button" onClick={() => setMounted(value => !value)}>
      {mounted ? "Unmount timer" : "Mount timer"}
    </button>
    <TimerDiagnostic timers={timers} compact />
    <details className="fineprint">
      <summary>Why can Run drop by 2?</summary>
      <p>The large countdown belongs to the currently mounted banner. The diagnostic belongs to the surrounding demo and counts every interval still running.</p>
      <ol>
        <li><strong>Mount A.</strong> A gets its own seconds state and setter. Its interval callback retains A’s setter.</li>
        <li><strong>Unmount A.</strong> Without cleanup, A’s interval keeps firing. It still calls A’s setter; it does not switch to a future banner’s setter.</li>
        <li><strong>Mount B.</strong> B gets separate state starting at 30 and its own setter. Old callbacks from A cannot update B’s countdown.</li>
        <li><strong>Development check.</strong> Strict Mode repeats B’s Effect setup. Without cleanup, two intervals remain for B. Both call B’s setter, each subtracting one: B drops by two per second.</li>
        <li><strong>Read the diagnostic.</strong> It totals old and current intervals. For example, one leaked A interval plus two B intervals means three active and three ticks per second, while B’s visible countdown drops by only two.</li>
      </ol>
      <p><strong>Fix:</strong> the returned cleanup clears the interval from its setup. Old instances stop contributing ticks, and the current instance has one interval. More leaked instances can raise the diagnostic to five or seven without making the current banner drop faster than two.</p>
    </details>
  </div>;
}
