addEventListener("fetch", (event) => {
  event.respondWith(handleRequest());
});

async function handleRequest() {
  const hasGlobal = typeof globalThis.AsyncLocalStorage !== "undefined";
  let importResult;
  try {
    const mod = await import("node:async_hooks");
    importResult = "success (unexpected)";
  } catch (e) {
    importResult = "failed: " + e.message;
  }

  return new Response(JSON.stringify({
    hasAsyncLocalStorage: hasGlobal,
    importResult
  }, null, 2));
}
