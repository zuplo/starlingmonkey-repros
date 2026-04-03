async function handleRequest(request) {
  const upstream = await fetch("https://echo.zuplo.io/hello");

  try {
    const hasClone = typeof upstream.clone === "function";
    if (!hasClone) {
      return new Response(JSON.stringify({ error: "clone is not a function" }), { status: 500 });
    }
    const cloned = upstream.clone();
    const body = await cloned.text();
    return new Response(JSON.stringify({ success: true, body }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
