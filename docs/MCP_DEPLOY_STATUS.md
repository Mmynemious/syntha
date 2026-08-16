# MCP Streamable HTTP connector — deploy status

Status note so this picks back up cleanly. GitHub Issues are disabled on
this fork, so this lives in the repo instead.

## Goal

Host the `syntha-mcp` server as a Streamable HTTP connector so it can be
added directly in Claude.com (no local install, no Anthropic directory
review needed), living on the same Vercel project as the landing page
(`syntha-six.vercel.app`).

## Done (all committed to `claude/forked-project-overview-zezjck`)

- **`aa0c209`** — pinned `mcp>=1.2,<2` in `pyproject.toml`. `mcp` 2.0
  renamed/moved `FastMCP`, which broke `pip install "syntha-ehr[mcp]"`.
- **`aa0c209`** — fixed a crash in
  `src/syntha/export_model.py:load_generator_from_json`. A
  `Path(long_json_string).exists()` call could raise `OSError`
  (`ENAMETOOLONG`) instead of returning `False`, crashing every
  cohort-generation MCP tool call. Reordered the JSON-text/path
  detection and guarded the filesystem check.
- **`6e5d70d`** — added `app/api/mcp.py` + `app/requirements.txt`, a
  Vercel Python serverless function that hosts `syntha.mcp_server`'s
  `FastMCP` app over Streamable HTTP. Also fixes a routing bug: FastMCP
  mounts its endpoint at `/mcp` by default, but Vercel only forwards the
  *exact* function path (`/api/mcp`) to a Python function — no wildcard
  sub-paths without a `vercel.json` rewrite. Fixed by setting
  `_app.settings.streamable_http_path = "/api/mcp"` so the mount matches
  Vercel's routing exactly. Once deployed, the connector URL will be:

  ```
  https://syntha-six.vercel.app/api/mcp
  ```

- **`4c3f59c`** — restyled `generate.html` to match the landing page's
  dark theme (unrelated to MCP, landed the same session).

All three MCP fixes are verified locally: fresh-venv installs, the full
`pytest -q` suite, a live local `uvicorn` + JSON-RPC `initialize`
handshake test, and a direct `generate_cohort_csv` tool call returning
real synthetic CSV data.

- **`c2da24e`** — **deployed.** The Vercel project (`mmynemious-projects/syntha`,
  already Git-connected to this repo) had its Root Directory fixed from
  `.` to `app`, and its Framework Preset cleared from an auto-detected
  `Python` (which was suppressing the static Vite build) to none. Three
  bugs found and fixed along the way:
  - `app/pyproject.toml` added as the single source of Python deps for
    `api/mcp.py`, and `app/requirements.txt` removed — having both
    caused Vercel to install the same ~40 packages (pandas/numpy/scipy/
    scikit-learn) twice, pushing the function bundle past the 500MB
    limit (532MB observed; single-install is 269MB).
  - `app/vercel.json` added (`buildCommand`/`outputDirectory: dist`) so
    the Vite frontend still builds once the Python framework preset is
    gone — otherwise the whole project got treated as one Python
    function and the static landing page 404'd.
  - `app/api/mcp.py` now explicitly disables FastMCP's DNS-rebinding
    `TransportSecuritySettings` (it auto-scopes `allowed_hosts` to
    `127.0.0.1`/`localhost` when constructed with the default host,
    which rejected every real request with a 421 "Invalid Host header").
  - Live verification: `https://syntha-six.vercel.app/` → 200,
    `https://syntha-six.vercel.app/api/mcp` → JSON-RPC `initialize`
    round-trips and lists all bundled tools.

## Not done yet

1. **MCP listing files not rebranded.** `mcp/manifest.json`,
   `mcp/LISTING.md`, `mcp/SUBMISSION.md` still hard-code the original
   upstream author's identity (name, email, ORCID, institution) and all
   `github.com/ArioMoniri/syntha` URLs. Decision already made: list the
   fork owner as maintainer with a "based on syntha by Ariorad Moniri"
   credit line, and repoint URLs to `github.com/Mmynemious/syntha`. Not
   started.
2. **Claude.com connector not added yet.** The endpoint is live and
   verified via raw JSON-RPC — next step is adding
   `https://syntha-six.vercel.app/api/mcp` as a custom connector in
   Claude.com and confirming a real tool call round-trips through the
   actual client.
