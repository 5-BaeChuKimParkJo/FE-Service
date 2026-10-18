# Contributing

Use `type(scope): imperative subject`, no gitmoji, maximum 100 characters.
Install the shared hook: `python scripts/install_git_hooks.py` (Python 3.10+).
Test it: `python -m unittest discover -s scripts -p test_check_conventions.py`.
The authoritative rule set and fixtures are in `.conventions/`; GitOps holds
the full engineering guide in `docs/engineering/conventions.md`.

Keep React component filenames PascalCase, hooks useX and utility names camelCase.
Preserve Next.js route groups, server-only credential boundaries and API wire
contracts. Run unit tests, typecheck, lint and production build before release.
Never commit .env files, credentials or generated build output.

`pnpm test:conventions` tests the TypeScript-resolved boundary checker and
`pnpm check:conventions` checks real code and portable tracked paths.
Client graphs must not reach private environment values, Node/server APIs or
server-only helpers. Next.js `use server` action modules are explicit RPC
boundaries and remain importable from clients. Public `NEXT_PUBLIC_*` flags and
`NODE_ENV` are permitted. Existing asset files are resolved, not blindly ignored.

Owned JSX components use PascalCase filenames. Next.js route files, index entries
and Vite's main bootstrap keep framework names. UI file imports use exact case.
The former control-character services index now has a portable name with its
original Git blob preserved; a sparse-checkout workaround is no longer needed.
