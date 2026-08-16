const SYNTHA_POINTS = [
  { value: "135,569", label: "training episodes — tolerant cohort" },
  { value: "55,141", label: "training episodes — strict cohort" },
  { value: null, label: "Longitudinal mode — multiple encounters per patient" },
  { value: null, label: "Runs client-side, instant CSV export" },
];

const SYNTHEA_POINTS = [
  { value: "50", label: "US states supported" },
  { value: null, label: "State-machine disease progression simulation" },
  { value: null, label: "FHIR R4 export" },
  { value: null, label: "Server-side, sandboxed CSV export" },
];

export function Generators() {
  return (
    <section className="section-block" id="generators">
      <div className="section-inner">
        <h2 className="section-heading">Built for research that can&apos;t use real patients.</h2>
        <p className="section-subcopy">
          Pick a cohort, generate synthetic patients, export FHIR or CSV — instantly.
        </p>

        <div className="compare-grid">
          <div className="compare-card">
            <span className="compare-badge">Statistical model</span>
            <h3>syntha — Turkish cohort</h3>
            <p>
              A Gaussian copula fitted offline on real, anonymized Turkish EHR episodes.
              Statistically faithful to the source cohort, with physiologic constraints enforced
              on every row.
            </p>
            <ul>
              {SYNTHA_POINTS.map((point) => (
                <li key={point.label}>
                  {point.value ? <strong>{point.value}</strong> : null} {point.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="compare-card">
            <span className="compare-badge compare-badge--alt">Rule-based simulation</span>
            <h3>Synthea — official, US</h3>
            <p>
              The real MITRE Synthea Java toolchain, built from source and run live in an
              isolated sandbox on every request. No statistical model, no real patient data.
            </p>
            <ul>
              {SYNTHEA_POINTS.map((point) => (
                <li key={point.label}>
                  {point.value ? <strong>{point.value}</strong> : null} {point.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
