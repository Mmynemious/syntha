const MODULES = [
  { icon: "🫀", title: "Hypertension", desc: "1–2 antihypertensives (dual therapy at stage 2), CarePlan" },
  { icon: "🍬", title: "Diabetes", desc: "HbA1c, metformin (+ insulin if severe), CarePlan" },
  { icon: "🧀", title: "Hyperlipidemia", desc: "Lipid panel, statin (high-intensity if LDL ≥ 190)" },
  { icon: "🦋", title: "Thyroid", desc: "TSH, levothyroxine" },
  { icon: "😔", title: "Depression", desc: "Psych encounter, sertraline, CBT CarePlan" },
  { icon: "😰", title: "Anxiety", desc: "Escitalopram, or buspirone if already on an SSRI" },
  { icon: "❤️", title: "Ischemic heart disease", desc: "Cardiology encounter, ECG, aspirin + β-blocker + statin" },
  { icon: "🌬️", title: "Asthma", desc: "Respiratory encounter, spirometry, SABA + ICS" },
  { icon: "🚭", title: "COPD", desc: "Respiratory encounter, spirometry, LABA + SABA" },
];

export function Modules() {
  return (
    <section className="section-block" id="modules">
      <div className="section-inner">
        <h2 className="section-heading">Nine Synthea-style clinical modules.</h2>
        <p className="section-subcopy">
          Each fires on its corresponding comorbidity flag and emits real coded FHIR resources —
          not just a diagnosis label.
        </p>

        <div className="module-grid">
          {MODULES.map((m) => (
            <div className="module-card" key={m.title}>
              <span className="module-icon" aria-hidden="true">
                {m.icon}
              </span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>

        <a
          className="section-link"
          href="https://github.com/Mmynemious/syntha/blob/main/docs/MODULES.md"
          target="_blank"
          rel="noopener"
        >
          Module authoring guide →
        </a>
      </div>
    </section>
  );
}
