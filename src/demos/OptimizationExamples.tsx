import { memo, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import "./optimization-examples.css";

// @snippet live-offers
type Offer = { id: string; name: string };
const sampleOffers: Offer[] = Array.from({ length: 500 }, (_, index) => ({
  id: String(index + 1),
  name: ["Travel backpack", "School backpack", "Water bottle", "Notebook"][index % 4] + ` offer ${index + 1}`,
}));
// @end live-offers
// @snippet live-uncached
export function UncachedOffers({ offers = sampleOffers }: { offers?: Offer[] }) {
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  console.log("Filtering offers · Run");
  const matchingOffers = offers.filter(offer =>
    offer.name.toLowerCase().includes(query.toLowerCase())
  );
  const preview = matchingOffers.slice(0, 5);
  return <section className="optimization-demo" aria-label="Offer filter example">
    <label>Search offers<input value={query}
      onChange={event => setQuery(event.target.value)} /></label>
    <label>Unrelated order note<input value={note}
      onChange={event => setNote(event.target.value)} /></label>
    <p>Total matches: <output aria-label="Total matches">{matchingOffers.length}</output></p>
    <p>Showing first {preview.length} of {matchingOffers.length} matching offers.</p>
    <ul aria-label="Matching offers">{preview.map(offer => (
      <li key={offer.id}>{offer.name}</li>
    ))}</ul>
    {matchingOffers.length === 0 && <p>No matching offers.</p>}
  </section>;
}
// @end live-uncached
// @snippet live-memo
export function CachedOffers({ offers = sampleOffers }: { offers?: Offer[] }) {
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const matchingOffers = useMemo(
    () => {
      console.log("Filtering offers · Fix");
      return offers.filter(offer =>
        offer.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    [offers, query]
  );
  const preview = matchingOffers.slice(0, 5);
  return <section className="optimization-demo" aria-label="Offer filter example">
    <label>Search offers<input value={query}
      onChange={event => setQuery(event.target.value)} /></label>
    <label>Unrelated order note<input value={note}
      onChange={event => setNote(event.target.value)} /></label>
    <p>Total matches: <output aria-label="Total matches">{matchingOffers.length}</output></p>
    <p>Showing first {preview.length} of {matchingOffers.length} matching offers.</p>
    <ul aria-label="Matching offers">{preview.map(offer => (
      <li key={offer.id}>{offer.name}</li>
    ))}</ul>
    {matchingOffers.length === 0 && <p>No matching offers.</p>}
  </section>;
}
// @end live-memo
// @snippet live-submit
type OrderDetails = { address: string };
type ProductPageProps = { productId: string; referrer: string; theme: string };
function submitOrder(productId: string, details: { referrer: string; orderDetails: OrderDetails }) {
  console.log("Local order submitted", productId, details);
  return `Saved locally: ${productId} · ${details.referrer} · ${details.orderDetails.address}`;
}
// @end live-submit
// @snippet live-child
const ShippingForm = memo(function ShippingForm({ onSubmit }: {
  onSubmit: (orderDetails: OrderDetails) => string;
}) {
  const [address, setAddress] = useState("");
  const [receipt, setReceipt] = useState("");
  console.log("Rendering ShippingForm");
  return <form className="optimization-child" onSubmit={event => {
    event.preventDefault();
    setReceipt(onSubmit({ address }));
  }}>
    <h3>Shipping address</h3>
    <label>Address<input required value={address}
      onChange={event => setAddress(event.target.value)} /></label>
    <button className="button" type="submit">Submit order locally</button>
    <p role="status">{receipt}</p>
  </form>;
});
// @end live-child
// @snippet live-unstable
function ProductPageRun({ productId, referrer, theme }: ProductPageProps) {
  const handleSubmit = (orderDetails: OrderDetails) =>
    submitOrder(productId, { referrer, orderDetails });
  return <div className="shipping-page" data-theme={theme}>
    <ShippingForm onSubmit={handleSubmit} />
  </div>;
}
// @end live-unstable
// @snippet live-callback
function ProductPageFix({ productId, referrer, theme }: ProductPageProps) {
  const handleSubmit = useCallback(
    (orderDetails: OrderDetails) => submitOrder(productId, { referrer, orderDetails }),
    [productId, referrer]
  );
  return <div className="shipping-page" data-theme={theme}>
    <ShippingForm onSubmit={handleSubmit} />
  </div>;
}
// @end live-callback
// @snippet live-shipping-controls
function ShippingExample({ Page }: {
  Page: (props: ProductPageProps) => ReactNode;
}) {
  const [theme, setTheme] = useState("light");
  const [productId, setProductId] = useState("backpack");
  const [referrer, setReferrer] = useState("school");
  return <section className="optimization-demo" aria-label="Shipping form example">
    <button className="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Theme: {theme}
    </button>
    <label>Product<select aria-label="Product" value={productId}
      onChange={event => setProductId(event.target.value)}>
      <option value="backpack">Backpack</option><option value="bottle">Water bottle</option>
    </select></label>
    <label>Referrer<select aria-label="Referrer" value={referrer}
      onChange={event => setReferrer(event.target.value)}>
      <option value="school">School</option><option value="friend">Friend</option>
    </select></label>
    <Page productId={productId} referrer={referrer} theme={theme} />
  </section>;
}
// @end live-shipping-controls
// @snippet live-shipping-run
export function UnstableAction() { return <ShippingExample Page={ProductPageRun} />; }
// @end live-shipping-run
// @snippet live-shipping-fix
export function StableAction() { return <ShippingExample Page={ProductPageFix} />; }
// @end live-shipping-fix
