# Repro 6: fetch() redirect option not implemented

## Bug

The `redirect` option in `fetch()` is either ignored or not implemented. Redirects are always followed automatically regardless of the specified mode.

## Expected Behavior (per web spec)

Per the Fetch spec (https://fetch.spec.whatwg.org/#concept-request-redirect-mode):

- `redirect: "follow"` (default) -- follow redirects automatically, `response.redirected` is `true`
- `redirect: "manual"` -- do NOT follow redirects, return the 3xx response directly with the `Location` header
- `redirect: "error"` -- throw a `TypeError` if a redirect is encountered

## Actual Behavior (StarlingMonkey/Spin)

All three modes behave the same: redirects are always followed. The `redirect` option is silently ignored.

- `redirect: "manual"` still returns status 200 (followed the redirect)
- `redirect: "error"` still returns status 200 (followed the redirect, no error thrown)
- `response.redirected` may always be `false` even when a redirect was followed

## Test

```bash
# Should return 302 with Location header (manual mode)
curl "http://localhost:3000/?mode=manual"

# Should return 200 with redirected:true (follow mode)
curl "http://localhost:3000/?mode=follow"

# Should return an error response (error mode)
curl "http://localhost:3000/?mode=error"
```

## Impact on Zuplo

Redirect control is essential for API gateways. Common use cases:
- Inspecting redirect targets before following them (security)
- Rewriting redirect URLs (e.g., changing internal URLs to external)
- Preventing open redirect attacks by validating Location headers
- OAuth flows that need to capture redirect responses

## Suggested Fix

Implement redirect mode handling in StarlingMonkey's fetch implementation. This likely requires changes at the `wasi:http` outgoing request level to support not following redirects.
