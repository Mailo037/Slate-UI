#!/usr/bin/env node
// design-sync input stage for Slate UI (cfg.buildCmd).
//
// The kit has no build step, and its package.json only declares types under
// exports["./react"], so the converter (which reads top-level `module`/`types`)
// cannot find the React adapter's .d.ts. This mirrors exactly the files npm
// would publish (package.json `files`) into .ds-sync/slate-ui/ and adds
// top-level `module`/`types` pointing at the ./react subpath. Nothing is
// transformed; the repo's own package.json is left untouched.
//
// Usage: node .design-sync/stage-package.mjs
// The output path is fixed (it is wiped before every run), never user-supplied.

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(repo, '.ds-sync', 'slate-ui');
const pkg = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'));
const sub = pkg.exports?.['./react'];
if (!sub?.import || !sub?.types) {
  console.error('stage-package: package.json exports["./react"] needs `import` and `types`');
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of pkg.files ?? []) {
  const from = join(repo, f);
  if (!existsSync(from)) { console.error(`stage-package: missing ${f}`); process.exit(1); }
  cpSync(from, join(out, f), { recursive: true });
}
writeFileSync(join(out, 'package.json'), JSON.stringify({
  ...pkg,
  module: sub.import,
  types: sub.types,
}, null, 2) + '\n');
console.error(`stage-package: ${pkg.name}@${pkg.version} -> ${out} (module ${sub.import}, types ${sub.types})`);
