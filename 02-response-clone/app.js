// Bug: Response.clone() missing or WASM stream tee failure
//
// Response.clone() either doesn't exist or fails because the underlying
// ReadableStream.tee() is not implemented for WASM-backed streams.

addEventListener("fetch", async (event) => {
  // Fetch an upstream response
  const upstream = await fetch("https://echo.zuplo.io/hello");

  // Test 1: Does Response.clone exist?
  const hasClone = typeof upstream.clone === "function";

  if (!hasClone) {
    event.respondWith(
      new Response(
        JSON.stringify({ error: "Response.clone is not a function" }),
        { status: 500, headers: { "content-type": "application/json" } }
      )
    );
    return;
  }

  // Test 2: Can we actually call clone()?
  try {
    const cloned = upstream.clone();
    const originalBody = await upstream.text();
    const clonedBody = await cloned.text();

    event.respondWith(
      new Response(
        JSON.stringify({
          success: true,
          originalBody: originalBody,
          clonedBody: clonedBody,
          bodiesMatch: originalBody === clonedBody,
        }),
        { headers: { "content-type": "application/json" } }
      )
    );
  } catch (e) {
    event.respondWith(
      new Response(
        JSON.stringify({
          error: "clone() threw",
          message: e.message,
          name: e.name,
        }),
        { status: 500, headers: { "content-type": "application/json" } }
      )
    );
  }
});
