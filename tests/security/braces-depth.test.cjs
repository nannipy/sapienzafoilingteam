const { test } = require('node:test');
const assert = require('node:assert/strict');
const braces = require('braces');

const depthError = /Pattern nesting exceeds maximum depth of 100/;

for (const method of ['parse', 'compile', 'expand', 'stringify']) {
  test(`${method} rejects deeply nested patterns before recursive traversal`, () => {
    for (const [open, close] of [['{', '}'], ['(', ')'], ['{(', ')}']]) {
      const pattern = open.repeat(4000) + 'a,b' + close.repeat(4000);
      // Keep the exploit under the original 10,000 character cap.
      const bounded = open.repeat(2000) + 'a,b' + close.repeat(2000);
      assert.throws(() => braces[method](bounded), depthError);
      assert.throws(() => braces[method](pattern, { maxLength: Infinity }), /maximum depth|exceeds max characters/);
    }
  });
}

for (const method of ['compile', 'expand', 'stringify']) {
  test(`${method} also bounds caller-provided ASTs`, () => {
    let ast = { type: 'root', nodes: [{ type: 'text', value: 'a' }] };
    for (let i = 0; i < 200; i++) ast = { type: 'root', nodes: [ast] };
    assert.throws(() => braces[method](ast), depthError);
  });
}

test('ordinary glob patterns preserve compilation and expansion', () => {
  assert.equal(braces.compile('app/{admin,blog}/**/*.{ts,tsx}'), 'app/(admin|blog)/**/*.(ts|tsx)');
  assert.deepEqual(braces.expand('file-{1..3}.{ts,tsx}'), ['file-1.ts', 'file-1.tsx', 'file-2.ts', 'file-2.tsx', 'file-3.ts', 'file-3.tsx']);
  assert.equal(braces.stringify(braces.parse('a/{b,c}/d')), 'a/{b,c}/d');
  assert.deepEqual(braces.expand('\\{literal\\}'), ['{literal}']);
});
