addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const value = url.searchParams.get("key");

  event.respondWith(new Response(JSON.stringify({
    value: value,
    isNull: value === null,
    isEmpty: value === "",
    has: url.searchParams.has("key"),
  }, null, 2)));
});
