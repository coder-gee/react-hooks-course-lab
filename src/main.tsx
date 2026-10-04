import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bai-jamjuree/400.css";
import "@fontsource/bai-jamjuree/500.css";
import "@fontsource/bai-jamjuree/600.css";
import "@fontsource/bai-jamjuree/700.css";
import App from "./App";
import "./styles.css";
import "./components/checkout.css";
import "./components/lesson-picker.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
