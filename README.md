# Social Linus — Local Business Website Auditor

Social Linus is a no-nonsense website auditor built for small business owners to identify "revenue leaks" and provide an actionable growth plan.

## Features

- **Live Website Audit**: Uses Playwright and Cheerio to crawl and analyze SEO, Lead Capture, Local SEO, and Mobile signals.
- **Online Visibility Grade**: Animated letter grade and numeric score.
- **Revenue Leak Identification**: Identifies specific issues and estimates yearly revenue impact.
- **Interactive Checklist**: Prioritized tasks with completion tracking and "Top Lever" highlighting.
- **30-Day Action Plan**: Managed timeline with Daily, Weekly, and Monthly tasks.
- **Revenue Gap Analysis**: Users can set revenue goals and see how fixing leaks helps bridge the gap.
- **High-Ticket Upsells**: Direct paths to Website Redesign, SEO, and Lead Gen services.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes.
- **Analysis Engine**: Playwright (browser automation), Cheerio (HTML parsing).

## Architecture

- `src/app/page.tsx`: Main dashboard and audit lifecycle.
- `src/lib/audit-engine.ts`: Core analysis logic and scoring.
- `src/app/api/audit/route.ts`: API endpoint for triggering audits.
- `src/components/dashboard/`: Reusable dashboard components (GradeGauge, MetricCard, RevenueLeakItem, etc.).

## Development

```bash
cd /home/team/shared/frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Audit Engine Logic

The engine performs a two-page crawl (Homepage + Contact Page) to maximize data collection for lead capture and local SEO signals. It handles timeouts gracefully and provides warnings for unreachable pages.
