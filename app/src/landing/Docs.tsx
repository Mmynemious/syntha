const RESOURCES = [
  {
    title: "README",
    desc: "Install, quickstart, and the full tool/feature overview.",
    href: "https://github.com/Mmynemious/syntha#readme",
  },
  {
    title: "Architecture",
    desc: "Why a Gaussian copula, and how the statistical + rule-based layers combine.",
    href: "https://github.com/Mmynemious/syntha/blob/main/docs/ARCHITECTURE.md",
  },
  {
    title: "Clinical modules",
    desc: "The nine Synthea-style modules and the source flag each one fires on.",
    href: "https://github.com/Mmynemious/syntha/blob/main/docs/MODULES.md",
  },
  {
    title: "MCP docs",
    desc: "Full tool reference for the 34-tool Claude connector.",
    href: "https://github.com/Mmynemious/syntha/blob/main/docs/MCP.md",
  },
  {
    title: "Contributing",
    desc: "Dev setup, commit conventions, and the test matrix.",
    href: "https://github.com/Mmynemious/syntha/blob/main/CONTRIBUTING.md",
  },
  {
    title: "Roadmap",
    desc: "What's shipped, what's queued, and the staged plan.",
    href: "https://github.com/Mmynemious/syntha/blob/main/ROADMAP.md",
  },
];

const COMMUNITY = [
  { label: "Discussions", href: "https://github.com/Mmynemious/syntha/discussions" },
  { label: "Issues", href: "https://github.com/Mmynemious/syntha/issues" },
  { label: "Collaborate", href: "https://github.com/Mmynemious/syntha/blob/main/COLLABORATE.md" },
];

export function Docs() {
  return (
    <section className="section-block" id="docs">
      <div className="section-inner">
        <h2 className="section-heading">Docs &amp; resources</h2>
        <p className="section-subcopy">
          Everything above is a summary — the repo has the full picture.
        </p>

        <div className="docs-grid">
          {RESOURCES.map((r) => (
            <a className="docs-card" href={r.href} target="_blank" rel="noopener" key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </a>
          ))}
        </div>

        <div className="docs-community">
          {COMMUNITY.map((c) => (
            <a href={c.href} target="_blank" rel="noopener" key={c.label}>
              {c.label}
            </a>
          ))}
          <span className="docs-license">Apache 2.0 licensed</span>
        </div>
      </div>
    </section>
  );
}
