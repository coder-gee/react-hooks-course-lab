import type { ReactNode } from "react";
export const PRICE = 24;
export const PACK_NAME = "Explorer Pack";
export const money = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    value,
  );

// Supplied visual shell. No Hooks: the native starter imports only this module.
export function CheckoutFrame({
  children,
  summary,
  phase = "Details",
  renderPrice = money,
  topbarContent,
}: {
  children: ReactNode;
  summary: ReactNode;
  phase?: string;
  topbarContent?: ReactNode;
  renderPrice?: (amount: number) => ReactNode;
}) {
  return (
    <div className="store game-store">
      <div className="store-heading">
        <div className="game-brand">
          <span className="orbit-emblem" aria-hidden="true">
            ◉
          </span>
          <span className="store-wordmark">
            ORBIT<small>FRONTIER</small>
          </span>
          <span className="webshop-label">WEB SHOP</span>
        </div>
        {topbarContent}
        <div className="player-chip">
          <span className="player-avatar">N</span>
          <span>
            Nova_Rider<small>LVL 24</small>
          </span>
        </div>
      </div>
      <div className="checkout-progress" aria-label="Checkout progress">
        {["Details", "Review", "Complete"].map((item, i) => (
          <span key={item} className={item === phase ? "active" : ""}>
            <b>{i + 1}</b>
            {item}
          </span>
        ))}
      </div>
      <div className="checkout-grid">
        <section className="checkout-main">
          {children}
        </section>
        <aside className="order-summary">
          <div className="pack-art-wrap">
            <img
              className="product-art"
              src="/orbit-bundle.svg"
              alt="Explorer Pack: glowing Stardust crystals, a purple supply crate and a green XP boost token"
            />
            <span className="pack-type">IN-GAME BUNDLE</span>
          </div>
          <div className="product-copy">
            <span className="eyebrow">ORBIT FRONTIER</span>
            <h2>{PACK_NAME}</h2>
            <p>Everything for your next expedition.</p>
            <div className="bundle-contents">
              <div>
                <span className="loot-icon crystals">◇</span>
                <span>
                  <b>1,200 Stardust</b>
                  <small>In-game currency</small>
                </span>
              </div>
              <div>
                <span className="loot-icon boost">ϟ</span>
                <span>
                  <b>48-hour XP boost</b>
                  <small>Double XP token</small>
                </span>
              </div>
              <div>
                <span className="loot-icon cosmetic">✧</span>
                <span>
                  <b>Aurora Trail</b>
                  <small>Ship cosmetic</small>
                </span>
              </div>
            </div>
            <p className="contents-caption">
              Contents per pack · {renderPrice(PRICE)} each
            </p>
          </div>
          {summary}
        </aside>
      </div>
      <div className="store-footer">
        <span className="footer-orbit">ORBIT FRONTIER</span>
      </div>
    </div>
  );
}
export function Summary({
  quantity,
  note = "",
  gift = "",
  children,
  renderPrice = money,
}: {
  quantity: number;
  renderPrice?: (amount: number) => ReactNode;
  note?: string;
  gift?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="summary-lines">
        <div>
          <span>
            {PACK_NAME} × {quantity}
          </span>
          <strong>{renderPrice(PRICE * quantity)}</strong>
        </div>
        {note && (
          <div className="summary-note">
            <span>Order note</span>
            <p>{note}</p>
          </div>
        )}
        {gift && (
          <div className="summary-note">
            <span>Gift message</span>
            <p>{gift}</p>
          </div>
        )}
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong data-testid="total">{renderPrice(PRICE * quantity)}</strong>
      </div>
      {children}
    </>
  );
}
export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <h2>{children}</h2>
    </div>
  );
}
