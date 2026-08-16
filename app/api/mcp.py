# Hosts the syntha MCP server over Streamable HTTP for Claude.com's custom
# connector slot. ASGI app straight from FastMCP; Vercel's Python runtime
# auto-detects the module-level `app` and serves it.
#
# Vercel only routes the exact path /api/mcp to this function (no wildcard
# sub-path routing without a vercel.json rewrite), and it hands the ASGI app
# the full, unstripped request path. So the FastMCP route has to match that
# exact path rather than its default "/mcp" mount point.
from syntha.mcp_server import _app

_app.settings.streamable_http_path = "/api/mcp"
app = _app.streamable_http_app()
