# Repro 8: AsyncLocalStorage not available

## Bug

`AsyncLocalStorage` is not available as a global, and `node:async_hooks` cannot be imported. This prevents request-scoped context propagation, which is a fundamental pattern for middleware-based architectures.

## Expected Behavior

`AsyncLocalStorage` should be available either as:
1. A global (like in Cloudflare Workers: `globalThis.AsyncLocalStorage`), or
2. Via `import { AsyncLocalStorage } from "node:async_hooks"` (Node.js compat)

Usage:
```javascript
const als = new AsyncLocalStorage();
als.run({ requestId: "abc-123" }, () => {
  // In any nested sync or async call:
  const store = als.getStore();
  console.log(store.requestId); // "abc-123"
});
```

## Actual Behavior (StarlingMonkey/Spin)

- `globalThis.AsyncLocalStorage` is `undefined`
- `import("node:async_hooks")` throws a module-not-found error
- There is no alternative mechanism for request-scoped context

## Test

```bash
curl http://localhost:3000/
```

Returns JSON showing availability checks and import attempts.

## Impact on Zuplo

AsyncLocalStorage is critical for Zuplo's architecture:
- **Request context propagation**: Passing request IDs, auth info, and metadata through middleware chains without explicit parameter threading
- **Logging**: Associating log entries with specific requests across async boundaries
- **Tracing**: OpenTelemetry and similar tracing libraries depend on AsyncLocalStorage for context propagation
- **Third-party libraries**: Many npm packages (e.g., pino, Winston, cls-hooked) rely on AsyncLocalStorage

Without it, every function in the call chain must explicitly pass context, which is not feasible with third-party code.

## Suggested Fix

Implement `AsyncLocalStorage` in StarlingMonkey. SpiderMonkey has the necessary async hooks infrastructure internally. Options:

1. Implement as a native builtin using SpiderMonkey's `JS::AddAsyncContextCallback` API
2. Port the Node.js AsyncLocalStorage implementation to run on SpiderMonkey's event loop
3. At minimum, expose it as a global (like Cloudflare Workers does) even without full `node:async_hooks` module support
