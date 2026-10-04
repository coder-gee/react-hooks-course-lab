import { useEffect, useRef, useState } from "react";
import { checkoutConnection } from "../lib/connectivity";
import type { createConnectivity } from "../lib/connectivity";

// @snippet local
export function LocalQuantity() {
  let quantity = 1;
  function addOne() {
    quantity += 1; // Changes a variable; doesn't request a render.
    console.log("Local quantity:", quantity);
  }
  return (
    <div className="demo-counter">
      <small className="demo-product-label">EXPLORER PACK · $24 EACH</small>
      <output aria-label="Demo quantity">{quantity}</output>
      <button onClick={addOne}>Add one</button>
    </div>
  );
}
// @end local

// @snippet state
export function StateQuantity() {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="demo-counter">
      <small className="demo-product-label">EXPLORER PACK · $24 EACH</small>
      <output aria-label="Demo quantity">{quantity}</output>
      <button onClick={() => setQuantity((q) => q + 1)}>Add one</button>
    </div>
  );
}
// @end state

// @snippet batching
export function BatchedReset() {
  const [quantity, setQuantity] = useState(3);
  const [note, setNote] = useState("Happy birthday!");
  function handleReset() {
    setQuantity(1);
    setNote("");
  }
  return (
    <div className="batching-result">
      <p>Quantity: <output aria-label="Demo quantity">{quantity}</output></p>
      <p>Note: <output aria-label="Demo note">{note || "No note"}</output></p>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
// @end batching

// @snippet direct
export function DirectUpdates() {
  const [quantity, setQuantity] = useState(1);
  function addTwo() {
    setQuantity(quantity + 1);
    setQuantity(quantity + 1); // Same render's quantity, again.
    console.log("Quantity in this handler:", quantity);
  }
  return (
    <div className="demo-counter">
      <small className="demo-product-label">EXPLORER PACK · $24 EACH</small>
      <output aria-label="Demo quantity">{quantity}</output>
      <button onClick={addTwo}>Add two?</button>
    </div>
  );
}
// @end direct

// @snippet queued
export function QueuedUpdates() {
  const [quantity, setQuantity] = useState(1);
  function addTwo() {
    setQuantity((q) => q + 1);
    setQuantity((q) => q + 1); // Receives the pending value.
    console.log("Quantity in this handler:", quantity);
  }
  return (
    <div className="demo-counter">
      <small className="demo-product-label">EXPLORER PACK · $24 EACH</small>
      <output aria-label="Demo quantity">{quantity}</output>
      <button onClick={addTwo}>Add two</button>
    </div>
  );
}
// @end queued

// @snippet consistent
export function ConsistentCheckout() {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const total = 24 * quantity;
  return (
    <div className="mini-checkout">
      <button onClick={() => setQuantity((q) => q + 1)}>
        Quantity: {quantity} · add one
      </button>
      <label>
        Order note
        <input
          maxLength={100}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>
      <p>{note.length}/100 characters</p>
      <strong>Pack total: ${total}</strong>
    </div>
  );
}
// @end consistent

// @snippet title
export function TitleSync() {
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    document.title = `Live demo · Quantity ${quantity}`;
  }, [quantity]);
  return (
    <div className="demo-counter">
      <small className="demo-product-label">EXPLORER PACK · $24 EACH</small>
      <output>{quantity}</output>
      <button onClick={() => setQuantity((q) => q + 1)}>Add one</button>
    </div>
  );
}
// @end title

// This prop supplies the same stable teaching fixture used by the classroom lab.
type Connection = ReturnType<typeof createConnectivity>;
// @snippet leaking
export function LeakingStatus({ connection }: { connection: Connection }) {
  const [online, setOnline] = useState(connection.read);
  useEffect(() => {
    connection.subscribe(setOnline);
    // What happens when this component leaves?
  }, [connection]);
  return (
    <div className={`connection ${online ? "" : "offline"}`}>
      <i />
      {online ? "Reports online" : "Reports offline"}
    </div>
  );
}
// @end leaking

// @snippet cleaned
export function CleanStatus({ connection }: { connection: Connection }) {
  const [online, setOnline] = useState(connection.read);
  useEffect(() => {
    setOnline(connection.read());
    const unsubscribe = connection.subscribe(setOnline);
    return unsubscribe;
  }, [connection]);
  return (
    <div className={`connection ${online ? "" : "offline"}`}>
      <i />
      {online ? "Reports online" : "Reports offline"}
    </div>
  );
}
// @end cleaned

// @snippet focus
export function FocusNote() {
  const [note, setNote] = useState("");
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    noteRef.current?.focus();
  }, []);
  return (
    <div className="mini-checkout">
      <label>
        Order note
        <textarea ref={noteRef} value={note}
          onChange={(event) => setNote(event.target.value)} />
      </label>
      <p>{note.length} characters · state drives this text</p>
      <p>The note field focuses when this component mounts.</p>
    </div>
  );
}
// @end focus

// @snippet lab2
export function StudentStatus() {
  const [online, setOnline] = useState(checkoutConnection.read);
  useEffect(() => {
    checkoutConnection.subscribe(setOnline);
    // TODO LAB 2: return the supplied unsubscribe function.
  }, []);
  return <p>{online ? "Browser reports online" : "Browser reports offline"}</p>;
}
// @end lab2
