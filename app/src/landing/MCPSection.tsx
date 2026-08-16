const TOOL_GROUPS = [
  {
    title: "Generate",
    desc: "cross-sectional + longitudinal cohorts, conditional sampling, FHIR bundles",
  },
  {
    title: "Validate & audit",
    desc: "KS / prevalence / correlation fidelity, membership + attribute inference privacy audits",
  },
  {
    title: "Terminology",
    desc: "ICD-10 / SNOMED CT / LOINC / RxNorm catalogs, Turkish locale data",
  },
];

export function MCPSection() {
  return (
    <section className="section-block" id="mcp">
      <div className="section-inner">
        <span className="section-kicker">Works inside Claude</span>
        <h2 className="section-heading">A 34-tool MCP connector</h2>
        <p className="section-subcopy">
          Generate, validate, and audit synthetic cohorts from a chat — Turkish-locale patients,
          FHIR R4 bundles, longitudinal histories, privacy audits, all without leaving Claude.
        </p>

        <div className="code-card">
          <span className="code-prompt">$</span> pip install &quot;syntha-ehr[mcp]&quot;
        </div>

        <ul className="tool-list">
          {TOOL_GROUPS.map((g) => (
            <li key={g.title}>
              <strong>{g.title}</strong> — {g.desc}
            </li>
          ))}
        </ul>

        <a
          className="section-link"
          href="https://github.com/Mmynemious/syntha/blob/main/docs/MCP.md"
          target="_blank"
          rel="noopener"
        >
          Read the MCP docs →
        </a>
      </div>
    </section>
  );
}
