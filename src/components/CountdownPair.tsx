import { useState } from "react";
export type CountdownHook = (initialSeconds?: number) => {
  seconds: number; stop: () => void; restart: () => void;
};
function CountdownCard({ name, useCountdown }: { name: string; useCountdown: CountdownHook }) {
  const { seconds, stop, restart } = useCountdown(30);
  return <section className="mini-checkout" aria-label={`${name} countdown`}>
    <strong>{name}</strong>
    <output aria-label={`${name} seconds`}>{seconds}</output>
    <button onClick={stop}>Stop {name}</button>
    <button onClick={restart}>Restart {name}</button>
  </section>;
}
export default function CountdownPair({ useCountdown }: { useCountdown: CountdownHook }) {
  const [second, setSecond] = useState(true);
  return <div>
    <CountdownCard name="First" useCountdown={useCountdown} />
    {second && <CountdownCard name="Second" useCountdown={useCountdown} />}
    <button className="button" onClick={() => setSecond(value => !value)}>
      {second ? "Unmount Second" : "Mount Second"}
    </button>
    <p className="fineprint">Each call owns its seconds and interval. Stop or restart one; the other keeps counting. Zero clamps the display; Stop or unmount clears the interval.</p>
  </div>;
}
