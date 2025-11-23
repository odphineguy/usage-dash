# ⚡ Quick Start - 5 Minutes to Dashboard

Get your AI Usage Dashboard running in 5 minutes!

## 🚀 Super Fast Setup

### 1. Install (30 seconds)
```bash
npm install
```

### 2. Create `.env.local` (2 minutes)

Create a file named `.env.local` in the root directory and add your keys:

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
GOOGLE_APPLICATION_CREDENTIALS_JSON=paste-your-json-key-here
GOOGLE_CLOUD_REGION=us-central1

# Supabase  
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Budget
MONTHLY_BUDGET_USD=100
```

### 3. Run (10 seconds)
```bash
npm run dev
```

### 4. Open Browser
Go to: **http://localhost:3000**

## 🔑 Where to Find Your Keys

### Google Cloud Keys
1. Go to: https://console.cloud.google.com/
2. Click the project dropdown → Copy project ID
3. Menu → IAM & Admin → Service Accounts → Create
4. Add roles: "Monitoring Viewer"
5. Create key → JSON → Download
6. **Important**: Remove all line breaks from JSON and paste into `.env.local`

### Supabase Keys
1. Go to: https://app.supabase.com/
2. Select your project
3. Settings → API
4. Copy all three values to `.env.local`

## ✅ Verify It Works

You should see:
- ✅ Two tabs: "Google Cloud" and "Supabase"
- ✅ Metric cards with numbers (or zeros if no usage yet)
- ✅ Charts rendering without errors
- ✅ No console errors

## 🐛 Not Working?

### No Google Cloud Data?
- Make sure you've made at least one Gemini API call
- Wait 5-10 minutes for metrics to appear
- Check service account has "Monitoring Viewer" role

### No Supabase Data?
- Verify you're using the **service_role** key, not anon key
- Check project URL is correct
- Make sure project is active

### Other Issues?
Check `SETUP.md` for detailed troubleshooting.

## 🎉 Next Steps

1. Make some Gemini API calls to see metrics populate
2. Adjust your budget in `.env.local`
3. Check back daily to monitor usage
4. Deploy to production (see `DEPLOYMENT.md`)

## 📖 Learn More

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `FEATURES.md` - Feature overview
- `DEPLOYMENT.md` - Deploy to production

---

**Need help?** Check the troubleshooting section in `SETUP.md` or `README.md`

