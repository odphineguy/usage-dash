# Quick Setup Guide

Follow these steps to get your AI Usage Dashboard up and running.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Google Cloud account with a project
- Supabase account with a project

## Step-by-Step Setup

### 1. Clone and Install

```bash
cd usage-dash
npm install
```

### 2. Create Environment File

Copy the example file:
```bash
cp .env.example .env.local
```

Or create `.env.local` manually with this content:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS_JSON=
GOOGLE_CLOUD_REGION=us-central1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Budget Settings
MONTHLY_BUDGET_USD=100
```

### 3. Get Google Cloud Credentials

#### Option A: Using gcloud CLI (Easier)

```bash
# Install gcloud CLI if you haven't
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Create service account
gcloud iam service-accounts create usage-dashboard \
    --display-name="Usage Dashboard"

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:usage-dashboard@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/monitoring.viewer"

# Create and download key
gcloud iam service-accounts keys create ~/usage-dashboard-key.json \
    --iam-account=usage-dashboard@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Enable required APIs
gcloud services enable monitoring.googleapis.com
gcloud services enable aiplatform.googleapis.com
```

Then minify the JSON file and add it to your `.env.local`:
```bash
cat ~/usage-dashboard-key.json | jq -c
```

Copy the output and paste it as the value for `GOOGLE_APPLICATION_CREDENTIALS_JSON`.

#### Option B: Using Google Cloud Console (Manual)

1. Go to https://console.cloud.google.com/
2. Select or create a project
3. Enable APIs:
   - Go to "APIs & Services" > "Library"
   - Enable "Cloud Monitoring API"
   - Enable "Vertex AI API"
4. Create Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Name: "usage-dashboard"
   - Grant role: "Monitoring Viewer"
   - Create JSON key
5. Download the JSON key
6. Minify it (remove all line breaks and spaces)
7. Add to `.env.local` as `GOOGLE_APPLICATION_CREDENTIALS_JSON`

### 4. Get Supabase Credentials

1. Go to https://app.supabase.com/
2. Select your project
3. Go to Settings > API
4. Copy these values to `.env.local`:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Set Your Budget

In `.env.local`, set your monthly budget (in USD):

```env
MONTHLY_BUDGET_USD=100
```

### 6. Run the Dashboard

```bash
npm run dev
```

Open http://localhost:3000

## Verification Checklist

- [ ] Can see Google Cloud metrics (may be empty if no API calls made yet)
- [ ] Can see Supabase usage metrics
- [ ] Budget projection shows your configured limit
- [ ] Time range selector works (24h, 7d, 30d)
- [ ] Charts render without errors
- [ ] No console errors in browser

## Common Issues

### "Failed to load metrics"

**Google Cloud:**
- Verify service account has correct permissions
- Check that APIs are enabled
- Ensure you've made at least one Gemini API call (no data = no metrics)

**Supabase:**
- Verify service role key is correct
- Check that project URL is correct
- Ensure you're using the service_role key, not the anon key

### "Invalid credentials"

- Check JSON is properly minified (no line breaks)
- Verify the JSON is valid (use a JSON validator)
- Make sure there are no extra quotes or spaces

### Charts not showing data

- Google Cloud: You need to have made API calls for metrics to appear
- May take 5-10 minutes for Google Cloud to report metrics
- Check browser console for errors

## Next Steps

1. **Customize Pricing**: Edit `lib/google-cloud.ts` to match your Gemini pricing
2. **Adjust Limits**: Edit `lib/supabase.ts` for your Supabase plan limits
3. **Deploy**: Deploy to Vercel, Railway, or your preferred host
4. **Monitor**: Set up alerts and regularly check your usage

## Need Help?

- Google Cloud Issues: https://cloud.google.com/support
- Supabase Issues: https://supabase.com/docs
- Dashboard Issues: Check the main README.md

