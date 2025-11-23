# AI Usage Dashboard

A comprehensive Next.js dashboard for monitoring and tracking Google Cloud AI (Gemini API) and Supabase usage with budget alerts and projections.

## Features

### Google Cloud (Gemini API) Monitoring
- **Total Cost Tracking**: Monitor your spending in real-time
- **API Request Counts**: Track the number of API calls made
- **Token Usage**: See total tokens processed
- **Monthly Projection**: Predictive cost analysis with budget alerts
- **Daily Cost Trends**: Visual charts showing cost patterns over time
- **Budget Alerts**: Get notified when projected costs exceed your budget

### Supabase Monitoring
- **Database Size**: Track database storage usage vs. limits
- **Bandwidth**: Monitor data transfer
- **Storage**: Track file storage usage
- **Auth Users**: Monitor active user count
- **API Requests**: Track API call limits
- **Visual Alerts**: Color-coded warnings for critical usage levels

### Time Range Support
- Last 24 hours
- Last 7 days
- Last 30 days

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with doom-64 theme
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **APIs**: Google Cloud Monitoring API, Supabase Admin API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (use `env.example.txt` as a template):

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}
GOOGLE_CLOUD_REGION=us-central1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Budget Settings
MONTHLY_BUDGET_USD=100
```

### 3. Google Cloud Setup

#### Get Service Account Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **IAM & Admin > Service Accounts**
4. Click **Create Service Account**
5. Give it a name (e.g., "usage-dashboard")
6. Grant these roles:
   - **Monitoring Viewer** (for metrics)
   - **Service Usage Consumer** (for API usage)
7. Click **Done**
8. Click on the service account you just created
9. Go to **Keys** tab
10. Click **Add Key > Create New Key**
11. Choose **JSON** format
12. Download the JSON file
13. **Important**: Minify the JSON (remove line breaks) and paste it as the value for `GOOGLE_APPLICATION_CREDENTIALS_JSON`

#### Enable Required APIs:

```bash
gcloud services enable monitoring.googleapis.com
gcloud services enable aiplatform.googleapis.com
```

Or enable via the [API Library](https://console.cloud.google.com/apis/library):
- Cloud Monitoring API
- Vertex AI API

### 4. Supabase Setup

#### Get Your Credentials:

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Settings > API**
4. Copy:
   - **URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

⚠️ **Important**: Never commit the `service_role` key to version control!

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
usage-dash/
├── app/
│   ├── api/
│   │   ├── google-cloud/
│   │   │   └── usage/
│   │   │       └── route.ts       # Google Cloud API endpoint
│   │   └── supabase/
│   │       └── usage/
│   │           └── route.ts       # Supabase API endpoint
│   ├── globals.css                # Global styles with doom-64 theme
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main dashboard page
├── components/
│   ├── google-cloud-dashboard.tsx # Google Cloud metrics dashboard
│   ├── supabase-dashboard.tsx     # Supabase metrics dashboard
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── google-cloud.ts            # Google Cloud API logic
│   ├── supabase.ts                # Supabase API logic
│   └── utils.ts                   # Utility functions
├── types/
│   └── index.ts                   # TypeScript type definitions
└── env.example.txt                # Environment variables template
```

## API Routes

### Google Cloud Usage

**Endpoint**: `GET /api/google-cloud/usage?timeRange={24h|7d|30d}`

**Response**:
```json
{
  "success": true,
  "data": {
    "totalCost": 2.45,
    "apiRequests": 1234,
    "totalTokens": 456789,
    "monthlyProjection": 15.30,
    "dailyCosts": [...],
    "isOverBudget": false,
    "budgetLimit": 100
  }
}
```

### Supabase Usage

**Endpoint**: `GET /api/supabase/usage`

**Response**:
```json
{
  "success": true,
  "data": {
    "database": { "size": 123456, "limit": 524288000, "percentage": 0.023 },
    "bandwidth": { "used": 234567, "limit": 2147483648, "percentage": 0.011 },
    ...
  }
}
```

## Customization

### Adjust Budget Limit

Change the `MONTHLY_BUDGET_USD` in your `.env.local` file.

### Modify Free Tier Limits

Edit the `FREE_TIER_LIMITS` object in `lib/supabase.ts` to match your Supabase plan.

### Adjust Gemini Pricing

Update the pricing constants in `lib/google-cloud.ts`:
- `COST_PER_1K_INPUT_TOKENS`
- `COST_PER_1K_OUTPUT_TOKENS`
- `AVG_TOKENS_PER_REQUEST`

### Change Theme

The dashboard uses the doom-64 theme. To change themes:

```bash
npx shadcn@latest add https://tweakcn.com/r/themes/YOUR-THEME.json
```

Browse themes at [tweakcn.com](https://tweakcn.com/r/themes)

## Troubleshooting

### Google Cloud Metrics Not Showing

1. Ensure the Monitoring API is enabled
2. Verify service account has correct permissions
3. Check that your Gemini API is being used (metrics only show after API calls)
4. The metric filter may need adjustment based on your specific service

### Supabase Metrics Inaccurate

The Supabase metrics are estimates based on available APIs. For more accurate tracking:
- Set up custom tracking for bandwidth and API requests
- Use Supabase's built-in analytics dashboard for detailed metrics

### Budget Alerts Not Triggering

Ensure `MONTHLY_BUDGET_USD` is set correctly in `.env.local` and restart the development server.

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use service role key only server-side** - Never expose it to the client
3. **Rotate keys regularly** - Change your API keys periodically
4. **Monitor access logs** - Check who's accessing your APIs
5. **Set up proper CORS** - Restrict API access to your domain only

## Contributing

Feel free to open issues or submit pull requests for improvements!

## License

MIT

## Support

For issues related to:
- **Google Cloud**: [Google Cloud Support](https://cloud.google.com/support)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **This Dashboard**: Open an issue on GitHub
