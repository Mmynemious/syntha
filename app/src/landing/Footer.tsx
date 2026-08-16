export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-inner">
        <span className="logo footer-logo">syntha</span>
        <p className="footer-note">
          Apache 2.0 · trained on open clinical standards (LOINC / SNOMED CT / ICD-10 / RxNorm)
        </p>
        <div className="footer-links">
          <a href="https://github.com/Mmynemious/syntha" target="_blank" rel="noopener">
            GitHub
          </a>
          <a
            href="https://github.com/Mmynemious/syntha/blob/main/docs/MCP.md"
            target="_blank"
            rel="noopener"
          >
            Docs
          </a>
          <a href="/generate.html">Generators</a>
        </div>
      </div>
    </footer>
  );
}
