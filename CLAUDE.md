# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14+ dashboard application that monitors and tracks Google Cloud AI (Gemini API) and Supabase usage with budget alerts and cost projections. The app uses TypeScript, Tailwind CSS v4, shadcn/ui components with the doom-64 theme, and Recharts for visualizations.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Architecture Overview

### Data Flow Pattern

The application follows a **server-side API proxy pattern** to protect sensitive credentials:

1. **Client Components** (`components/google-cloud-dashboard.tsx`, `components/supabase-dashboard.tsx`) fetch data via browser fetch()
2. **API Routes** (`app/api/*/usage/route.ts`) act as secure proxies
3. **Library Functions** (`lib/google-cloud.ts`, `lib/supabase.ts`) contain actual API logic with credentials
4. **Type Definitions** (`types/index.ts`) ensure type safety across all layers

**Critical**: Never expose API keys or service credentials in client-side code. All authentication happens server-side in the `/lib` directory.

### Key Architectural Decisions

#### 1. Google Cloud Metrics Collection
- Uses `@google-cloud/monitoring` SDK with service account credentials stored as JSON in environment variables
- Fetches from `aiplatform.googleapis.com/prediction/online/response_count` metric
- Aggregates data with 1-hour intervals using `ALIGN_RATE` aligner
- Token counts are **estimates** based on `AVG_TOKENS_PER_REQUEST` constant (lib/google-cloud.ts:67)
- Cost calculations use configurable pricing constants (lib/google-cloud.ts:65-66)

#### 2. Supabase Metrics Collection
- Uses Supabase Admin API with service role key
- Database size is **estimated** (10MB per table approximation in lib/supabase.ts:51)
- Bandwidth and API requests return 0 as they require custom tracking implementation
- Free tier limits are defined in `FREE_TIER_LIMITS` object (lib/supabase.ts:42-48)

#### 3. Budget Projection Algorithm
- Located in lib/google-cloud.ts:110-114
- Calculates daily average based on selected time range
- Projects monthly cost by multiplying daily average by 30 days
- Compares against `MONTHLY_BUDGET_USD` environment variable

### Component Structure

- **Main Page** (app/page.tsx): Tab-based layout using shadcn/ui Tabs component
- **Dashboard Components**: Client-side React components that manage state and fetch data
- **UI Components** (components/ui/): shadcn/ui primitives (Button, Card, Select, Tabs, etc.)
- **Error Boundaries**: Wrap dashboard components for graceful error handling

## Environment Variables

Required variables (never commit to version control):

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}  # Minified JSON
GOOGLE_CLOUD_REGION=us-central1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only!

# Budget
MONTHLY_BUDGET_USD=100
```

See `env.example.txt` for template.

## Common Development Tasks

### Adding a New Metric to Google Cloud Dashboard

1. Update `GeminiUsageMetrics` type in types/index.ts
2. Modify `getGeminiUsageMetrics()` in lib/google-cloud.ts to fetch/calculate the metric
3. Update API response in app/api/google-cloud/usage/route.ts (usually automatic)
4. Add UI display in components/google-cloud-dashboard.tsx

### Adjusting Pricing or Budget

- **Gemini API pricing**: Edit constants in lib/google-cloud.ts:65-67
- **Monthly budget**: Change `MONTHLY_BUDGET_USD` in .env.local (restart server)
- **Supabase tier limits**: Edit `FREE_TIER_LIMITS` in lib/supabase.ts:42-48

### Adding a New shadcn/ui Component

```bash
npx shadcn@latest add [component-name]
```

### Changing the Theme

```bash
npx shadcn@latest add https://tweakcn.com/r/themes/[theme-name].json
```

Current theme: doom-64 (retro gaming aesthetic with dark mode)

## Code Style Requirements

- Use TypeScript strict mode (enabled)
- Prefer async/await over Promise chains
- Use Tailwind utility classes over custom CSS
- Keep components focused and single-purpose
- Server-side API calls must use try/catch with fallback data
- All client-side data fetching should handle loading and error states

## Important Notes

### Google Cloud Monitoring API
- Metrics have 5-10 minute delay
- Historical data populates gradually after first API calls
- The metric filter (`aiplatform.googleapis.com/prediction/online/response_count`) may need adjustment based on specific services used
- Service account needs **Monitoring Viewer** and **Service Usage Consumer** roles

### Supabase Metrics Accuracy
- Database size is a rough estimate (10MB × table count)
- Bandwidth and API requests currently return 0 (require custom tracking)
- For production accuracy, implement custom tracking or use Supabase's built-in analytics

### Security Considerations
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - never expose client-side
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` must be minified (no line breaks)
- All sensitive operations happen in API routes or lib/ files
- Public environment variables (NEXT_PUBLIC_*) are safe for client-side use

### Tailwind CSS v4
- This project uses Tailwind CSS v4, which has different configuration from v3
- Configuration is in `app/globals.css` using `@theme` directive
- PostCSS configuration is handled by `@tailwindcss/postcss`

### Recharts Compatibility Workarounds (IMPORTANT)
**Date Added**: November 2024  
**Issue**: Recharts v3.5.0 has compatibility issues with React 19 and Next.js 15 SSR

**What We Encountered**:
- Runtime errors: "a[d] is not a function" when charts tried to render during SSR
- Build errors with dynamic imports using Next.js `dynamic()` function
- Font preload warnings (non-critical but annoying)

**Workarounds Implemented**:
All chart components in `components/charts/` use client-side only rendering:
1. **Line Chart** (`line-chart-wrapper.tsx`): Uses `useEffect` + dynamic `import()` to load Recharts only on client
2. **Bar Charts** (`bar-chart-wrapper.tsx`, `supabase-bar-chart-wrapper.tsx`): Same pattern - client-side loading with loading states

**Why This Works**:
- Prevents Recharts from executing during server-side rendering
- Ensures all chart components are fully loaded before rendering
- Shows loading states while components initialize

**Files Using This Pattern**:
- `components/charts/line-chart-wrapper.tsx`
- `components/charts/bar-chart-wrapper.tsx`
- `components/charts/supabase-bar-chart-wrapper.tsx`

**Future Considerations**:
- Monitor Recharts releases for React 19 compatibility updates
- If issues persist, consider alternatives: Chart.js, Victory, or native SVG solutions
- The current workaround is stable and follows React best practices for client-only components

**If You See Chart Errors**:
1. Clear `.next` directory: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check that all chart wrappers use the `useEffect` + dynamic import pattern
4. Verify `'use client'` directive is at the top of chart wrapper files

## Testing Checklist

Before committing or deploying:
- Run `npm run build` to ensure TypeScript compilation succeeds
- Run `npm run lint` to check for ESLint errors
- Verify all environment variables are set correctly
- Test with actual API usage (not just mock data)
- Check browser console for errors
- Test budget alert functionality by adjusting `MONTHLY_BUDGET_USD` temporarily

## Troubleshooting

### "Google Cloud credentials not configured" Error
- Check that `GOOGLE_APPLICATION_CREDENTIALS_JSON` is valid JSON
- Ensure JSON is minified (single line, no line breaks)
- Verify `GOOGLE_CLOUD_PROJECT_ID` matches service account project

### Empty Charts or Zero Metrics
- Ensure you've made actual Gemini API calls (metrics only appear after usage)
- Wait 10-15 minutes for Google Cloud Monitoring to populate data
- Check metric filter in lib/google-cloud.ts:38 matches your service

### Supabase Metrics Not Loading
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not anon key)
- Check that service role key has admin permissions
- Ensure Supabase project URL is correct

### Build Failures
- Clear `.next` directory: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`
