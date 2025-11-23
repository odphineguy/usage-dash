# 📊 AI Usage Dashboard - Project Summary

## What This Is

A production-ready Next.js dashboard that monitors and tracks:
- **Google Cloud AI (Gemini API)** usage - costs, tokens, requests, and budget projections
- **Supabase** free tier limits - database, storage, bandwidth, auth users, API requests

## Key Features ✨

### Budget Tracking & Alerts
- Set monthly budget limits
- Real-time cost projections
- Visual alerts when approaching or exceeding budget
- Daily cost trend analysis

### Comprehensive Metrics
- Google Cloud: Total cost, API requests, tokens, monthly projections
- Supabase: Database size, bandwidth, storage, auth users, API requests
- Time ranges: 24h, 7d, 30d

### Beautiful UI
- doom-64 theme (retro gaming aesthetic)
- Responsive design (mobile, tablet, desktop)
- Dark mode by default
- Interactive charts with Recharts
- Loading states and error boundaries

### Security First
- All API keys stored server-side
- Secure API routes
- Environment variable management
- No sensitive data exposed to client

## Tech Stack 🛠️

| Technology | Purpose |
|-----------|---------|
| Next.js 14+ | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI components |
| Recharts | Data visualization |
| Google Cloud Monitoring API | Fetch Gemini usage metrics |
| Supabase Admin API | Track Supabase limits |

## Project Structure 📁

```
usage-dash/
├── app/
│   ├── api/                    # API routes (server-side)
│   │   ├── google-cloud/       
│   │   │   └── usage/route.ts  # Google Cloud metrics endpoint
│   │   └── supabase/
│   │       └── usage/route.ts  # Supabase metrics endpoint
│   ├── globals.css             # Global styles + doom-64 theme
│   ├── layout.tsx              # Root layout with fonts
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── google-cloud-dashboard.tsx  # Google Cloud UI
│   ├── supabase-dashboard.tsx      # Supabase UI
│   ├── error-boundary.tsx          # Error handling
│   └── ui/                         # shadcn components
├── lib/
│   ├── google-cloud.ts         # Google Cloud API logic
│   ├── supabase.ts             # Supabase API logic
│   └── utils.ts                # Utility functions
├── types/
│   └── index.ts                # TypeScript types
├── README.md                   # Full documentation
├── SETUP.md                    # Detailed setup guide
├── QUICKSTART.md               # 5-minute setup
├── DEPLOYMENT.md               # Deploy to production
├── FEATURES.md                 # Feature details
└── env.example.txt             # Environment variable template
```

## Setup Time ⏱️

- **Quick Start**: 5 minutes
- **Full Setup**: 15-20 minutes (including API configuration)
- **Deployment**: 10-15 minutes

## Requirements 📋

### Development
- Node.js 18+
- npm or yarn
- Google Cloud project with Gemini API access
- Supabase project (free tier works)

### API Access
- Google Cloud service account with Monitoring Viewer role
- Supabase service role key (from project settings)

### Environment Variables
```env
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS_JSON
GOOGLE_CLOUD_REGION
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
MONTHLY_BUDGET_USD
```

## Quick Commands 🚀

```bash
npm install          # Install dependencies
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Check for errors
```

## Documentation 📚

| File | What It Covers |
|------|---------------|
| `QUICKSTART.md` | Get running in 5 minutes |
| `SETUP.md` | Detailed setup instructions |
| `README.md` | Complete documentation |
| `FEATURES.md` | All features explained |
| `DEPLOYMENT.md` | Deploy to Vercel, Railway, etc. |

## What You Can Track 📈

### Google Cloud (Gemini API)
- ✅ Real-time cost
- ✅ Total API requests
- ✅ Token usage (input/output)
- ✅ Daily cost trends
- ✅ Monthly cost projections
- ✅ Budget alerts

### Supabase
- ✅ Database size vs. 500MB limit
- ✅ Bandwidth vs. 2GB limit
- ✅ Storage vs. 1GB limit
- ✅ Auth users vs. 50k limit
- ✅ API requests vs. 500k limit
- ✅ Visual usage warnings

## Customization Options 🎨

### Easy to Customize
- Budget limits (environment variable)
- Gemini API pricing (lib/google-cloud.ts)
- Supabase tier limits (lib/supabase.ts)
- Theme (30+ themes available)
- Time ranges
- Chart types

### Advanced
- Add custom metrics
- Integrate other cloud services
- Add email/SMS alerts
- Export data features
- Multi-project support

## Deployment Ready 🚢

Works with:
- ✅ Vercel (recommended)
- ✅ Railway
- ✅ Netlify
- ✅ Docker
- ✅ Any Node.js host

See `DEPLOYMENT.md` for step-by-step guides.

## Security Features 🔒

- ✅ Server-side API key handling
- ✅ No sensitive data in client
- ✅ Environment variable isolation
- ✅ TypeScript type safety
- ✅ Input validation
- ✅ Error boundaries

## Performance 🚄

- Fast initial load (< 3s)
- Optimized chart rendering
- Client-side caching
- Server-side data fetching
- Static generation where possible

## Browser Support 🌐

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Cost to Run 💰

### Free Tier Options
- **Vercel**: Free for personal projects
- **Railway**: $5/month credit
- **Netlify**: 100GB bandwidth free
- **Google Cloud**: Pay only for Monitoring API calls (minimal)
- **Supabase**: Free tier for small projects

### Recommended for Production
- **Vercel Pro**: $20/month (for commercial projects)
- Total cost typically: $20-30/month for small-medium usage

## Limitations & Notes ⚠️

### Google Cloud Metrics
- Metrics delayed by 5-10 minutes
- Historical data takes time to populate
- Requires active API usage to show data
- Token counts are estimates (configurable)

### Supabase Metrics
- Some metrics are estimates (bandwidth, API requests)
- Requires additional tracking for 100% accuracy
- Database size calculation is approximate

## Success Metrics 🎯

After setup, you should:
- ✅ See your current costs in real-time
- ✅ Track usage across time periods
- ✅ Receive alerts before going over budget
- ✅ Make data-driven decisions about API usage
- ✅ Prevent unexpected bills

## Next Steps After Setup ▶️

1. **Day 1**: Configure all environment variables
2. **Day 2**: Make API calls to generate metrics
3. **Day 3**: Check dashboard daily to understand usage patterns
4. **Week 1**: Adjust budget and pricing as needed
5. **Week 2**: Deploy to production
6. **Month 1**: Set up automated alerts (optional)

## Support & Resources 💬

### Documentation
- All docs included in project
- Comments in code
- TypeScript types for guidance

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Google Cloud Monitoring](https://cloud.google.com/monitoring/docs)
- [Supabase Docs](https://supabase.com/docs)

### Getting Help
1. Check `README.md` troubleshooting section
2. Check `SETUP.md` for setup issues
3. Review code comments
4. Check browser console for errors

## License 📄

MIT License - Free to use for personal and commercial projects

---

## Ready to Start? 🚀

1. Run `npm install`
2. Copy `env.example.txt` to `.env.local`
3. Add your API keys
4. Run `npm run dev`
5. Open http://localhost:3000

See `QUICKSTART.md` for detailed steps!

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**

