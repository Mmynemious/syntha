import { Terminal } from "lucide-react";

const TICKER_ITEMS = [
  "Cohort Generation",
  "FHIR R4 Export",
  "Privacy Audits",
  "Longitudinal Records",
  "MCP Connector",
];

const SIDE_LINE_COUNT = 20;
const sideLines = Array.from({ length: SIDE_LINE_COUNT }, (_, i) => ({
  width: 60 + i * 10,
  delay: i * 0.25,
}));

function CurveLines() {
  return (
    <div className="curve-lines" aria-hidden="true">
      <div className="curve-lines-side">
        {sideLines.map((line, i) => (
          <span
            key={`left-${i}`}
            className="curve-line-left"
            style={{ width: line.width, animationDelay: `${line.delay}s` }}
          />
        ))}
        {sideLines.map((line, i) => (
          <span
            key={`right-${i}`}
            className="curve-line-right"
            style={{ width: line.width, animationDelay: `${line.delay}s` }}
          />
        ))}
      </div>
      <div className="curve-lines-top">
        {sideLines.map((line, i) => (
          <span
            key={`top-${i}`}
            className="curve-line-top"
            style={{ height: line.width, animationDelay: `${line.delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function Ticker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {loop.map((item, i) => (
          <span className="ticker-item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <CurveLines />
      <div className="hero-content">
        <Ticker />

        <h1 className="hero-title">
          Synthetic patient cohorts, <span className="brand-italic">syntha</span>-made, on demand.
        </h1>

        <p className="hero-subtitle">
          A synthetic-data engine for researchers and builders who need realistic patient cohorts
          without real patient risk.
        </p>

        <div className="hero-cta-row">
          <a className="cta-primary" href="/generate.html">
            Get Started
          </a>

          <a
            className="cta-secondary"
            href="https://pypi.org/project/syntha-ehr/"
            target="_blank"
            rel="noopener"
          >
            <span className="cta-secondary-avatar">
              <Terminal />
            </span>
            <span className="cta-secondary-text">
              <span className="cta-secondary-primary">pip install syntha-ehr[mcp]</span>
              <span className="cta-secondary-sub">
                <span className="cta-secondary-dot" />
                View on PyPI
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="hero-blur" />
    </section>
  );
}
