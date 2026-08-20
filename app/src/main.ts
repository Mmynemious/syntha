import {
  addIdentifiers,
  applyPhysiologicConstraints,
  curationColumns,
  dropCurationFlags,
  expandToTrajectories,
  ID_COLUMNS,
  INT_CAST_COLUMNS,
  sample,
  toCsv,
  type CopulaModel,
  type SampleResult,
} from "./copula";
import {
  claimCommentText,
  fetchHelpWantedIssues,
  loadHandle,
  renderCollabList,
  saveHandle,
  type CollabIssue,
} from "./collaborate";
import { initI18n, t } from "./i18n";
import { checkOnDemand, checkOnStartup } from "./updater";
import { initSynthea } from "./synthea";
import { NATIONAL_REFERENCES, wilsonInterval } from "./national-reference";

// Lazy-load the bundled model for the chosen cohort.
async function loadModel(cohort: "tolerant" | "strict"): Promise<CopulaModel> {
  const url = cohort === "strict"
    ? new URL("./model_strict.json", import.meta.url)
    : new URL("./model_tolerant.json", import.meta.url);
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`model fetch failed: ${r.status}`);
  return (await r.json()) as CopulaModel;
}

function el<T extends HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`missing element #${id}`);
  return e as T;
}

function setStatus(msg: string, kind: "info" | "success" | "error" = "info") {
  const s = el<HTMLParagraphElement>("status");
  s.textContent = msg;
  s.className = "status " + (kind === "info" ? "muted" : kind);
}

function readParams() {
  const cohort = (document.querySelector<HTMLInputElement>(
    "input[name=cohort]:checked",
  )?.value ?? "tolerant") as "tolerant" | "strict";
  return {
    cohort,
    n: Math.max(1, Math.min(1_000_000, parseInt(el<HTMLInputElement>("n").value || "1000"))),
    seed: parseInt(el<HTMLInputElement>("seed").value || "42") | 0,
    applyConstraints: el<HTMLInputElement>("apply-constraints").checked,
    applyMissingness: el<HTMLInputElement>("include-missingness").checked,
    clinicalOnly: el<HTMLInputElement>("clinical-only").checked,
    longitudinal: el<HTMLInputElement>("longitudinal").checked,
    encountersPerPatient: Math.max(1, parseFloat(
      el<HTMLInputElement>("encounters-per-patient").value || "4",
    )),
    yearsOfHistory: Math.max(0.25, parseFloat(
      el<HTMLInputElement>("years-of-history").value || "3",
    )),
  };
}

async function generate(): Promise<SampleResult | null> {
  const p = readParams();
  setStatus(`Loading ${p.cohort} model…`);
  let model: CopulaModel;
  try {
    model = await loadModel(p.cohort);
  } catch (e) {
    setStatus(`Could not load model: ${(e as Error).message}. Did you run scripts/refresh_app_model.sh?`, "error");
    return null;
  }

  // In longitudinal mode `n` is the target *total encounter* count; we draw
  // fewer baselines and expand each into ~encountersPerPatient encounters.
  const targetEncounters = p.n;
  const baselineTarget = p.longitudinal
    ? Math.max(1, Math.round(targetEncounters / p.encountersPerPatient))
    : targetEncounters;

  setStatus(
    p.longitudinal
      ? `Sampling ~${baselineTarget.toLocaleString()} baselines × ~${p.encountersPerPatient.toFixed(1)} encounters from ${p.cohort} cohort (n_train = ${model.n_train.toLocaleString()})…`
      : `Sampling ${p.n.toLocaleString()} episodes from ${p.cohort} cohort (n_train = ${model.n_train.toLocaleString()})…`,
  );

  // 1) Copula sample → physiologic constraint filter (oversample to recover).
  const factor = p.applyConstraints ? 1.5 : 1.0;
  let baselines = sample(model, {
    n: Math.ceil(baselineTarget * factor),
    seed: p.seed,
    applyMissingness: p.applyMissingness,
  });
  if (p.applyConstraints) {
    baselines = applyPhysiologicConstraints(baselines);
    if (baselines.rows.length < baselineTarget) {
      const extra = sample(model, {
        n: Math.ceil((baselineTarget - baselines.rows.length) * 2),
        seed: p.seed + 1,
        applyMissingness: p.applyMissingness,
      });
      const more = applyPhysiologicConstraints(extra);
      baselines = { columns: baselines.columns, rows: baselines.rows.concat(more.rows) };
    }
  }
  baselines = { columns: baselines.columns, rows: baselines.rows.slice(0, baselineTarget) };

  // 2) Synthesize identifiers (RF_EPISODE2, HASTA_ID, episode_date).
  baselines = addIdentifiers(baselines, model, p.seed + 2);

  // 3) Longitudinal expansion (one row per encounter).
  let result: SampleResult;
  if (p.longitudinal) {
    result = expandToTrajectories(baselines, model, {
      encountersPerPatientMean: p.encountersPerPatient,
      yearsOfHistory: p.yearsOfHistory,
      labDriftScale: 0.05,
      ageAdvance: true,
      seed: p.seed + 3,
    });
    if (p.applyConstraints) result = applyPhysiologicConstraints(result);
    // Trim to the user's target encounter count (Poisson can overshoot).
    result = { columns: result.columns, rows: result.rows.slice(0, targetEncounters) };
  } else {
    result = baselines;
  }

  // 4) Drop curation-flag columns from the CSV/preview output by default.
  if (p.clinicalOnly) {
    result = dropCurationFlags(result, curationColumns(model));
  }

  const status = p.longitudinal
    ? `✓ Generated ${result.rows.length.toLocaleString()} encounters across ~${baselineTarget.toLocaleString()} patients (${p.cohort}).`
    : `✓ Generated ${result.rows.length.toLocaleString()} rows from ${p.cohort} cohort.`;
  setStatus(status, "success");
  return result;
}

