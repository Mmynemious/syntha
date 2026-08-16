import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

document.body.classList.add("landing-page");

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
