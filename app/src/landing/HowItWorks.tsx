const STEPS = [
  {
    n: "01",
    title: "Gaussian copula",
    desc: "Fitted on real, anonymized Turkish EHR episodes. Preserves marginal distributions and the joint correlation structure — ages, labs, vitals, comorbidity prevalence.",
  },
  {
    n: "02",
    title: "Physiologic filter",
    desc: "Rejects samples that violate pulse-pressure, Friedewald lipid coherence, or eGFR ↔ creatinine constraints — every row stays clinically plausible.",
  },
  {
    n: "03",
    title: "Clinical modules",
    desc: "Nine Synthea-style condition modules activate on each patient's comorbidity profile, emitting Encounters, MedicationRequests, Procedures, and CarePlans.",
  },
  {
    n: "04",
    title: "FHIR R4 export",
    desc: "Dual-coded LOINC / SNOMED CT / ICD-10 / RxNorm, Turkish locale — Patient, Observation, Condition, Encounter, MedicationRequest, and more.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-block" id="how-it-works">
      <div className="section-inner">
        <span className="section-kicker">Under the hood</span>
        <h2 className="section-heading">A hybrid pipeline, not a black box.</h2>
        <p className="section-subcopy">
          Statistical fidelity from the copula, clinical plausibility from the rule-based layer
          on top.
        </p>

        <div className="pipeline">
          {STEPS.map((step, i) => (
            <div className="pipeline-step" key={step.n}>
              <div className="pipeline-card">
                <span className="pipeline-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {i < STEPS.length - 1 ? (
                <span className="pipeline-arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <a
          className="section-link"
          href="https://github.com/Mmynemious/syntha/blob/main/docs/ARCHITECTURE.md"
          target="_blank"
          rel="noopener"
        >
          Read the full architecture doc →
        </a>
      </div>
    </section>
  );
}
