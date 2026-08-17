import "./benchmark.css";
import { dashboard } from "./data";
import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";

const KS_THRESHOLD = 0.05;
const KS_SCALE_MAX = 0.25;

function KsChart() {
  return (
    <section className="card">
      <h2>Distributional fidelity — Kolmogorov–Smirnov by release</h2>
      <p className="hint">
        Lower KS = synthetic marginals closer to source. The dashed line at 0.05 is the
        conventional "indistinguishable from same distribution" threshold; below that a
        two-sample test fails to reject the null at α = 0.05.
      </p>
      <div className="bar-chart" style={{ ["--threshold-pct" as string]: `${(KS_THRESHOLD / KS_SCALE_MAX) * 100}%` }}>
        <div className="bar-chart-threshold" />
        {dashboard.ks.labels.map((label, i) => (
          <div className="bar-chart-col" key={label}>
            <div className="bar-chart-bars">
              <div
                className="bar bar--mean"
                style={{ height: `${(dashboard.ks.mean[i] / KS_SCALE_MAX) * 100}%` }}
                title={`mean KS ${dashboard.ks.mean[i]}`}
              />
              <div
                className="bar bar--max"
                style={{ height: `${(dashboard.ks.max[i] / KS_SCALE_MAX) * 100}%` }}
                title={`max KS ${dashboard.ks.max[i]}`}
              />
            </div>
            <span className="bar-chart-label">{label}</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <span>
          <i className="legend-swatch legend-swatch--mean" /> mean KS
        </span>
        <span>
          <i className="legend-swatch legend-swatch--max" /> max KS
        </span>
        <span>
          <i className="legend-swatch legend-swatch--threshold" /> 0.05 pass line
        </span>
      </div>
    </section>
  );
}

function CorrelationChart() {
  const { labels, v04, v05 } = dashboard.correlationMagnitude;
  return (
    <section className="card">
      <h2>Correlation magnitude recovery — by pair type</h2>
      <p className="hint">
        Ratio of synthetic-vs-source Spearman correlation magnitude, averaged across all pairs
        of the indicated type. The v0.5 polyserial + tetrachoric fix lifts mixed-type pairs from
        ~50–65% to ~90%+ of source.
      </p>
      <div className="corr-bars">
        {labels.map((label, i) => (
          <div className="corr-group" key={label}>
            <div className="corr-header">
              <span>{label}</span>
              <span className="corr-val">
                {Math.round(v04[i] * 100)}% → {Math.round(v05[i] * 100)}%
              </span>
            </div>
            <div className="corr-bar-row">
              <span className="corr-tag">v0.4</span>
              <div className="corr-track">
                <div className="corr-fill corr-fill--old" style={{ width: `${v04[i] * 100}%` }} />
              </div>
            </div>
            <div className="corr-bar-row">
              <span className="corr-tag">v0.5</span>
              <div className="corr-track">
                <div className="corr-fill corr-fill--new" style={{ width: `${v05[i] * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PendingCard({ title, hint, note }: { title: string; hint: string; note: string }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="hint">{hint}</p>
      <div className="placeholder">{note}</div>
    </section>
  );
}

function ReleaseTable() {
  return (
    <section className="card">
      <h2>Release timeline + scope</h2>
      <table className="release-table">
        <thead>
          <tr>
            <th>version</th>
            <th>date</th>
            <th>scope</th>
            <th>tests</th>
          </tr>
        </thead>
        <tbody>
          {dashboard.releases.map((r) => (
            <tr key={r.version}>
              <td>
                <code>{r.version}</code>
              </td>
              <td>{r.date}</td>
              <td>{r.scope}</td>
              <td>{r.tests}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function App() {
  return (
    <>
      <Navbar />

      <header className="bench-header">
        <h1>Benchmark dashboard</h1>
        <p className="tagline">
          Open, reproducible fidelity / utility / privacy metrics across syntha releases,
          committed to the repo alongside every tagged release.
        </p>
        <p className="meta">
          <a href="https://github.com/Mmynemious/syntha" target="_blank" rel="noopener">
            Repo
          </a>{" "}
          ·{" "}
          <a href="https://github.com/Mmynemious/syntha/releases" target="_blank" rel="noopener">
            Releases
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/Mmynemious/syntha/blob/main/docs/MEDICAL_OFFICER_REVIEW_v0.5.md"
            target="_blank"
            rel="noopener"
          >
            Medical officer review
          </a>
        </p>
      </header>

      <main>
        <KsChart />
        <CorrelationChart />
        <PendingCard
          title="Downstream utility — TSTR (train on synthetic, test on real)"
          hint="Risk-model ROC-AUC when trained on syntha-generated data vs. trained on the source data. Closer the two columns, the better synthetic transfers to real-data tasks."
          note="Pending v0.5.6 — SynthEHRella TSTR benchmark integration (benchmarks/synthehrella_run.py)"
        />
        <PendingCard
          title="Privacy — membership + attribute inference"
          hint="ROC-AUC of an attacker trying to determine whether a real source row was in the training set (membership inference) or guess held-out attributes (attribute inference). 0.50 = chance, 1.00 = perfect attack."
          note="Pending v0.5 G2 — membership + attribute inference CI"
        />
        <ReleaseTable />
      </main>

      <p className="bench-source-note">
        Built from <code>benchmarks/dashboard.json</code>, committed in this repo and
        regenerated per release.
      </p>

      <Footer />
    </>
  );
}
