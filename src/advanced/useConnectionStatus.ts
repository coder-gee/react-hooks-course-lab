import { useEffect, useState } from "react";
import { checkoutConnection } from "../lib/connectivity";
// @snippet custom
export function useConnectionStatus() {
  const [online, setOnline] = useState(checkoutConnection.read);
  useEffect(() => {
    setOnline(checkoutConnection.read());
    const unsubscribe = checkoutConnection.subscribe(setOnline);
    return unsubscribe;
  }, []);
  return online;
}
// @end custom
