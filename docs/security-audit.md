# Dependency Security Audit

Date: 2026-10-20. Baseline: `9914e61`, clean checkout. Package manager:
`pnpm@10.34.6`. Counts below are registry-reported vulnerability findings,
including separate affected version paths, rather than unique CVEs. The baseline
full audit contained 94 advisory records and 98 findings. Both audit commands
return exit code 1 while unresolved findings remain.

| Scope      | State  | Low | Moderate | High | Critical | Total |
| ---------- | ------ | --: | -------: | ---: | -------: | ----: |
| Full       | Before |   7 |       29 |   59 |        3 |    98 |
| Full       | After  |   1 |        2 |    3 |        1 |     7 |
| Production | Before |   1 |        4 |    5 |        1 |    11 |
| Production | After  |   0 |        0 |    0 |        1 |     1 |

## Compatible Remediation

- Updated `next` and `eslint-config-next` together from 15.5.26 to 15.5.27.
  The [SSG/ISR cache advisory](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676)
  describes self-hosted Pages Router applications. This repository uses `src/app`
  and has no Pages Router directory, reducing the demonstrated exposure.
  The [related catch-all route advisory](https://github.com/vercel/next.js/security/advisories/GHSA-mcj8-r9mp-w47p)
  is also removed from the registry audit by this patch.
- Added the exact-parent override `next@15.5.27>postcss: 8.5.23` because Next's
  published manifest still pins vulnerable PostCSS 8.4.31 exactly. The override
  retains PostCSS major 8 and is covered by the production build and browser suite.
  Reassess it when a later compatible Next patch updates the upstream pin.
- Refreshed only audit-identified transitive package names within their parent
  ranges. Notable resolved versions are Babel core 7.29.7, Browserslist 4.29.4,
  source-map-js 1.2.2, build-tool PostCSS 8.5.31, and tar 7.5.22.
- Updated ESLint within major 9 to 9.39.5 to remove its vulnerable plugin-kit
  branch without forcing a 0.x dependency across its parent's accepted range.
- Removed the stale tracked `package-lock.json`. Docker's build and production
  install stages and `.github/workflows/CI.yaml` all use pnpm with frozen locks;
  a repository-wide reference search found no npm install consumer. Maintain
  `pnpm-lock.yaml` as the single dependency lock, rather than regenerating two
  divergent package graphs.

## Reachability and Remaining Findings

`pnpm audit --prod` describes installed production dependencies, not proof that
each package handles remote requests. Next serves requests; its PostCSS,
source-map-js and styled-jsx/Babel/Browserslist branches primarily transform
trusted project sources. Build-time dependencies also matter because CI compiles
the application and processes repository assets. The full audit additionally
covers linting, SVG/CSS compilation, tests and developer commit tooling. The
former critical tar and proxy-addr branches are no longer reported.

| Remaining path                                                             | Findings           | Reason retained                                                                  |
| -------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| `swiper@11.2.8`                                                            | 1 critical         | Fix requires major 12; explicit user approval is pending.                        |
| `commitizen > lodash@4.17.21`                                              | 1 high, 2 moderate | Commitizen pins this exact version; outside the compatible parent-range refresh. |
| `commitizen > inquirer > external-editor > tmp@0.0.33`                     | 1 high, 1 low      | Parent range is `^0.0.33`; patched `>=0.2.6` is outside it.                      |
| `commitizen > find-node-modules > findup-sync > micromatch > braces@3.0.3` | 1 high             | Registry advisory currently reports no patched version.                          |

Swiper is actively imported by
`src/components/ui/date-time-picker/PickerColumn.tsx`. The
[maintainer's prototype-pollution advisory](https://github.com/nolimits4web/swiper/security/advisories/GHSA-hmx5-qpq5-p643)
identifies 12.1.2 as patched. Its demonstration combines crafted options with an
`Array.prototype.indexOf` replacement. The current picker constructs its own
Swiper props; no attacker-controlled options object or `extendDefaults` call was
found in application code. This lowers observed reachability but does not remove
the vulnerable dependency or its critical audit result. Swiper remains unchanged
until approval for the major upgrade and picker validation arrives.

The six Commitizen findings are development-only and absent from the production
audit. Relevant registry advisories are
[Lodash](https://github.com/advisories/GHSA-r5fr-rjxr-66jc),
[tmp](https://github.com/advisories/GHSA-ph9p-34f9-6g65), and
[braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

## Reproduction and Validation

Run from the repository root:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm audit --json
pnpm audit --prod --json
pnpm test
pnpm test:conventions
pnpm check:conventions
python -m unittest discover -s scripts -p test_check_conventions.py
pnpm typecheck
pnpm lint
$env:API_URL = 'http://127.0.0.1:34421'
$env:COOKIE_SECURE = 'false'
$env:NEXT_TELEMETRY_DISABLED = '1'
pnpm build
pnpm exec next start --hostname 127.0.0.1 --port 3507
```

With that local server running, use a separate shell:

```powershell
$env:E2E_BASE_URL = 'http://127.0.0.1:3507'
$env:POPULAR_MOCK_API_PORT = '34421'
pnpm exec playwright test e2e/popular-auctions.spec.ts --workers=1 --reporter=line
```

Local validation uses Node 25.8.2. Docker targets Node 22; the existing CI must
also install, test and build normally before publishing an image. Unit tests: 77 passed;
frontend convention tests: 11 passed; shared Python convention tests: 11 passed;
convention scan, typecheck, lint and production build: passed. Existing mock
popular-ranking E2E: 12 passed, covering desktop and mobile. The temporary test
server was stopped. No application source files were changed.
