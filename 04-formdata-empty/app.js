// Bug: Request.formData() drops empty fields
//
// When parsing a URL-encoded body like "name=hello&empty=",
// the "empty" field is dropped entirely instead of being
// preserved with an empty string value.

addEventListener("fetch", async (event) => {
  if (event.request.method === "POST") {
    try {
      const fd = await event.request.formData();
      const result = {};
      for (const [key, value] of fd.entries()) {
        result[key] = value;
      }

      // When POST body is "name=hello&empty=" :
      // Expected: { name: "hello", empty: "" }
      // Actual: { name: "hello" }  (empty field dropped)

      event.respondWith(
        new Response(
          JSON.stringify(
            {
              entries: result,
              entryCount: Object.keys(result).length,
              hasEmpty: fd.has("empty"),
              getEmpty: fd.get("empty"),
            },
            null,
            2
          ),
          { headers: { "content-type": "application/json" } }
        )
      );
    } catch (e) {
      event.respondWith(
        new Response(
          JSON.stringify({ error: e.message }),
          { status: 500, headers: { "content-type": "application/json" } }
        )
      );
    }
  } else {
    event.respondWith(
      new Response(
        "POST a url-encoded body with an empty field.\n\n" +
        "Example:\n" +
        '  curl -X POST -d "name=hello&empty=" http://localhost:3000/\n',
        { headers: { "content-type": "text/plain" } }
      )
    );
  }
});
