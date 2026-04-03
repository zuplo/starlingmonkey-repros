addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "manual";

  try {
    const res = await fetch("https://httpbin.org/redirect/1", { redirect: mode });
    return new Response(JSON.stringify({
      mode, status: res.status, redirected: res.redirected, url: res.url
    }, null, 2));
  } catch (e) {
    return new Response(JSON.stringify({ mode, error: e.message }), { status: 500 });
  }
}
