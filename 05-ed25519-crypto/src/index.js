addEventListener("fetch", (event) => {
  event.respondWith(handleRequest());
});

async function handleRequest() {
  try {
    const jwk = {
      kty: "OKP", crv: "Ed25519",
      d: "IitK_P7cOK15JNfvQUCJkHljRSnAQrHUHJAmAceR-R4",
      x: "3O13vdpujowj_uHwqh-6D5puCBbqkm5K5NgsaDbcazo"
    };
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["sign"]);
    const sig = await crypto.subtle.sign({ name: "Ed25519" }, key, new TextEncoder().encode("test"));
    return new Response(JSON.stringify({ success: true, sigBytes: sig.byteLength }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.name + ": " + e.message }), { status: 500 });
  }
}
