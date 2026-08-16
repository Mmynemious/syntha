const STATS = [
  { num: "0.07", label: "mean KS distance", note: "lower = closer to source; 0.05 is the conventional pass line" },
  { num: "61", label: "automated tests", note: "up from 37 at first release" },
  { num: "3", label: "independent audits", note: "fidelity · utility · privacy" },
];

const CORRELATIONS = [
  { label: "continuous ↔ continuous", before: 99, after: 99 },
  { label: "continuous ↔ binary", before: 84, after: 94 },
  { label: "binary ↔ binary", before: 39, after: 90 },
];

export function Validation() {
  return (
    <section className="section-block" id="validation">
      <div className="section-inner">
        <h2 className="section-heading">Not just another generator.</h2>
        <p className="section-subcopy">
          Every release is benchmarked against the source cohort — and the whole pipeline is
          usable directly from Claude, no extra glue code.
        </p>

        <div className="stat-row">
          {STATS.map((s) => (
            <div className="stat-tile" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">
                {s.label}
                <br />
                <span className="stat-note">{s.note}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="corr-title">Correlation-magnitude recovery, v0.4 → v0.5</p>
        <div className="corr-bars">
          {CORRELATIONS.map((c) => (
            <div className="corr-group" key={c.label}>
              <div className="corr-header">
                <span>{c.label}</span>
                <span className="corr-val">
                  {c.before}% → {c.after}%
                </span>
              </div>
              <div className="corr-bar-row">
                <span className="corr-tag">v0.4</span>
                <div className="corr-track">
                  <div className="corr-fill corr-fill--old" style={{ width: `${c.before}%` }} />
                </div>
              </div>
              <div className="corr-bar-row">
                <span className="corr-tag">v0.5</span>
                <div className="corr-track">
                  <div className="corr-fill corr-fill--new" style={{ width: `${c.after}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <a className="section-link" href="/benchmark.html">
          See the full benchmark dashboard →
        </a>
      </div>
    </section>
  );
}
