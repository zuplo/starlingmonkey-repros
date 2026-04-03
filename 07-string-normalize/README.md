# Repro 7: String.prototype.normalize missing

## Bug

`String.prototype.normalize()` is either not a function or throws an error. This prevents Unicode normalization (NFC, NFD, NFKC, NFKD).

## Expected Behavior (per web spec / ECMAScript)

`String.prototype.normalize()` is part of the ECMAScript 2015 (ES6) specification. It should support four normalization forms:

- `NFC` -- Canonical Decomposition, followed by Canonical Composition
- `NFD` -- Canonical Decomposition
- `NFKC` -- Compatibility Decomposition, followed by Canonical Composition
- `NFKD` -- Compatibility Decomposition

Key behavior:
```javascript
"caf\u00e9".normalize("NFC") === "cafe\u0301".normalize("NFC") // true
"\uFB01".normalize("NFKC") === "fi" // true (ligature decomposed)
```

## Actual Behavior (StarlingMonkey/Spin)

`String.prototype.normalize` is `undefined` or calling it throws:
```
TypeError: str.normalize is not a function
```

This is likely because StarlingMonkey's SpiderMonkey build was compiled without ICU/intl support to reduce binary size.

## Test

```bash
curl http://localhost:3000/
```

Returns JSON showing whether normalize exists and which forms work.

## Impact on Zuplo

Unicode normalization is required for:
- Comparing user input (usernames, emails) in a canonical form
- Security: preventing homograph attacks
- Database consistency (ensuring equivalent Unicode representations match)
- JWT claim comparison when claims contain non-ASCII characters

Many libraries call `.normalize()` internally (e.g., for string comparison, hashing).

## Suggested Fix

Enable ICU support in the SpiderMonkey build used by StarlingMonkey, or implement `String.prototype.normalize()` using a standalone Unicode normalization library (e.g., utf8proc) without requiring full ICU.
