// Mirrors benchmarks/dashboard.json at the repo root, which is regenerated
// on every release. Update this file alongside that one until the build
// pipeline can import repo-root JSON directly (see vite.config.ts note).
export const dashboard = {
  releases: [
    {
      version: "v0.4.0",
      date: "2026-05-13",
      scope: "First public release — Tauri desktop app, FHIR R4, 9 modules",
      tests: 37,
    },
    {
      version: "v0.4.1",
      date: "2026-05-13",
      scope: "First Apple Developer ID-signed + notarized macOS DMG",
      tests: 37,
    },
    {
      version: "v0.4.2",
      date: "2026-05-13",
      scope: "Tauri 2 auto-updater (signed minisign manifest)",
      tests: 51,
    },
    {
      version: "v0.5.0-dev",
      date: "2026-05-13",
      scope:
        "Polyserial + tetrachoric correlation, HTEST FHIR marker, DiagnosticReport panel grouping, conditional sampling, Turkish UI",
      tests: 61,
    },
  ],
  ks: {
    labels: ["v0.4.0", "v0.4.2", "v0.5.0-dev"],
    mean: [0.07, 0.07, 0.07],
    max: [0.14, 0.14, 0.14],
  },
  correlationMagnitude: {
    labels: ["continuous ↔ continuous", "continuous ↔ binary", "binary ↔ binary"],
    v04: [0.99, 0.84, 0.39],
    v05: [0.99, 0.94, 0.9],
  },
  tstr: null as null,
  privacy: null as null,
};
