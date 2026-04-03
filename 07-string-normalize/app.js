// Bug: String.prototype.normalize missing
//
// String.prototype.normalize() is either missing or throws,
// preventing Unicode normalization (NFC, NFD, NFKC, NFKD).

addEventListener("fetch", (event) => {
  const results = {};

  // Check if normalize exists
  results.hasNormalize = typeof String.prototype.normalize === "function";

  // Test NFC normalization
  // "caf\u00e9" (precomposed) vs "cafe\u0301" (decomposed) should be equal after NFC
  const precomposed = "caf\u00e9"; // e-acute as single codepoint
  const decomposed = "cafe\u0301"; // e + combining acute

  results.precomposedLength = precomposed.length; // 4
  results.decomposedLength = decomposed.length; // 5
  results.equalBeforeNormalize = precomposed === decomposed; // false

  try {
    const normalizedPre = precomposed.normalize("NFC");
    const normalizedDec = decomposed.normalize("NFC");
    results.nfc = {
      success: true,
      equalAfterNFC: normalizedPre === normalizedDec, // should be true
      normalizedPreLength: normalizedPre.length, // should be 4
      normalizedDecLength: normalizedDec.length, // should be 4
    };
  } catch (e) {
    results.nfc = { success: false, error: `${e.name}: ${e.message}` };
  }

  // Test NFD normalization
  try {
    const nfd = precomposed.normalize("NFD");
    results.nfd = {
      success: true,
      length: nfd.length, // should be 5 (decomposed)
    };
  } catch (e) {
    results.nfd = { success: false, error: `${e.name}: ${e.message}` };
  }

  // Test NFKC normalization
  try {
    const ligature = "\uFB01"; // fi ligature
    const nfkc = ligature.normalize("NFKC");
    results.nfkc = {
      success: true,
      input: ligature,
      output: nfkc, // should be "fi"
      outputLength: nfkc.length, // should be 2
    };
  } catch (e) {
    results.nfkc = { success: false, error: `${e.name}: ${e.message}` };
  }

  event.respondWith(
    new Response(JSON.stringify(results, null, 2), {
      headers: { "content-type": "application/json" },
    })
  );
});
