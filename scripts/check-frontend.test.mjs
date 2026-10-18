import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkFrontend, checkTrackedPaths } from './check-frontend.mjs';

function fixture(files) {
  const root = mkdtempSync(path.join(tmpdir(), 'chalnak-frontend-'));
  writeFileSync(
    path.join(root, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        jsx: 'preserve',
        baseUrl: '.',
        paths: { '@/*': ['src/*'] },
      },
      include: ['src/**/*'],
    }),
  );
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(root, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  try {
    return checkFrontend(path.join(root, 'tsconfig.json'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('rejects a client import of server-only helpers through an alias and barrel', () => {
  const errors = fixture({
    'src/components/Panel.tsx': "'use client'; import { api } from '@/shared';",
    'src/shared/index.ts': "export { api } from '../server';",
    'src/server.ts':
      "import { cookies } from 'next/headers'; export const api = cookies;",
  });
  assert.ok(errors.some((error) => error.rule === 'client-to-server'));
});

test('allows a Next.js server action boundary without walking into its implementation', () => {
  assert.deepEqual(
    fixture({
      'src/components/Panel.tsx':
        "'use client'; import { login } from '../actions';",
      'src/actions.ts':
        "'use server'; import { cookies } from 'next/headers'; export async function login() { return cookies(); }",
    }),
    [],
  );
});

test('rejects private environment access in the client graph but allows public flags', () => {
  assert.ok(
    fixture({
      'src/components/Panel.tsx':
        "'use client'; const secret = process.env.DEMO_MEMBER_PASSWORD;",
    }).some((error) => error.rule === 'client-private-env'),
  );
  assert.deepEqual(
    fixture({
      'src/components/Panel.tsx':
        "'use client'; const flag = process.env.NEXT_PUBLIC_MODE; const mode = process.env.NODE_ENV;",
    }),
    [],
  );
});

test('requires PascalCase component files while preserving Next routes and index entries', () => {
  assert.ok(
    fixture({
      'src/components/panel.tsx': 'export function Panel() { return <div />; }',
    }).some((error) => error.rule === 'component-filename'),
  );
  assert.deepEqual(
    fixture({
      'src/app/page.tsx': 'export default function Page() { return <div />; }',
      'src/components/index.tsx': 'export function Panel() { return <div />; }',
      'src/main.tsx': 'render(<App />);',
    }),
    [],
  );
});

test('rejects variable dynamic imports in the client graph', () => {
  assert.ok(
    fixture({
      'src/components/Panel.tsx':
        "'use client'; const module = import(target);",
    }).some((error) => error.rule === 'unresolved-client-import'),
  );
});

test('resolves existing bundled assets without allowing missing owned modules', () => {
  assert.deepEqual(
    fixture({
      'src/components/Panel.tsx':
        "'use client'; import Icon from '@/assets/icon.svg';",
      'src/assets/icon.svg': '<svg />',
    }),
    [],
  );
  assert.ok(
    fixture({
      'src/components/Panel.tsx':
        "'use client'; import Icon from '@/assets/missing.svg';",
    }).some((error) => error.rule === 'unresolved-client-import'),
  );
});

test('rejects Windows-invalid tracked paths and case collisions', () => {
  assert.ok(checkTrackedPaths(['src/services/\bindex.ts']).length);
  assert.ok(checkTrackedPaths(['src/Button.tsx', 'src/button.tsx']).length);
  assert.deepEqual(checkTrackedPaths(['src/app/(main)/[id]/page.tsx']), []);
});
