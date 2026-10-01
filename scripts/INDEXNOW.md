# Manual IndexNow submission

This site is static GitHub Pages content published from `main`, repository root.
No server, DNS change, client-side script, deployment hook or npm dependency is needed.
The root key file is UTF-8 without a BOM or newline and is copied directly by Pages.

Using Node.js 18 or later, from the project root:

```powershell
node scripts/submit-indexnow.js
```

This read-only dry run validates local and live sitemap membership, live robots,
HTTP 200 without redirects, canonical URLs and noindex directives. It lists the
new/changed URLs without calling IndexNow. Any invalid URL aborts the whole run.

After publishing the key file, check:
https://onlinecalmaster.com/b29d22c720714300a8b5dd23f580be47.txt

Then explicitly submit:

```powershell
node scripts/submit-indexnow.js --submit
```

The utility requires the exact live key before posting. The initial 42 sitemap
URLs fit in one JSON POST to https://api.indexnow.org/indexnow (maximum 10,000 per
batch). Only HTTPS URLs on onlinecalmaster.com are eligible. No visitor triggers
requests. No automatic retries, scheduling or deployment submissions are installed.

Successful HTTP 200/202 batches are recorded by content hash in
`~/.onlinecalmaster-indexnow/submitted.json`, outside this repository. Reuse the
same operator machine/state to skip unchanged URLs. Do not delete this state to
resubmit unchanged content. A lock prevents simultaneous submissions; after a
crash, review the previous outcome before removing a stale lock. A timeout may
have reached IndexNow, so inspect the outcome before manually retrying.

HTTP 202 means key validation is pending; HTTP 200 means received. Neither
guarantees indexing. This utility deliberately does not submit removed URLs.

Protocol: https://www.indexnow.org/documentation
