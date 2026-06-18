# Deployment Guide for Social Linus on Vercel

This project is now configured to run on Vercel using the standard Next.js build pipeline.

## Standard Vercel Deployment

1. **GitHub Integration**: Connect your Vercel project to the `spicylinus/revfi` repository.
2. **Framework Preset**: Select `Next.js`.
3. **Build Command**: `next build` (standard).
4. **Output Directory**: `.next` (standard).

## Local Development

Run the development server:
```bash
npm run dev
```

## Build Verification

To verify the build locally:
```bash
npm run build
```

## Configuration Files

- `next.config.ts`: Standard Next.js configuration.
- `.vercelignore`: Excludes legacy Cloudflare and OpenNext files from the Vercel build context.

## Troubleshooting

If you encounter issues with Stripe initialization during build, ensure that Stripe is instantiated lazily or only when the environment variables are present. The current codebase uses a lazy initialization pattern to avoid build-time errors.
