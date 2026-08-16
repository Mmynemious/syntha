const LOGOS = [
  { name: "FHIR R4", fontFamily: "Georgia, serif", fontWeight: 600 },
  { name: "LOINC", fontFamily: "Inter, sans-serif", fontWeight: 700 },
  { name: "SNOMED CT", fontFamily: "system-ui, sans-serif", fontWeight: 600 },
  { name: "RxNorm", fontFamily: "Georgia, serif", fontWeight: 500 },
  { name: "ICD-10", fontFamily: "Inter, sans-serif", fontWeight: 800 },
  { name: "Synthea", fontFamily: "'Source Serif 4', serif", fontWeight: 600, fontStyle: "italic" },
  { name: "MCP", fontFamily: "system-ui, sans-serif", fontWeight: 800 },
  { name: "Claude", fontFamily: "Inter, sans-serif", fontWeight: 600 },
  { name: "PyPI", fontFamily: "Georgia, serif", fontWeight: 700 },
  { name: "Apache 2.0", fontFamily: "Inter, sans-serif", fontWeight: 600 },
];

export function TrustedBy() {
  const loop = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];
  return (
    <section className="trusted">
      <p className="trusted-label">Built on open clinical data standards</p>
      <div className="trusted-marquee">
        <div className="trusted-track">
          {loop.map((logo, i) => (
            <span
              className="trusted-item"
              key={`${logo.name}-${i}`}
              style={{
                fontFamily: logo.fontFamily,
                fontWeight: logo.fontWeight,
                fontStyle: logo.fontStyle,
              }}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
