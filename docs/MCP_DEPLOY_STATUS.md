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

## Not done yet

1. **Not deployed.** Getting this onto `syntha-six.vercel.app` needs a
   full production deploy of the `app/` directory. Repeated
   inline-file-payload deploy attempts hit a size wall (the deploy tool
   needs the whole ~130KB `app/` tree in one atomic call). The clean fix
   is linking the Vercel project to this GitHub repo — **Project
   Settings → Git → Connect Repository, root directory `app`** — so
   Vercel builds straight from pushed commits instead. That needs
   project-creation/linking rights on the Vercel team that weren't
   available to the deploying session. **Next step: connect the repo via
   the Vercel dashboard, then redeploy (or re-grant the linking
   permission and retry `create_git_project`).**
2. **MCP listing files not rebranded.** `mcp/manifest.json`,
   `mcp/LISTING.md`, `mcp/SUBMISSION.md` still hard-code the original
   upstream author's identity (name, email, ORCID, institution) and all
   `github.com/ArioMoniri/syntha` URLs. Decision already made: list the
   fork owner as maintainer with a "based on syntha by Ariorad Moniri"
   credit line, and repoint URLs to `github.com/Mmynemious/syntha`. Not
   started.
3. **No end-to-end connector test yet.** Once deployed, add
   `https://syntha-six.vercel.app/api/mcp` as a custom connector in
   Claude.com and confirm a real tool call round-trips.
