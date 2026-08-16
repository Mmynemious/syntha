import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LandingApp } from "./landing/LandingApp";
import "./landing/landing.css";

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");

createRoot(root).render(
  <StrictMode>
    <LandingApp />
  </StrictMode>,
);
