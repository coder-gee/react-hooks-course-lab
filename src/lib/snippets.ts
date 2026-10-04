import livePerformanceSource from "../demos/OptimizationExamples.tsx?raw";
import timerSource from "../demos/ReservationTimers.tsx?raw";
import exampleSource from "../demos/Examples.tsx?raw";
import cartSource from "../advanced/cart.ts?raw";
import contextSource from "../demos/SettingsContext.tsx?raw";
import customSource from "../advanced/useCountdown.ts?raw";
import advancedSource from "../demos/AdvancedExamples.tsx?raw";
const sources = [
  livePerformanceSource,
  timerSource,
  exampleSource,
  cartSource,
  contextSource,
  customSource,
  advancedSource,
];
export function snippet(id: string): string {
  if (["memo", "uncached", "memo-before", "memo-after"].includes(id)) {
    return 'import { useState, useMemo } from "react";\n\n' + snippet("live-offers") + "\n\n" + snippet(id === "uncached" || id === "memo-before" ? "live-uncached" : "live-memo");
  }
  if (["callback", "unstable", "callback-before", "callback-after"].includes(id)) {
    const original = id === "unstable" || id === "callback-before";
    return 'import { memo, useCallback, useState } from "react";\nimport type { ReactNode } from "react";\n\n'
      + snippet("live-submit") + "\n\n"
      + snippet("live-shipping-controls") + "\n\n"
      + snippet(original ? "live-shipping-run" : "live-shipping-fix") + "\n\n"
      + snippet(original ? "live-unstable" : "live-callback") + "\n\n"
      + snippet("live-child");
  }
  if (id === "context") {
    const consumers = snippet("settingsConsumers");
    return snippet("currencyConsumer") + "\n\n" + consumers.slice(consumers.indexOf("export function LanguageSelector"));
  }
  const aliases: Record<string, string> = {
    "memo": "live-memo",
    "uncached": "live-uncached",
    "memo-before": "live-uncached",
    "memo-after": "live-memo",
    "callback-before": "unstable",
    "callback-after": "callback",
  };
  const key = aliases[id] || id;
  const start = `// @snippet ${key}\n`;
  const end = `// @end ${key}`;
  const source = sources.find((item) => item.includes(start));
  const region = source?.split(start)[1]?.split(end)[0];
  if (!region) throw new Error(`Missing source snippet: ${id}`);
  return region.trim();
}
