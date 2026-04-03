// Bug: fetch() redirect option not implemented
//
// The `redirect` option in fetch() (manual, follow, error) is either
// ignored or not implemented, meaning redirects are always followed
// automatically with no way to inspect or suppress them.

addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  const mode = url.searchParams.get("mode") || "manual";

  try {
    // httpbin.org/redirect/1 returns a 302 redirect to /get
    const response = await fetch("https://httpbin.org/redirect/1", {
      redirect: mode, // "manual", "follow", or "error"
    });

    const result = JSON.stringify(
      {
        requestedMode: mode,
        status: response.status,
        redirected: response.redirected,
        responseUrl: response.url,
        // Expected behavior per mode:
        // "manual"  -> status: 302, redirected: false (redirect NOT followed)
        // "follow"  -> status: 200, redirected: true  (redirect followed)
        // "error"   -> TypeError thrown (should not reach here)
        locationHeader: response.headers.get("location"),
      },
      null,
      2
    );

    event.respondWith(
      new Response(result, {
        headers: { "content-type": "application/json" },
      })
    );
  } catch (e) {
    // With redirect:"error", a TypeError should be thrown
    event.respondWith(
      new Response(
        JSON.stringify(
          {
            requestedMode: mode,
            errorThrown: true,
            errorName: e.name,
            errorMessage: e.message,
            // For "error" mode, this IS the expected behavior
          },
          null,
          2
        ),
        {
          status: mode === "error" ? 200 : 500,
          headers: { "content-type": "application/json" },
        }
      )
    );
  }
});
