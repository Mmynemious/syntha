# Hosts the syntha MCP server over Streamable HTTP for Claude.com's custom
# connector slot. ASGI app straight from FastMCP; Vercel's Python runtime
# auto-detects the module-level `app` and serves it.
#
# Vercel only routes the exact path /api/mcp to this function (no wildcard
# sub-path routing without a vercel.json rewrite), and it hands the ASGI app
# the full, unstripped request path. So the FastMCP route has to match that
# exact path rather than its default "/mcp" mount point.
from mcp.server.transport_security import TransportSecuritySettings

from syntha.mcp_server import _app

# FastMCP auto-enables DNS-rebinding protection scoped to localhost when
# constructed with the default host ("127.0.0.1"), which rejects every
# request on a public deployment with an "Invalid Host header" 421 — this
# endpoint is a public HTTPS function, not a local dev server, so that
# protection doesn't apply here.
_app.settings.transport_security = TransportSecuritySettings(enable_dns_rebinding_protection=False)
_app.settings.streamable_http_path = "/api/mcp"
app = _app.streamable_http_app()
