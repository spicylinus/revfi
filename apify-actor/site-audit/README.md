# Site Audit Actor

An [Apify Actor](https://apify.com/actors) that crawls a small business website — the homepage plus its internal
pages — and produces a comprehensive, plain-English lead-generation audit. It powers the "full report" promised by
[Social Linus siteauditor](https://siteauditor.sociallinus.com/) after a visitor opts in, which the current in-app
audit (`src/lib/audit-engine.ts` in the main revfi repo) does not generate on its own — that engine only inspects
the homepage and one contact page.

## What it checks, per page

- Contact form / phone number presence (lead capture)
- Mobile viewport meta tag
- Page load time
- Page title and meta description (basic SEO)
- Google Maps / Google Business Profile embed
- Images missing `alt` text
- Word count (thin content)
- HTTPS

Across the whole crawl, it also tracks **broken internal links** — something a single-page check can't see.

## Input

| Field | Type | Description |
|---|---|---|
| `url` | string (required) | The website to audit, e.g. `https://example.com` |
| `maxPages` | integer (default 15) | Max number of same-domain pages to crawl |

## Output

- **Dataset**: one row per page crawled, with the fields above (see `.actor/dataset_schema.json`).
- **Key-value store record `OUTPUT`**: the aggregated `FullAuditReport` (see `src/types.ts`) — sitewide findings
  ranked by severity, the primary issue, a recommendation, and a plain-text `summaryText` suitable for emailing
  directly to a lead.

## Quick Start

```bash
apify run          # test locally (reads storage/key_value_stores/default/INPUT.json)
apify login         # authenticate with an Apify account
apify push           # deploy to the Apify platform
```

## Project Structure

```text
.actor/
├── actor.json           # Actor config: name, version, metadata
├── input_schema.json    # Input validation & Console form definition
├── output_schema.json   # Where the Actor's output lives
└── dataset_schema.json  # Structure of the per-page dataset rows
src/
├── main.ts     # Entry point: runs the crawl, generates the report, sets OUTPUT
├── routes.ts   # CheerioCrawler request handler — audits each page, enqueues same-domain links
├── checks.ts   # Per-page audit checks (pure function over a Cheerio document)
├── report.ts   # Aggregates per-page results into sitewide findings + the full report text
└── types.ts    # Shared types
```

## Calling it from revfi

Once deployed (`apify push`) and an `APIFY_TOKEN` is available to the revfi app, it can be run synchronously via the
[Apify API's `run-sync-get-dataset-items`](https://docs.apify.com/api/v2#/reference/actors/run-actor-synchronously-with-input-and-get-dataset-items)
endpoint, or asynchronously via `Actor.call()` / the `apify-client` npm package, passing `{ "url": "...", "maxPages": 15 }`
as input and reading the `OUTPUT` record from the resulting run's key-value store.
