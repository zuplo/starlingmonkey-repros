async function handleRequest(request) {
  if (request.method !== "POST") {
    return new Response("POST with: curl -d 'name=hello&empty=' http://localhost:3004/");
  }
  const fd = await request.formData();
  const entries = {};
  for (const [k, v] of fd.entries()) entries[k] = v;

  return new Response(JSON.stringify({
    entries,
    hasEmpty: fd.has("empty"),
    getEmpty: fd.get("empty"),
  }, null, 2));
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
