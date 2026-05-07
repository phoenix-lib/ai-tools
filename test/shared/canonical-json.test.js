const assert = require("node:assert/strict");
const test = require("node:test");
const { canonicalJson, sortValue } = require("../../shared/canonical-json");

test("sortValue recursively sorts object keys and preserves array order", () => {
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

  assert.deepEqual(sortValue(value), {
    a: {
      b: 3,
      y: 2
    },
    list: [
      {
        c: 5,
        d: 4
      }
    ],
    z: 1
  });
});

test("canonicalJson serializes with two spaces and one trailing newline", () => {
  const text = canonicalJson({
    z: true,
    a: {
      c: 3,
      b: 2
    }
  });

  assert.equal(text, '{\n  "a": {\n    "b": 2,\n    "c": 3\n  },\n  "z": true\n}\n');
  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.endsWith("\n\n"), false);
});