function downloadCsv(result: SampleResult, cohort: string) {
  const csv = toCsv(result, INT_CAST_COLUMNS);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  a.href = url;
  a.download = `syntha_${cohort}_${result.rows.length}_${ts}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const ID_COLUMN_SET = new Set<string>(ID_COLUMNS);

function formatCell(col: string, v: number | string | null | undefined): string {
  if (v === null || v === undefined) {
    return "<td><span class='muted'>—</span></td>";
  }
  if (typeof v === "string") {
    return `<td>${escapeHtml(v)}</td>`;
  }
  if (Number.isNaN(v)) {
    return "<td><span class='muted'>—</span></td>";
  }
  if (INT_CAST_COLUMNS.has(col) || ID_COLUMN_SET.has(col)) {
    return `<td>${Math.round(v)}</td>`;
  }
  return `<td>${Number.isInteger(v) ? v : v.toFixed(2)}</td>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string
  ));
}

function pct(x: number): string {
  return (x * 100).toFixed(1) + "%";
}

function renderCalibration(result: SampleResult) {
  const card = el<HTMLElement>("calibration-card");
  const container = el<HTMLDivElement>("calibration-table");
  const rows: string[] = [];

  for (const ref of NATIONAL_REFERENCES) {
    const idx = result.columns.indexOf(ref.column);
    if (idx === -1) continue; // not present for this cohort, or dropped

    let successes = 0;
    let n = 0;
    for (const row of result.rows) {
      const v = row[idx];
      if (v === null || v === undefined) continue;
      n++;
      if (Number(v) === 1) successes++;
    }
    if (n === 0) continue;

    const phat = successes / n;
    const ci = wilsonInterval(successes, n);
    const coversNational = ref.rate >= ci.lo && ref.rate <= ci.hi;
    const badgeClass = coversNational ? "calibration-badge--ok" : "calibration-badge--gap";
    const badgeText = coversNational ? "within expected range" : "differs from national figure";

    // Scale each row's bars to its own range so small prevalences (a few %)
    // aren't reduced to an unreadable sliver.
    const scaleMax = Math.max(ci.hi, ref.rate) * 1.3;
    const widthPct = (v: number) => `${Math.max(0, (v / scaleMax) * 100).toFixed(2)}%`;

    rows.push(`
      <div class="calibration-row">
        <div class="calibration-row__head">
          <strong>${escapeHtml(ref.label)}</strong>
          <span class="calibration-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="calibration-bars">
          <div class="calibration-bar-row">
            <span class="calibration-bar-tag">Your batch</span>
            <div class="calibration-track">
              <div class="calibration-fill calibration-fill--batch" style="width:${widthPct(phat)}"></div>
              <div class="calibration-ci" style="left:${widthPct(ci.lo)};width:${widthPct(ci.hi - ci.lo)}"></div>
            </div>
            <span class="calibration-bar-val">${pct(phat)} (n=${n})</span>
          </div>
          <div class="calibration-bar-row">
            <span class="calibration-bar-tag">Türkiye</span>
            <div class="calibration-track">
              <div class="calibration-fill calibration-fill--national" style="width:${widthPct(ref.rate)}"></div>
            </div>
            <span class="calibration-bar-val">${pct(ref.rate)}</span>
          </div>
        </div>
        <p class="calibration-note">
          Source: <a href="${escapeHtml(ref.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(ref.source)} (${ref.year})</a>.
          ${ref.note ? escapeHtml(ref.note) : ""}
        </p>
      </div>
    `);
  }

  if (rows.length === 0) {
    container.innerHTML = `<p class="hint">None of the modeled comorbidities in this batch have a matched national reference yet.</p>`;
  } else {
    container.innerHTML = rows.join("");
  }
  card.hidden = false;
}

function renderPreview(result: SampleResult) {
  const card = el<HTMLElement>("preview-card");
  const container = el<HTMLDivElement>("preview");
  const cols = result.columns;
  const head = "<thead><tr>" + cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("") + "</tr></thead>";
  const body = result.rows.slice(0, 50).map((row) => {
    const cells = cols.map((c, i) => formatCell(c, row[i]));
    return "<tr>" + cells.join("") + "</tr>";
  }).join("");
  container.innerHTML = `<table>${head}<tbody>${body}</tbody></table>`;
  card.hidden = false;
}

