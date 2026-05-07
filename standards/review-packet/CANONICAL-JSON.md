# Canonical JSON

Review packet JSON must be deterministic so packet hashes, snapshots, and CI
comparisons are stable.

## Rules

- Recursively sort object keys in ascending Unicode code point order.
- Preserve array order exactly as provided.
- Serialize with two-space indentation.
- End every JSON file with exactly one trailing newline.
- Hash the canonical JSON text when hashing structured packet data.
- Use one shared writer for packet JSON instead of ad hoc `JSON.stringify`
  calls.

Readable evidence may use `sha256` content hashes. Secret-like path-only
evidence must not hash secret file contents and must not include snippets or
copied secret values.

## Reference Shape

```javascript
function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = sortValue(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(sortValue(value), null, 2) + "\n";
}
```
