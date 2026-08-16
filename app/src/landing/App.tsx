import "./landing.css";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { TrustedBy } from "./TrustedBy";
import { Generators } from "./Generators";
import { Validation } from "./Validation";
import { MCPSection } from "./MCPSection";
import { Docs } from "./Docs";
import { Footer } from "./Footer";

export function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedBy />
      <Generators />
      <Validation />
      <MCPSection />
      <Docs />
      <Footer />
    </>
  );
}
