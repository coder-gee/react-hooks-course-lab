// Supplied teaching fixture: native interval timing plus visible lifecycle counts.
// Every interval is capped at two minutes; page teardown also disposes forgotten ones.
export function createReservationTimers() {
  const ids = new Set<number>();
  const observers = new Set<() => void>();
  let setups = 0, cleanups = 0, ticks = 0;
  let snapshot = { active: 0, setups, cleanups, ticks };
  const notify = () => {
    snapshot = { active: ids.size, setups, cleanups, ticks };
    observers.forEach(fn => fn());
  };
  const clearInterval = (id: number) => {
    if (!ids.delete(id)) return;
    window.clearInterval(id);
    cleanups++;
    notify();
  };
  return {
    setInterval(callback: () => void, delay: number) {
      let elapsed = 0;
      const id = window.setInterval(() => {
        ticks++;
        elapsed += delay;
        callback();
        if (elapsed >= 120_000) clearInterval(id);
        else notify();
      }, delay);
      ids.add(id);
      setups++;
      notify();
      return id;
    },
    clearInterval,
    getSnapshot: () => snapshot,
    observe(fn: () => void) { observers.add(fn); return () => { observers.delete(fn); }; },
    dispose() { [...ids].forEach(clearInterval); },
    reset() {
      [...ids].forEach(clearInterval);
      setups = cleanups = ticks = 0;
      notify();
    },
  };
}
export type ReservationTimers = ReturnType<typeof createReservationTimers>;
export const checkoutReservationTimers = createReservationTimers();
