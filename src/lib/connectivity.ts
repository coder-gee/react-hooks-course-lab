// Supplied teaching fixture. Application code only needs read() and subscribe().
// Browser online/offline reports connection hints, NOT whether a server is reachable.
export function createConnectivity() {
  let online = typeof navigator === "undefined" ? true : navigator.onLine;
  let simulated = false;
  let setups = 0,
    cleanups = 0;
  const listeners = new Set<(online: boolean) => void>();
  const diagnostics = new Set<() => void>();
  let snapshot = { online, simulated, active: 0, setups, cleanups };
  const notify = () => {
    snapshot = { online, simulated, active: listeners.size, setups, cleanups };
    diagnostics.forEach((fn) => fn());
  };
  const setOnline = (next: boolean) => {
    online = next;
    listeners.forEach((fn) => fn(online));
    notify();
  };
  const browserOnline = () => {
    if (!simulated) setOnline(true);
  };
  const browserOffline = () => {
    if (!simulated) setOnline(false);
  };
  return {
    read: () => (simulated ? online : navigator.onLine),
    subscribe(listener: (online: boolean) => void) {
      if (listeners.size === 0) {
        if (!simulated) online = navigator.onLine;
        window.addEventListener("online", browserOnline);
        window.addEventListener("offline", browserOffline);
      }
      listeners.add(listener);
      setups++;
      notify();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        if (!listeners.has(listener)) return;
        listeners.delete(listener);
        cleanups++;
        if (listeners.size === 0) {
          window.removeEventListener("online", browserOnline);
          window.removeEventListener("offline", browserOffline);
        }
        notify();
      };
    },
    simulate(next: boolean) {
      simulated = true;
      setOnline(next);
    },
    useBrowser() {
      simulated = false;
      setOnline(navigator.onLine);
    },
    getSnapshot: () => snapshot,
    observe(fn: () => void) {
      diagnostics.add(fn);
      return () => {
        diagnostics.delete(fn);
      };
    },
    reset() {
      listeners.clear();
      window.removeEventListener("online", browserOnline);
      window.removeEventListener("offline", browserOffline);
      simulated = false;
      online = navigator.onLine;
      setups = 0;
      cleanups = 0;
      notify();
    },
    dispose() {
      cleanups += listeners.size;
      listeners.clear();
      window.removeEventListener("online", browserOnline);
      window.removeEventListener("offline", browserOffline);
      notify();
    },
  };
}
export const checkoutConnection = createConnectivity();