el<HTMLButtonElement>("generate").addEventListener("click", async () => {
  el<HTMLButtonElement>("generate").disabled = true;
  el<HTMLButtonElement>("preview-btn").disabled = true;
  try {
    const result = await generate();
    if (result && result.rows.length > 0) {
      downloadCsv(result, readParams().cohort);
      renderCalibration(result);
    }
  } finally {
    el<HTMLButtonElement>("generate").disabled = false;
    el<HTMLButtonElement>("preview-btn").disabled = false;
  }
});

el<HTMLButtonElement>("preview-btn").addEventListener("click", async () => {
  el<HTMLButtonElement>("generate").disabled = true;
  el<HTMLButtonElement>("preview-btn").disabled = true;
  try {
    const result = await generate();
    if (result && result.rows.length > 0) {
      renderPreview(result);
      renderCalibration(result);
    }
  } finally {
    el<HTMLButtonElement>("generate").disabled = false;
    el<HTMLButtonElement>("preview-btn").disabled = false;
  }
});

// Toggle visibility of the longitudinal sub-parameters when the checkbox flips.
const longitudinalToggle = el<HTMLInputElement>("longitudinal");
const longitudinalParams = el<HTMLDivElement>("longitudinal-params");
function refreshLongitudinalParamsVisibility() {
  longitudinalParams.hidden = !longitudinalToggle.checked;
}
longitudinalToggle.addEventListener("change", refreshLongitudinalParamsVisibility);
refreshLongitudinalParamsVisibility();

// Initialize i18n before any user-facing strings are emitted. Sets
// document.documentElement.lang + walks [data-i18n-key] and substitutes
// translations for the detected locale (tr if browser locale starts with
// 'tr', else en). Saved preference in localStorage["syntha.locale"]
// overrides detection.
initI18n();
initSynthea();

setStatus(t("status_idle"));

// ── Collaborate panel ─────────────────────────────────────────────
let cachedIssues: CollabIssue[] = [];

function getHandleInput(): HTMLInputElement {
  return el<HTMLInputElement>("collab-handle");
}

async function refreshCollab(force = false) {
  const list = el<HTMLDivElement>("collab-list");
  list.innerHTML = `<p class="muted">${t("collab_fresh")} …</p>`;
  const { issues, fromCache, fetchedAt, error } = await fetchHelpWantedIssues(force);
  cachedIssues = issues;
  renderCollabList(list, issues, fromCache, fetchedAt, error);
  attachClaimHandlers();
}

function attachClaimHandlers() {
  document.querySelectorAll<HTMLButtonElement>(".collab-claim").forEach((btn) => {
    btn.addEventListener("click", () => {
      const n = Number(btn.dataset.issue);
      const issue = cachedIssues.find((i) => i.number === n);
      if (!issue) return;
      openClaimModal(issue);
    });
  });
}

function openClaimModal(issue: CollabIssue) {
  const handle = getHandleInput().value.trim();
  if (!handle) {
    setStatus(t("collab_no_handle"), "error");
    getHandleInput().focus();
    return;
  }
  saveHandle(handle);
  const modal = el<HTMLDivElement>("collab-modal");
  const pre = el<HTMLPreElement>("collab-claim-text");
  pre.textContent = claimCommentText(issue, handle);
  modal.hidden = false;

  const copyBtn = el<HTMLButtonElement>("collab-copy");
  const openBtn = el<HTMLButtonElement>("collab-open-issue");
  const closeBtn = el<HTMLButtonElement>("collab-close");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent ?? "");
      copyBtn.textContent = t("collab_claim_copied");
      setTimeout(() => { copyBtn.textContent = t("collab_claim_copy"); }, 1500);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(pre);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  };
  const onOpenIssue = () => window.open(issue.url, "_blank", "noopener");
  const onClose = () => {
    modal.hidden = true;
    copyBtn.removeEventListener("click", onCopy);
    openBtn.removeEventListener("click", onOpenIssue);
    closeBtn.removeEventListener("click", onClose);
    modal.removeEventListener("click", onBackdrop);
  };
  const onBackdrop = (e: MouseEvent) => {
    if (e.target === modal) onClose();
  };
  copyBtn.addEventListener("click", onCopy);
  openBtn.addEventListener("click", onOpenIssue);
  closeBtn.addEventListener("click", onClose);
  modal.addEventListener("click", onBackdrop);
}

// Restore handle on launch + wire save / refresh buttons.
getHandleInput().value = loadHandle();
el<HTMLButtonElement>("collab-handle-save").addEventListener("click", () => {
  const v = getHandleInput().value.trim().replace(/^@+/, "");
  saveHandle(v);
  getHandleInput().value = v;
  const btn = el<HTMLButtonElement>("collab-handle-save");
  const orig = btn.textContent ?? "";
  btn.textContent = t("collab_handle_saved");
  setTimeout(() => { btn.textContent = orig; }, 1200);
});
el<HTMLButtonElement>("collab-refresh").addEventListener("click", () => {
  void refreshCollab(true);
});
void refreshCollab(false);

// Updater: silent check on launch + wire the footer button.
checkOnStartup();
document.getElementById("check-updates")?.addEventListener("click", checkOnDemand);
