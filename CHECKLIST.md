# ✅ Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📦 Initial Setup

- [ ] `npm install` completed successfully
- [ ] `.env.local` file created
- [ ] All environment variables added (see below)
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts successfully

## 🔑 Environment Variables

### Google Cloud
- [ ] `GOOGLE_CLOUD_PROJECT_ID` - Your GCP project ID
- [ ] `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Service account JSON (minified)
- [ ] `GOOGLE_CLOUD_REGION` - Default: `us-central1`

### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

### Budget
- [ ] `MONTHLY_BUDGET_USD` - Your monthly budget (e.g., 100)

## 🔧 Google Cloud Configuration

- [ ] Google Cloud project created
- [ ] Service account created
- [ ] Service account has "Monitoring Viewer" role
- [ ] Service account JSON key downloaded
- [ ] JSON key minified (no line breaks)
- [ ] Cloud Monitoring API enabled
- [ ] Vertex AI API enabled
- [ ] Made at least 1 Gemini API call (to generate metrics)

## 🗄️ Supabase Configuration

- [ ] Supabase project created
- [ ] Project URL copied from Settings > API
- [ ] Anon key copied from Settings > API
- [ ] Service role key copied from Settings > API
- [ ] Database has at least one table (for metrics)

## 🖥️ Development Test

- [ ] Dashboard loads at http://localhost:3000
- [ ] No console errors in browser
- [ ] Both tabs visible: "Google Cloud" and "Supabase"
- [ ] Google Cloud tab shows metric cards
- [ ] Supabase tab shows usage cards
- [ ] Time range selector works (24h, 7d, 30d)
- [ ] Charts render without errors
- [ ] Budget projection displays correctly

## 📊 Verify Metrics

### Google Cloud
- [ ] Total Cost displays (may be $0 if no usage)
- [ ] API Requests count appears
- [ ] Total Tokens shows
- [ ] Monthly Projection calculates
- [ ] Charts appear (may be empty if no usage yet)

### Supabase
- [ ] Database size shows
- [ ] Bandwidth metric displays
- [ ] Storage usage appears
- [ ] Auth users count shows
- [ ] API requests metric visible
- [ ] Usage overview chart renders
- [ ] Status badges show (Healthy/Warning/Critical)

## 🎨 UI/UX Check

- [ ] doom-64 theme applied (dark mode)
- [ ] Fonts loading correctly (Oxanium, Source Code Pro)
- [ ] Cards have proper spacing
- [ ] Charts are interactive (hover effects)
- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768px - 1024px)
- [ ] Responsive on desktop (> 1024px)

## ⚠️ Error Handling

- [ ] Error boundaries catch component errors
- [ ] API errors show user-friendly messages
- [ ] Loading states appear while fetching
- [ ] "Try Again" buttons work
- [ ] No sensitive data in error messages

## 🚨 Budget Alerts

- [ ] Budget limit set in `.env.local`
- [ ] Budget progress bar appears in Google Cloud tab
- [ ] Budget percentage calculates correctly
- [ ] Alert banner shows when over budget (test by setting low budget)
- [ ] Color coding works (green < 80%, yellow 80-100%, red > 100%)

## 🔒 Security Verification

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys visible in browser DevTools
- [ ] API routes work (test in Network tab)
- [ ] Service role key not exposed to client
- [ ] GOOGLE_APPLICATION_CREDENTIALS_JSON not in client bundle

## 📱 Browser Compatibility

Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browser

## 🚀 Production Readiness

- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint warnings/errors
- [ ] All environment variables documented
- [ ] README.md reviewed
- [ ] Choose hosting platform (Vercel, Railway, Netlify, etc.)

## 📖 Documentation Review

- [ ] Read `QUICKSTART.md`
- [ ] Reviewed `README.md`
- [ ] Checked `SETUP.md` for details
- [ ] Understand `FEATURES.md`
- [ ] Know where to find `DEPLOYMENT.md`

## 🎯 Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure email alerts
- [ ] Add more metrics
- [ ] Customize pricing in `lib/google-cloud.ts`
- [ ] Adjust Supabase limits in `lib/supabase.ts`
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Add custom charts

## ⚡ Performance Check

- [ ] Initial page load < 3 seconds
- [ ] Time range switching is smooth
- [ ] Charts render quickly
- [ ] No layout shifts
- [ ] API responses < 2 seconds

## 🐛 Common Issues Fixed

If you encounter issues, verify:
- [ ] Node.js version is 18+
- [ ] All dependencies installed
- [ ] Environment variables are spelled correctly
- [ ] JSON credentials are valid (test with JSON validator)
- [ ] APIs are enabled in Google Cloud Console
- [ ] Supabase project is active
- [ ] Service account has correct permissions
- [ ] No conflicting ports (3000)

## ✨ Final Steps

- [ ] Take a screenshot of working dashboard
- [ ] Bookmark http://localhost:3000
- [ ] Set reminder to check daily for first week
- [ ] Plan for production deployment
- [ ] Share with team (if applicable)

---

## 🎉 All Done?

If all checkboxes are checked, you're ready to:
1. Monitor your usage in real-time
2. Track costs and prevent overages
3. Make data-driven decisions about API usage
4. Deploy to production when ready

**Need help?** Check `SETUP.md` for troubleshooting or `README.md` for full documentation.

---

**Congratulations! Your AI Usage Dashboard is ready! 🚀**

