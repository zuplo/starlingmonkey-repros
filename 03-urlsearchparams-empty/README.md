# Repro 3: URLSearchParams.get() returns null for empty values

## Bug

`URLSearchParams.get("key")` returns `null` when the URL contains `?key=` (key present with an empty value). It should return an empty string `""`.

## Expected Behavior (per web spec)

Per the URL spec (https://url.spec.whatwg.org/#dom-urlsearchparams-get):

- `?key=` means key is present with value `""` (empty string)
- `get("key")` should return `""`
- `has("key")` should return `true`
- Only when the key is completely absent should `get()` return `null`

```
URL: http://example.com/?key=
searchParams.get("key") => ""     // empty string
searchParams.has("key") => true

URL: http://example.com/
searchParams.get("key") => null   // key not present
searchParams.has("key") => false
```

## Actual Behavior (StarlingMonkey/Spin)

```
URL: http://example.com/?key=
searchParams.get("key") => null   // BUG: should be ""
searchParams.has("key") => true   // correctly reports key exists
```

## Test

```bash
curl "http://localhost:3000/?key="
curl "http://localhost:3000/?key=value"
curl "http://localhost:3000/"
```

## Impact on Zuplo

Form submissions and API calls commonly send empty values (e.g., clearing a field). Code that checks `if (value === null)` to detect "parameter not provided" vs "parameter provided but empty" will break. This affects any middleware that processes query parameters.

## Suggested Fix

Fix the URLSearchParams parsing in StarlingMonkey to correctly handle the `key=` case (key followed by `=` with no value after it). The value should be set to `""` rather than being treated as absent.
