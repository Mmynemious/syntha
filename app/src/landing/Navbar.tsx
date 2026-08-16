import { useEffect, useState } from "react";
import { ChevronUp, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Generators", href: "/generate.html" },
  { label: "Validation", href: "#validation" },
  { label: "MCP", href: "#mcp" },
  { label: "Docs", href: "#docs" },
  { label: "Get Started", href: "/generate.html" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", open);
    return () => document.body.classList.remove("drawer-open");
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <a className="logo" href="/" aria-label="syntha home">
            syntha
          </a>
          <button
            type="button"
            className={`menu-toggle${open ? " is-open" : ""}`}
            aria-expanded={open}
            aria-controls="landing-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
            {open ? <X /> : <ChevronUp />}
          </button>
        </div>
      </header>

      <div
        id="landing-drawer"
        className={`drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <ul className="drawer-links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="drawer-footer">© {new Date().getFullYear()} syntha · Apache 2.0</p>
      </div>
    </>
  );
}
