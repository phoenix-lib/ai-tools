const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortValue(value[key]);
        return acc;
      }, {});
  }
  return value;
}

function canonicalJson(value) {
  return `${JSON.stringify(sortValue(value), null, 2)}\n`;
}

const jsonExamples = [
  "standards/review-packet/examples/pass/REVIEW-SUMMARY.json",
  "standards/review-packet/examples/pass/EVIDENCE.json",
  "standards/review-packet/examples/human-review/REVIEW-SUMMARY.json",
  "standards/review-packet/examples/human-review/EVIDENCE.json"
];

test("canonicalJson recursively sorts object keys and preserves array order", () => {
  const value = {
    z: 1,
    a: {
      y: 2,
      b: 3
    },
    list: [
      {
        d: 4,
        c: 5
      }
    ]
  };

  assert.equal(
    canonicalJson(value),
    '{\n  "a": {\n    "b": 3,\n    "y": 2\n  },\n  "list": [\n    {\n      "c": 5,\n      "d": 4\n    }\n  ],\n  "z": 1\n}\n'
  );
});

test("example packet JSON files are canonical", () => {
  for (const relativePath of jsonExamples) {
    const absolutePath = path.join(process.cwd(), relativePath);
    const text = fs.readFileSync(absolutePath, "utf8");
    const parsed = JSON.parse(text);

    assert.equal(text, canonicalJson(parsed), `${relativePath} is not canonical JSON`);
    assert.ok(text.endsWith("\n"), `${relativePath} must end with a trailing newline`);
  }
});
