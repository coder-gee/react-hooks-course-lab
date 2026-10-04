import { useCountdown } from "./hooks/useCountdown";
import StateCheckoutReference from "../references/StateCheckoutReference";
import "../components/sale-topbar.css";
import { ReservationCountdown } from "../components/ReservationCountdown";

// Only Details mounts this caller. Review unmounts it; Edit mounts a fresh timer.
function FlashSaleTimer() {
  const seconds = useCountdown(30);
  return <ReservationCountdown seconds={seconds} />;
}
// This independent caller stays mounted in Review and unmounts on leaving the lab.
function TopBarSaleTimer() {
  const seconds = useCountdown(45);
  return <div className="sale-topbar" aria-label="Top bar sale countdown">
    <span>SALE <output aria-label="Top bar sale seconds">{seconds}s</output></span>
  </div>;
}
export default function CustomHookCheckoutReference() {
  return <StateCheckoutReference detailsContent={<FlashSaleTimer />} topbarContent={<TopBarSaleTimer />} />;
}
