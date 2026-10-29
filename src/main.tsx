import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/urbanist";
import "./index.css";
import App from "./App";
import { BackgroundProvider } from "./context/BackgroundContext";
import { LocaleProvider } from "./context/LocaleContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <BackgroundProvider>
        <App />
      </BackgroundProvider>
    </LocaleProvider>
  </StrictMode>,
);
