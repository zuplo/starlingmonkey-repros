// Bug: URLSearchParams.get() returns null for empty values
//
// When a URL contains ?key= (key present with empty value),
// URLSearchParams.get("key") should return "" but returns null.

addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const value = url.searchParams.get("key");

  // When called with ?key= :
  // Expected: "" (empty string)
  // Actual: null

  const result = JSON.stringify(
    {
      requestUrl: event.request.url,
      value: value,
      type: typeof value,
      isNull: value === null,
      isEmpty: value === "",
      has: url.searchParams.has("key"),
      toString: url.searchParams.toString(),
      // Also test direct construction
      directTest: (() => {
        const sp = new URLSearchParams("key=");
        return {
          get: sp.get("key"),
          has: sp.has("key"),
          toString: sp.toString(),
        };
      })(),
    },
    null,
    2
  );

  event.respondWith(
    new Response(result, {
      headers: { "content-type": "application/json" },
    })
  );
});
