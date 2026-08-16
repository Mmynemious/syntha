// Runs the official MITRE Synthea generator (Java/Gradle) inside a persistent
// Vercel Sandbox. First call builds the uber jar from source (~1-2 min);
// every call after that reuses the same named sandbox and just re-invokes
// the already-built jar, since its filesystem persists between requests.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { APIError, Sandbox } from "@vercel/sandbox";

function describeError(e: unknown): { message: string; detail?: string } {
  if (e instanceof APIError) {
    const detail = e.json ? JSON.stringify(e.json) : e.text;
    return { message: e.message, detail };
  }
  return { message: e instanceof Error ? e.message : String(e) };
}

export const config = {
  maxDuration: 300,
};

const SANDBOX_NAME = "synthea-runtime";
const REPO_URL = "https://github.com/synthetichealth/synthea.git";
const SYNTHEA_DIR = "/vercel/sandbox/synthea";
const JAR_PATH = `${SYNTHEA_DIR}/build/libs/synthea-with-dependencies.jar`;

const US_STATES = new Set([
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
]);

async function buildSynthea(sandbox: Sandbox): Promise<void> {
  const install = await sandbox.runCommand({
    cmd: "bash",
    args: ["-c", "apt-get update -qq && apt-get install -y -qq openjdk-21-jdk-headless git zip"],
    sudo: true,
  });
  if (install.exitCode !== 0) {
    throw new Error(`toolchain install failed: ${(await install.stderr()).slice(-2000)}`);
  }

  const clone = await sandbox.runCommand({
    cmd: "bash",
    args: ["-c", `rm -rf "${SYNTHEA_DIR}" && git clone --depth 1 ${REPO_URL} "${SYNTHEA_DIR}"`],
  });
  if (clone.exitCode !== 0) {
    throw new Error(`git clone failed: ${(await clone.stderr()).slice(-2000)}`);
  }

  const build = await sandbox.runCommand({
    cmd: "./gradlew",
    args: ["uberJar", "-x", "test", "-x", "javadoc", "--console=plain"],
    cwd: SYNTHEA_DIR,
  });
  if (build.exitCode !== 0) {
    throw new Error(`gradle build failed: ${(await build.stderr()).slice(-4000)}`);
  }
}

async function getSandbox(): Promise<Sandbox> {
  const sandbox = await Sandbox.getOrCreate({
    name: SANDBOX_NAME,
    timeout: 60 * 60 * 1000,
    persistent: true,
    resources: { vcpus: 4 },
    onCreate: buildSynthea,
  });

  // Self-heal: getOrCreate only runs onCreate for a brand-new sandbox. If a
  // prior build crashed partway (so the named sandbox exists but the jar
  // doesn't), rebuild now instead of failing forever.
  const probe = await sandbox.runCommand({ cmd: "test", args: ["-f", JAR_PATH] });
  if (probe.exitCode !== 0) {
    await buildSynthea(sandbox);
  }

  return sandbox;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const state = typeof body.state === "string" && US_STATES.has(body.state)
    ? body.state
    : "Massachusetts";
  const populationRaw = parseInt(String(body.population ?? ""), 10);
  const population = Math.min(500, Math.max(1, Number.isFinite(populationRaw) ? populationRaw : 25));
  const seedRaw = body.seed === undefined || body.seed === "" ? NaN : parseInt(String(body.seed), 10);
  const seed = Number.isFinite(seedRaw) ? seedRaw : undefined;

  try {
    const sandbox = await getSandbox();

    const runId = Math.random().toString(36).slice(2, 10);
    const outDir = `/vercel/sandbox/run_${runId}`;
    const zipPath = `/tmp/synthea_out_${runId}.zip`;

    const args = [
      "-jar", "build/libs/synthea-with-dependencies.jar",
      "-p", String(population),
      ...(seed !== undefined ? ["-s", String(seed)] : []),
      `--exporter.baseDirectory=${outDir}/`,
      "--exporter.csv.export=true",
      "--exporter.fhir.export=false",
      "--exporter.csv.excluded_files=claims.csv,claims_transactions.csv,payer_transitions.csv,payers.csv",
      state,
    ];

    const run = await sandbox.runCommand({ cmd: "java", args, cwd: SYNTHEA_DIR });
    if (run.exitCode !== 0) {
      res.status(500).json({ error: "Synthea run failed", detail: (await run.stderr()).slice(-4000) });
      return;
    }

    const zipName = `synthea_${state.replace(/\s+/g, "_")}_${population}.zip`;
    const zip = await sandbox.runCommand({
      cmd: "bash",
      args: ["-c", `cd "${outDir}/csv" && zip -rq "${zipPath}" .`],
    });
    if (zip.exitCode !== 0) {
      res.status(500).json({ error: "Packaging failed", detail: (await zip.stderr()).slice(-2000) });
      return;
    }

    const buffer = await sandbox.readFileToBuffer({ path: zipPath });
    if (!buffer) {
      res.status(500).json({ error: "Could not read generated archive" });
      return;
    }

    // Best-effort cleanup of this run's output; never blocks the response.
    void sandbox.runCommand({ cmd: "rm", args: ["-rf", outDir, zipPath] }).catch(() => {});

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);
    res.status(200).send(buffer);
  } catch (e) {
    const { message, detail } = describeError(e);
    console.error("synthea-generate failed:", message, detail);
    res.status(500).json({ error: message, detail });
  }
}
