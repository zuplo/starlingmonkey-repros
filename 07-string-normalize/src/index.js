addEventListener("fetch", (event) => {
  const has = typeof String.prototype.normalize === "function";
  let result;
  try {
    result = "café".normalize("NFC");
    event.respondWith(new Response(JSON.stringify({ hasNormalize: has, result, success: true })));
  } catch (e) {
    event.respondWith(new Response(JSON.stringify({ hasNormalize: has, error: e.message }), { status: 500 }));
  }
});
