// Frontend wiring for the "real Synthea" panel — calls /api/synthea-generate,
// which runs the official MITRE Synthea jar in a Vercel Sandbox and returns
// a zip of the CSV export. Kept separate from copula.ts / main.ts since this
// is a server round-trip, not a client-side computation.

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

function el<T extends HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`missing element #${id}`);
  return e as T;
}

function setStatus(msg: string, kind: "info" | "success" | "error" = "info") {
  const s = el<HTMLParagraphElement>("synthea-status");
  s.textContent = msg;
  s.className = "status " + (kind === "info" ? "muted" : kind);
}

export function initSynthea(): void {
  const select = el<HTMLSelectElement>("synthea-state");
  select.innerHTML = US_STATES
    .map((s) => `<option value="${s}"${s === "Massachusetts" ? " selected" : ""}>${s}</option>`)
    .join("");

  el<HTMLButtonElement>("synthea-generate").addEventListener("click", async () => {
    const btn = el<HTMLButtonElement>("synthea-generate");
    btn.disabled = true;
    const state = select.value;
    const population = el<HTMLInputElement>("synthea-population").value || "25";
    const seed = el<HTMLInputElement>("synthea-seed").value;

    try {
      setStatus(
        "Running the official Synthea toolchain… first request on a cold sandbox builds it from source and can take a couple of minutes; after that it's warm.",
      );
      const r = await fetch("/api/synthea-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, population, seed: seed || undefined }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error ? `${body.error}${body.detail ? ` — ${body.detail}` : ""}` : `HTTP ${r.status}`);
      }
      const blob = await r.blob();
      const disposition = r.headers.get("Content-Disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(disposition);
      const filename = match ? match[1] : `synthea_${state}_${population}.zip`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus(`✓ Generated ${population} patients for ${state} (official Synthea). Downloaded ${filename}.`, "success");
    } catch (e) {
      setStatus(`Could not generate: ${(e as Error).message}`, "error");
    } finally {
      btn.disabled = false;
    }
  });
}
