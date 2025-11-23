# Deployment Guide

This guide covers deploying your AI Usage Dashboard to popular hosting platforms.

## Prerequisites

Before deploying:
- ✅ Test locally with `npm run dev`
- ✅ Ensure all environment variables are configured
- ✅ Run `npm run build` to check for build errors
- ✅ Commit your code to a Git repository (GitHub, GitLab, etc.)

## Vercel (Recommended)

Vercel is the easiest option as it's made by the Next.js team.

### Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables when asked.

### Deploy via Vercel Dashboard

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   - Go to "Settings" → "Environment Variables"
   - Add all variables from your `.env.local` file
   - Make sure to add them for Production, Preview, and Development
6. Click "Deploy"

## Railway

Railway is great for full-stack apps with databases.

1. Go to https://railway.app/
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variables:
   - Click on your service
   - Go to "Variables" tab
   - Add each variable from `.env.local`
6. Railway will automatically deploy

## Netlify

1. Go to https://netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider and repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click "Show advanced" → "New variable"
6. Add all environment variables from `.env.local`
7. Click "Deploy"

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build (non-sensitive only)
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build
docker build -t usage-dashboard .

# Run (add your environment variables)
docker run -p 3000:3000 \
  -e GOOGLE_CLOUD_PROJECT_ID="your-project" \
  -e GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}' \
  -e NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key" \
  -e SUPABASE_SERVICE_ROLE_KEY="your-key" \
  -e MONTHLY_BUDGET_USD="100" \
  usage-dashboard
```

## Environment Variables Checklist

Make sure all these variables are set in your production environment:

```
✅ GOOGLE_CLOUD_PROJECT_ID
✅ GOOGLE_APPLICATION_CREDENTIALS_JSON
✅ GOOGLE_CLOUD_REGION
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ MONTHLY_BUDGET_USD
```

## Post-Deployment

### 1. Verify Deployment

- Visit your deployed URL
- Check both Google Cloud and Supabase tabs
- Verify charts load without errors
- Test time range switching

### 2. Set Up Monitoring

- Configure uptime monitoring (UptimeRobot, Better Stack, etc.)
- Set up error tracking (Sentry, LogRocket, etc.)
- Enable Vercel Analytics (if using Vercel)

### 3. Security

- [ ] Verify service role keys are not exposed in client-side code
- [ ] Check that API routes are working correctly
- [ ] Test that unauthorized requests are blocked
- [ ] Enable rate limiting if needed
- [ ] Set up CORS if required

### 4. Performance

- Run Lighthouse audit
- Enable caching headers
- Consider adding a CDN for static assets
- Optimize images if you add any

## Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records as shown

### Railway

1. Go to Settings → Domains
2. Add custom domain
3. Point your DNS to Railway

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Loading

- Ensure variables are set in the platform's dashboard
- Check for typos in variable names
- Verify JSON values are properly escaped
- Restart the deployment after adding variables

### API Routes Return 500 Errors

- Check server logs in your platform's dashboard
- Verify Google Cloud credentials are valid
- Ensure Supabase keys are correct
- Check that required APIs are enabled

### Metrics Not Showing

- May take 5-10 minutes after deployment
- Ensure you've made API calls to generate metrics
- Check Google Cloud Monitoring is enabled
- Verify service account permissions

## Cost Considerations

Most platforms offer free tiers:

- **Vercel**: Free for personal projects (commercial use requires Pro)
- **Railway**: $5/month credit on Hobby plan
- **Netlify**: 100GB bandwidth/month free
- **Docker (Self-hosted)**: Server costs only

## Continuous Deployment

Most platforms support automatic deployments:

1. Push to main/master branch → Auto-deploy to production
2. Push to other branches → Deploy to preview URLs
3. Pull requests → Generate preview deployments

Configure branch deployment rules in your platform's dashboard.

## Backup and Rollback

### Vercel
- Automatic backups of all deployments
- Instant rollback from Deployments page

### Railway
- Automatic deployment history
- Roll back from Deployments tab

### Netlify
- Every deploy is saved
- One-click rollback from Deploys page

## Support

- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app/
- **Netlify**: https://docs.netlify.com/
- **Docker**: https://docs.docker.com/

