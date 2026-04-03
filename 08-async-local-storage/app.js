// Bug: AsyncLocalStorage not available
//
// Neither globalThis.AsyncLocalStorage nor the node:async_hooks module
// is available in StarlingMonkey, preventing request-scoped context
// propagation.

addEventListener("fetch", async (event) => {
  const results = {};

  // Test 1: Check if AsyncLocalStorage exists as a global
  results.hasGlobalAsyncLocalStorage =
    typeof globalThis.AsyncLocalStorage !== "undefined";

  // Test 2: Check if it exists on globalThis directly
  results.asyncLocalStorageType = typeof globalThis.AsyncLocalStorage;

  // Test 3: Try dynamic import of node:async_hooks
  try {
    const mod = await import("node:async_hooks");
    results.importNodeAsyncHooks = "success (unexpected!)";
    results.moduleKeys = Object.keys(mod);
  } catch (e) {
    results.importNodeAsyncHooks = `failed: ${e.message}`;
  }

  // Test 4: If AsyncLocalStorage exists, try to use it
  if (typeof globalThis.AsyncLocalStorage !== "undefined") {
    try {
      const als = new AsyncLocalStorage();
      const value = als.run({ requestId: "test-123" }, () => {
        return als.getStore();
      });
      results.alsRun = { success: true, store: value };
    } catch (e) {
      results.alsRun = { success: false, error: e.message };
    }
  } else {
    results.alsRun = "skipped (AsyncLocalStorage not available)";
  }

  event.respondWith(
    new Response(JSON.stringify(results, null, 2), {
      headers: { "content-type": "application/json" },
    })
  );
});
