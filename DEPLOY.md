# Deployment Guide for RevFi on Cloudflare Pages

This project uses Next.js 16 with the `@opennextjs/cloudflare` adapter to run on Cloudflare Pages.

## local Build and Deploy
If you are deploying from your local machine (or CI):

1. **Build the project:**
   ```bash
   npm run build
   ```
   This runs `opennextjs-cloudflare build`, which generates the worker and assets in the `.open-next` directory.

2. **Deploy to Cloudflare Pages:**
   ```bash
   npx wrangler pages deploy .open-next/assets
   ```
   *Note: OpenNext handles the worker binding automatically if configured correctly in `wrangler.jsonc`.*

## GitHub Integration (Automatic Deploy)
If you are using the Cloudflare Pages GitHub integration:

1. **Framework Preset:** Choose `None` or `Next.js` (but you'll override the settings).
2. **Build Command:** `npm run build`
3. **Build Output Directory:** `.open-next/assets`
4. **Environment Variables:**
   - `NODE_VERSION`: `20` (or higher)
   - `NEXT_TELEMETRY_DISABLED`: `1`

## Troubleshooting
- **Error: `cd src && npm install`**: This was caused by an incorrect `vercel.json` file in the repository root. It has been removed.
- **API Routes not working**: Ensure `wrangler.jsonc` is present and correctly configured with `nodejs_compat` compatibility flag.
