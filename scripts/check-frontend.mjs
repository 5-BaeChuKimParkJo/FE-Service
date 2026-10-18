import fs from 'node:fs';
import path from 'node:path';
import { createRequire, builtinModules } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ts = createRequire(path.resolve('package.json'))('typescript');
const normalize = (file) => path.resolve(file).replaceAll('\\', '/');
const testFile = (file) => /\.(test|spec)\.[cm]?tsx?$/.test(file);
const builtins = new Set(
  builtinModules.map((name) => name.replace(/^node:/, '')),
);

export function checkTrackedPaths(paths) {
  const errors = [];
  const seen = new Set();
  for (const file of paths) {
    if (
      [...file].some((character) => character.charCodeAt(0) < 32) ||
      /[<>:"|?*]/.test(file) ||
      file
        .split('/')
        .some(
          (part) =>
            /[. ]$/.test(part) ||
            /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
        )
    ) {
      errors.push({ file, line: 1, rule: 'portable-tracked-path' });
    }
    if (seen.has(file.toLowerCase()))
      errors.push({ file, line: 1, rule: 'case-collision' });
    seen.add(file.toLowerCase());
  }
  return errors;
}

export function checkFrontend(tsconfigPath, { framework = 'next' } = {}) {
  const vite = framework === 'vite';
  const viteFlags = new Set(['MODE', 'BASE_URL', 'DEV', 'PROD', 'SSR']);
  const configFile = normalize(tsconfigPath);
  const root = path.dirname(configFile);
  const config = ts.readConfigFile(configFile, ts.sys.readFile);
  if (config.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, '\n'),
    );
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  if (parsed.errors.length)
    throw new Error(
      parsed.errors
        .map((e) => ts.flattenDiagnosticMessageText(e.messageText, '\n'))
        .join('\n'),
    );
  const errors = [];
  const graph = new Map();
  const add = (file, line, rule) =>
    errors.push({ file: path.relative(root, file), line, rule });
  const asset = (name, file) => {
    if (!name || !/\.(svg|png|jpe?g|webp|gif|css|scss|json)$/.test(name))
      return null;
    const candidates = name.startsWith('.')
      ? [path.resolve(path.dirname(file), name)]
      : [];
    for (const [alias, targets] of Object.entries(parsed.options.paths || {})) {
      const [prefix, suffix = ''] = alias.split('*');
      if (!name.startsWith(prefix) || !name.endsWith(suffix)) continue;
      const matched = name.slice(
        prefix.length,
        suffix ? -suffix.length : undefined,
      );
      for (const target of targets)
        candidates.push(
          path.resolve(
            parsed.options.baseUrl || root,
            target.replace('*', matched),
          ),
        );
    }
    return candidates.find((candidate) => fs.existsSync(candidate)) || null;
  };
  function module(file) {
    file = normalize(file);
    if (graph.has(file)) return graph.get(file);
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    const result = {
      source,
      client: false,
      action: false,
      imports: [],
      env: [],
      jsx: false,
    };
    graph.set(file, result);
    for (const statement of source.statements) {
      if (
        !ts.isExpressionStatement(statement) ||
        !ts.isStringLiteral(statement.expression)
      )
        break;
      if (statement.expression.text === 'use client') result.client = true;
      if (statement.expression.text === 'use server') result.action = true;
    }
    const edge = (node, expression) => {
      const name =
        expression && ts.isStringLiteralLike(expression)
          ? expression.text
          : null;
      const resolved = name
        ? ts.resolveModuleName(name, file, parsed.options, ts.sys)
            .resolvedModule
        : null;
      const target = resolved?.resolvedFileName || asset(name, file);
      result.imports.push({
        name,
        target: target && normalize(target),
        line:
          source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
      });
    };
    const isEnv = (node) =>
      ts.isPropertyAccessExpression(node) &&
      node.name.text === 'env' &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'process';
    const isViteEnv = (node) =>
      ts.isPropertyAccessExpression(node) &&
      node.name.text === 'env' &&
      ts.isMetaProperty(node.expression) &&
      node.expression.keywordToken === ts.SyntaxKind.ImportKeyword;
    function visit(node) {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        if (
          node.moduleSpecifier &&
          !node.isTypeOnly &&
          !node.importClause?.isTypeOnly
        )
          edge(node, node.moduleSpecifier);
      } else if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) &&
            node.expression.text === 'require'))
      )
        edge(node, node.arguments[0]);
      if (isEnv(node) || isViteEnv(node)) {
        const parent = node.parent;
        const name = ts.isPropertyAccessExpression(parent)
          ? parent.name.text
          : ts.isElementAccessExpression(parent) &&
              ts.isStringLiteralLike(parent.argumentExpression)
            ? parent.argumentExpression.text
            : null;
        const allowed = isViteEnv(node)
          ? vite && name && (name.startsWith('VITE_') || viteFlags.has(name))
          : name === 'NODE_ENV' || (!vite && name?.startsWith('NEXT_PUBLIC_'));
        if (!allowed) {
          result.env.push(
            source.getLineAndCharacterOfPosition(node.getStart(source)).line +
              1,
          );
        }
      }
      if (
        ts.isJsxElement(node) ||
        ts.isJsxSelfClosingElement(node) ||
        ts.isJsxFragment(node)
      )
        result.jsx = true;
      ts.forEachChild(node, visit);
    }
    visit(source);
    return result;
  }
  for (const candidate of parsed.fileNames) {
    const file = normalize(candidate);
    if (!file.includes('/src/') || testFile(file) || file.endsWith('.d.ts'))
      continue;
    const info = module(file);
    const base = path.basename(file, '.tsx');
    const route =
      file.includes('/app/') &&
      [
        'page',
        'layout',
        'loading',
        'error',
        'global-error',
        'not-found',
        'template',
        'default',
      ].includes(base);
    const bootstrap = file.endsWith('/src/main.tsx');
    if (
      file.endsWith('.tsx') &&
      info.jsx &&
      !route &&
      !bootstrap &&
      base !== 'index' &&
      !/^[A-Z][A-Za-z0-9]*$/.test(base)
    ) {
      add(file, 1, 'component-filename');
    }
    if (!vite && !info.client) continue;
    const visited = new Set();
    const walk = (current, originLine) => {
      if (visited.has(current)) return;
      visited.add(current);
      const item = module(current);
      if (!vite && current !== file && item.action) return;
      for (const line of item.env)
        add(file, originLine || line, 'client-private-env');
      for (const dependency of item.imports) {
        const line = originLine || dependency.line;
        const name = dependency.name;
        if (
          !name ||
          (!dependency.target &&
            (name.startsWith('.') || name.startsWith('@/')))
        )
          add(file, line, 'unresolved-client-import');
        if (
          name === 'server-only' ||
          ['next/headers', 'next/server'].includes(name) ||
          name?.startsWith('node:') ||
          builtins.has(name)
        )
          add(file, line, 'client-to-server');
        if (
          dependency.target &&
          !dependency.target.includes('/node_modules/') &&
          !testFile(dependency.target) &&
          /\.[cm]?tsx?$/.test(dependency.target) &&
          !dependency.target.endsWith('.d.ts')
        )
          walk(dependency.target, line);
      }
    };
    walk(file, null);
  }
  return errors;
}

if (
  process.argv[1] &&
  normalize(process.argv[1]) === normalize(fileURLToPath(import.meta.url))
) {
  const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
  const errors = [
    ...checkFrontend(process.argv[2] || 'tsconfig.json', {
      framework: process.argv.includes('--vite') ? 'vite' : 'next',
    }),
    ...checkTrackedPaths(tracked),
  ];
  for (const error of errors)
    console.error(`${error.file}:${error.line} ${error.rule}`);
  if (!errors.length) console.log('Frontend conventions: PASS');
  process.exitCode = errors.length ? 1 : 0;
}
