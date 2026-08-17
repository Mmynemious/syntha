import { useState } from "react";
import "./mcp-page.css";
import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";

const CONNECTOR_URL = "https://syntha-six.vercel.app/api/mcp";

const TOOL_GROUPS = [
  {
    title: "Generate",
    count: 7,
    desc: "Cross-sectional + longitudinal cohorts, conditional sampling, FHIR R4 bundles, lab-history series.",
    example: "generate_cohort_csv, generate_cohort_fhir, generate_longitudinal_cohort",
  },
  {
    title: "Inspect",
    count: 8,
    desc: "Browse bundled cohorts, model cards, clinical modules, pipeline knobs, correlation structure.",
    example: "list_bundled_cohorts, get_model_card, get_correlation_pairs",
  },
  {
    title: "Validate & audit",
    count: 9,
    desc: "KS / prevalence / correlation fidelity, MIA + AIA privacy audit, reference-range checks.",
    example: "validate_synthetic_csv, privacy_audit, fraction_within_reference",
  },
  {
    title: "Locale & terminology",
    count: 6,
    desc: "Turkish names/addresses + ICD-10 / SNOMED CT / LOINC / RxNorm catalogs.",
    example: "list_locale_data, list_condition_codes, list_rxnorm_medications",
  },
  {
    title: "Reference data",
    count: 4,
    desc: "Constraint definitions, reference intervals, schema columns, longitudinal drift profiles.",
    example: "list_physiologic_constraints, list_reference_ranges",
  },
];

type Tab = "desktop" | "claude-web";

function DesktopInstall() {
  return (
    <>
      <div className="mcp-code-card">
        <pre>
          <span className="code-comment"># 1. Install</span>{"\n"}
          $ pip install &quot;syntha-ehr[mcp]&quot;
        </pre>
      </div>
      <div className="mcp-code-card">
        <pre>
          <span className="code-comment">// 2. Claude Desktop → Settings → Developer → Edit Config</span>{"\n"}
          {`{ "mcpServers": { "syntha": { "command": "syntha-mcp" } } }`}
        </pre>
      </div>
      <ol className="mcp-step-list">
        <li>Restart Claude Desktop after saving the config file.</li>
        <li>
          Look for the 🔌 tools icon in the composer — <code>syntha</code> should be listed with
          34 tools.
        </li>
        <li>
          Ask something like <em>&quot;Generate 50 Turkish patients with hypertension and
          diabetes, ages 55+&quot;</em>.
        </li>
      </ol>
    </>
  );
}

function ClaudeWebInstall() {
  return (
    <>
      <div className="mcp-code-card">
        <pre>
          <span className="code-comment"># No install — just the connector URL</span>{"\n"}
          {CONNECTOR_URL}
        </pre>
      </div>
      <ol className="mcp-step-list">
        <li>
          In Claude.com, go to <strong>Settings → Connectors → Add custom connector</strong>.
        </li>
        <li>
          Paste in <code>{CONNECTOR_URL}</code> and save.
        </li>
        <li>
          Enable it in a chat, then ask Claude to generate or validate a synthetic cohort — no
          local install, works from any device.
        </li>
      </ol>
    </>
  );
}

export function App() {
  const [tab, setTab] = useState<Tab>("claude-web");

  return (
    <>
      <Navbar />

      <header className="mcp-hero">
        <span className="mcp-kicker">Works inside Claude</span>
        <h1>Use syntha from a chat, not a script.</h1>
        <p>
          A 34-tool Model Context Protocol connector — generate, validate, and audit synthetic
          patient cohorts directly from Claude Desktop or Claude.com. No glue code, no local
          server to babysit.
        </p>
      </header>

      <main>
        <section className="card">
          <h2>Add the connector</h2>
          <p className="hint">Two ways in — pick whichever matches how you use Claude.</p>

          <div className="mcp-install-tabs">
            <button
              type="button"
              className={`mcp-install-tab${tab === "claude-web" ? " is-active" : ""}`}
              onClick={() => setTab("claude-web")}
            >
              Claude.com (recommended)
            </button>
            <button
              type="button"
              className={`mcp-install-tab${tab === "desktop" ? " is-active" : ""}`}
              onClick={() => setTab("desktop")}
            >
              Claude Desktop
            </button>
          </div>

          {tab === "claude-web" ? <ClaudeWebInstall /> : <DesktopInstall />}
        </section>

        <section className="card">
          <h2>34 tools across five areas</h2>
          <p className="hint">
            Bundles both trained copulas (tolerant n=135,569; strict n=55,141) — no source CSV
            needed at runtime.
          </p>
          <div className="mcp-tool-grid">
            {TOOL_GROUPS.map((g) => (
              <div className="mcp-tool-card" key={g.title}>
                <h3>
                  {g.title} <span className="mcp-tool-count">· {g.count} tools</span>
                </h3>
                <p>{g.desc}</p>
                <div className="mcp-tool-example">{g.example}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Try asking it</h2>
          <p className="hint">
            &quot;Using the syntha connector, give me 50 longitudinal Turkish patients with
            hypertension and diabetes aged 60+ — 4 encounters each, as a FHIR bundle.&quot;
          </p>
          <p className="hint">
            &quot;Run a privacy audit on that cohort and tell me if it's safe to share.&quot;
          </p>
        </section>

        <div className="mcp-footer-links">
          <a
            href="https://github.com/Mmynemious/syntha/blob/main/docs/MCP.md"
            target="_blank"
            rel="noopener"
          >
            Full tool reference →
          </a>
          <a href="/generate.html">Try the generators directly →</a>
          <a
            href="https://github.com/Mmynemious/syntha"
            target="_blank"
            rel="noopener"
          >
            Source on GitHub →
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
