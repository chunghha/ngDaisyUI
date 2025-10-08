#!/usr/bin/env node
/**
 * Script: check-no-test-filenames.mjs
 *
 * Purpose:
 *   Enforces the convention that unit / component tests must use the `.spec.ts`
 *   suffix (not `.test.ts`). Exits with a non‑zero status if any legacy
 *   `*.test.ts` files are found.
 *
 * Usage:
 *   node scripts/check-no-test-filenames.mjs
 *   node scripts/check-no-test-filenames.mjs --quiet
 *
 * Integration (package.json suggestion):
 *   "scripts": {
 *     "pretest": "node scripts/check-no-test-filenames.mjs"
 *   }
 *
 * Rationale:
 *   Keeps naming consistent with Angular ecosystem expectations and avoids
 *   accidental divergence or partial migrations.
 */

import { readdir, stat } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import process from 'node:process';

const ROOT = resolve(process.cwd());
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  '.angular',
  '.vite',
]);

const QUIET = process.argv.includes('--quiet');

async function findTestFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // skip hidden
    if (SKIP_DIRS.has(entry.name)) continue;

    const fullPath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      found.push(...(await findTestFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      found.push(fullPath);
    }
  }

  return found;
}

async function main() {
  try {
    // Sanity check root exists
    await stat(ROOT);

    const testFiles = await findTestFiles(ROOT);

    if (testFiles.length === 0) {
      if (!QUIET) {
        console.log('✅ No *.test.ts files found. Naming convention enforced.');
      }
      return;
    }

    console.error('\n❌ Found disallowed *.test.ts file(s):\n');
    for (const file of testFiles) {
      console.error('  -', relative(ROOT, file));
    }

    console.error(`
Rename these to the ".spec.ts" suffix. Example:
  git mv path/example.test.ts path/example.spec.ts

Then re-run the command.
`);

    process.exitCode = 1;
  } catch (err) {
    console.error('🚨 Error while checking for *.test.ts files:', err instanceof Error ? err.message : err);
    process.exitCode = 2;
  }
}

main();
