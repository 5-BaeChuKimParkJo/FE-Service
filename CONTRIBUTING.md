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
