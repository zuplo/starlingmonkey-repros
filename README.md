# StarlingMonkey / Spin Bug Reproductions

Minimal reproduction cases for 8 bugs found in StarlingMonkey's Web API implementation when running on Spin.

Each repro is a standalone directory containing:
- `app.js` -- Minimal JS that demonstrates the bug using `addEventListener("fetch", ...)`
- `spin.toml` -- Spin manifest for running the app
- `README.md` -- Expected vs actual behavior, impact, and suggested fix

## Repros

| # | Directory | Bug | Severity |
|---|-----------|-----|----------|
| 1 | `01-random-wizer-trap/` | `wasi:random` traps during Wizer pre-init | **High** -- blocks any top-level randomness |
| 2 | `02-response-clone/` | `Response.clone()` missing / stream tee failure | **High** -- blocks middleware body inspection |
| 3 | `03-urlsearchparams-empty/` | `URLSearchParams.get()` returns null for empty values | **Medium** -- breaks form/query parsing |
| 4 | `04-formdata-empty/` | `Request.formData()` drops empty fields | **Medium** -- same root cause as #3 |
| 5 | `05-ed25519-crypto/` | Ed25519/EdDSA not in SubtleCrypto | **High** -- blocks EdDSA JWT verification |
| 6 | `06-fetch-redirect/` | `fetch()` redirect option not implemented | **Medium** -- blocks redirect control |
| 7 | `07-string-normalize/` | `String.prototype.normalize` missing | **Medium** -- blocks Unicode normalization |
| 8 | `08-async-local-storage/` | `AsyncLocalStorage` not available | **Critical** -- blocks request context propagation |

## How to Use

These are JS source files only. To run them:

1. Componentize the JS file into a WASM component using StarlingMonkey's `componentize.sh`
2. Place the resulting `app.wasm` in the same directory as `spin.toml`
3. Run with `spin up`

```bash
# Example (adjust paths to your StarlingMonkey build)
cd 01-random-wizer-trap/
/path/to/componentize.sh app.js app.wasm
spin up
```

## Notes

- Repros 3 and 4 likely share a root cause (URL-encoded parsing of empty values)
- These repros use the `addEventListener("fetch", ...)` pattern (Spin's native JS pattern)
- No npm dependencies -- each repro is a single standalone JS file
