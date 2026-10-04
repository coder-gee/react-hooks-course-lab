import { useEffect, useState, useSyncExternalStore } from "react";
import { createConnectivity, checkoutConnection } from "../lib/connectivity";
import { CleanStatus, LeakingStatus } from "../demos/Examples";
export function ConnectionLab({ fixed }: { fixed: boolean }) {
  const [connection] = useState(createConnectivity);
  const [mounted, setMounted] = useState(true);
  const stats = useSyncExternalStore(
    connection.observe,
    connection.getSnapshot,
  );
  useEffect(() => () => connection.dispose(), [connection]);
  return (
    <div className="connection-lab">
      <div className="diagnostic-stats">
        <div>
          <strong>{stats.active}</strong>
          <span>active subscriptions</span>
        </div>
        <div>
          <strong>{stats.setups}</strong>
          <span>setups</span>
        </div>
        <div>
          <strong>{stats.cleanups}</strong>
          <span>cleanups</span>
        </div>
      </div>
      <div className="mount-target">
        {mounted ? (
          fixed ? (
            <CleanStatus connection={connection} />
          ) : (
            <LeakingStatus connection={connection} />
          )
        ) : (
          <p>Checkout status is unmounted.</p>
        )}
      </div>
      <button className="button" onClick={() => setMounted((x) => !x)}>
        {mounted ? "Unmount status" : "Mount status"}
      </button>
      <div className="simulation-controls">
        <span>Connection simulator</span>
        <button
          className={!stats.online ? "selected" : ""}
          onClick={() => connection.simulate(false)}
        >
          Offline
        </button>
        <button
          className={stats.online ? "selected" : ""}
          onClick={() => connection.simulate(true)}
        >
          Online
        </button>
      </div>
      <p className="fineprint">
        Deterministic simulation; your network is unchanged. Development Strict
        Mode can add a setup–cleanup cycle. Check the final active count.
      </p>
    </div>
  );
}
export function CheckoutDiagnostic() {
  const stats = useSyncExternalStore(
    checkoutConnection.observe,
    checkoutConnection.getSnapshot,
  );
  return (
    <div className="checkout-diagnostic">
      <span>
        <b>{stats.active}</b> active · {stats.setups} setups · {stats.cleanups}{" "}
        cleanups
      </span>
      <div>
        <button onClick={() => checkoutConnection.simulate(false)}>
          Simulate offline
        </button>
        <button onClick={() => checkoutConnection.simulate(true)}>
          Simulate online
        </button>
        <button onClick={() => checkoutConnection.useBrowser()}>
          Use browser
        </button>
      </div>
      <small>
        {stats.simulated
          ? "Simulator active; real network unchanged."
          : "Using browser connectivity hint; not a server reachability test."}
      </small>
    </div>
  );
}
