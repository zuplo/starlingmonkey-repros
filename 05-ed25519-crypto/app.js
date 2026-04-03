// Bug: Ed25519/EdDSA not supported in SubtleCrypto
//
// crypto.subtle.importKey() and crypto.subtle.sign() do not support
// the Ed25519 algorithm, which is needed for EdDSA JWTs and other
// modern cryptographic operations.

addEventListener("fetch", async (event) => {
  const results = {};

  // Test 1: Import Ed25519 private key
  try {
    const privateJwk = {
      kty: "OKP",
      crv: "Ed25519",
      d: "IitK_P7cOK15JNfvQUCJkHljRSnAQrHUHJAmAceR-R4",
      x: "3O13vdpujowj_uHwqh-6D5puCBbqkm5K5NgsaDbcazo",
    };

    const key = await crypto.subtle.importKey(
      "jwk",
      privateJwk,
      { name: "Ed25519" },
      false,
      ["sign"]
    );

    results.importKey = "success";

    // Test 2: Sign with Ed25519
    try {
      const data = new TextEncoder().encode("test message");
      const signature = await crypto.subtle.sign(
        { name: "Ed25519" },
        key,
        data
      );
      results.sign = `success (${signature.byteLength} bytes)`;
    } catch (e) {
      results.sign = `failed: ${e.name}: ${e.message}`;
    }
  } catch (e) {
    results.importKey = `failed: ${e.name}: ${e.message}`;
    results.sign = "skipped (importKey failed)";
  }

  // Test 3: Import Ed25519 public key for verification
  try {
    const publicJwk = {
      kty: "OKP",
      crv: "Ed25519",
      x: "3O13vdpujowj_uHwqh-6D5puCBbqkm5K5NgsaDbcazo",
    };

    const key = await crypto.subtle.importKey(
      "jwk",
      publicJwk,
      { name: "Ed25519" },
      false,
      ["verify"]
    );

    results.importPublicKey = "success";
  } catch (e) {
    results.importPublicKey = `failed: ${e.name}: ${e.message}`;
  }

  // Test 4: Generate Ed25519 key pair
  try {
    const keyPair = await crypto.subtle.generateKey(
      { name: "Ed25519" },
      true,
      ["sign", "verify"]
    );
    results.generateKey = "success";
  } catch (e) {
    results.generateKey = `failed: ${e.name}: ${e.message}`;
  }

  event.respondWith(
    new Response(JSON.stringify(results, null, 2), {
      headers: { "content-type": "application/json" },
    })
  );
});
