# Repro 5: Ed25519/EdDSA not in SubtleCrypto

## Bug

`crypto.subtle.importKey()`, `crypto.subtle.sign()`, `crypto.subtle.verify()`, and `crypto.subtle.generateKey()` do not support the Ed25519 algorithm. This blocks EdDSA JWT verification and modern cryptographic operations.

## Expected Behavior (per web spec)

The Web Crypto API should support Ed25519 as specified in the Secure Curves proposal (now part of the Web Crypto spec). All major browsers (Chrome 113+, Firefox 129+, Safari 17+) support Ed25519.

Operations that should work:
- `importKey("jwk", ..., { name: "Ed25519" }, ...)` with OKP/Ed25519 keys
- `sign({ name: "Ed25519" }, key, data)` producing 64-byte signatures
- `verify({ name: "Ed25519" }, key, signature, data)` returning boolean
- `generateKey({ name: "Ed25519" }, ...)` producing a CryptoKeyPair

## Actual Behavior (StarlingMonkey/Spin)

All Ed25519 operations throw `NotSupportedError` or similar, indicating the algorithm is not recognized.

## Test

```bash
curl http://localhost:3000/
```

Returns JSON showing which Ed25519 operations succeed or fail.

## Impact on Zuplo

EdDSA (Ed25519) is increasingly used for JWT signing, especially in newer OIDC providers and API authentication schemes. Without Ed25519 support, Zuplo cannot verify EdDSA JWTs, forcing customers to use older algorithms (RS256, ES256) or implement workarounds.

## Suggested Fix

Add Ed25519 support to StarlingMonkey's SubtleCrypto implementation. The underlying crypto library (likely BoringSSL or ring) already supports Ed25519 -- it just needs to be wired up through the Web Crypto API surface.
