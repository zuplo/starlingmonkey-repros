# Repro 2: Response.clone() missing / WASM stream tee failure

## Bug

`Response.clone()` either does not exist as a function on the Response prototype, or it throws at runtime because the underlying `ReadableStream.tee()` is not implemented for WASM-backed streams.

## Expected Behavior (per web spec)

`Response.clone()` should return a new Response object with the same body, headers, and status. Both the original and the clone should be independently consumable. This is defined in the Fetch spec (https://fetch.spec.whatwg.org/#dom-response-clone).

## Actual Behavior (StarlingMonkey/Spin)

One of:
- `upstream.clone` is `undefined` (clone not implemented on Response)
- `upstream.clone()` throws with an error related to stream tee not being supported for WASM streams

## Test

```bash
curl http://localhost:3000/
```

The app fetches an upstream URL, attempts to clone the response, and reads both bodies. On success it returns both bodies. On failure it returns the error.

## Impact on Zuplo

Response cloning is essential for middleware patterns where the body needs to be read for inspection (logging, validation) while still being forwarded to the client. Without clone, the body can only be consumed once.

## Suggested Fix

Implement `ReadableStream.tee()` for WASM-backed streams, or implement `Response.clone()` by buffering the body internally when tee is not available.
