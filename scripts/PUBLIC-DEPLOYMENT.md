# Filtered public publishing

The current branch-root Pages publisher uploads tracked files directly because `.nojekyll` is present. `.gitignore` is not a deployment filter; `_config.yml` exclusions do not run in this mode.

`node scripts/build-public-site.js` creates a fresh `_site` directory containing only sitemap pages, required runtime assets, the existing GST alias, domain/verification files and license. It copies bytes without processing HTML. Existing output is never deleted or overwritten; use a fresh output path for repeated local checks.

Tests, build source, raw article templates, Markdown/CSV reports, AGENTS.md and workstation paths are excluded from the artifact. This does not make source private in a public Git repository or erase Git history.

## Before any approved future publication

1. Review and approve the publishing-source transition. Do not push governance reports while the old root publisher remains active.
2. In repository Settings → Pages → Build and deployment, change Source from branch publication to **GitHub Actions**. Preserve the custom domain and HTTPS settings. This account change has NOT been made locally.
3. Commit/push only the approved changes after that transition, then manually run **Publish reviewed public artifact** on `main`. The workflow has no push trigger and does not deploy other branches.
4. Verify the artifact and live 62 sitemap URLs, 42 calculators, ads.txt and integrations. Confirm `/tests/etsy-fee.browser.cjs`, `/tests/roof-pitch.browser.cjs`, `/AGENTS.md` and audit report URLs return 404 from direct HTTP requests.
5. Do not claim exclusions are live until the filtered deployment has succeeded. Existing browser/offline caches and Git history are separate from public hosting.

Browser tests resolve `PLAYWRIGHT_MODULE` when explicitly configured, otherwise the installed `playwright` package. Supply the environment variable or install it in your normal test environment; no workstation path is stored in source.

Official reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
