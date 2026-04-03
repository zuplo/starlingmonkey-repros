# Repro 4: Request.formData() drops empty fields

## Bug

When parsing a URL-encoded POST body, fields with empty values (e.g., `empty=`) are silently dropped from the resulting FormData object.

## Expected Behavior (per web spec)

Per the URL-encoded form parsing spec (https://url.spec.whatwg.org/#concept-urlencoded-parser):

- Input: `name=hello&empty=`
- Expected FormData entries: `{ name: "hello", empty: "" }`
- `fd.has("empty")` should return `true`
- `fd.get("empty")` should return `""`

## Actual Behavior (StarlingMonkey/Spin)

- Input: `name=hello&empty=`
- Actual FormData entries: `{ name: "hello" }` (empty field dropped)
- `fd.has("empty")` returns `false`
- `fd.get("empty")` returns `null`

## Test

```bash
# GET shows usage instructions
curl http://localhost:3000/

# POST with an empty field
curl -X POST -d "name=hello&empty=" http://localhost:3000/
```

## Impact on Zuplo

HTML forms commonly submit empty fields (unchecked checkboxes, cleared text inputs). APIs also use empty values to indicate "clear this field." Dropping empty fields changes the semantics of the request and can cause data loss or incorrect behavior in downstream services.

## Suggested Fix

This is likely the same root cause as Repro 3 (URLSearchParams empty value handling). The URL-encoded body parser should preserve fields where the value portion is an empty string.
