import { MetricServiceClient } from '@google-cloud/monitoring';
import { GeminiUsageMetrics, DailyCost } from '@/types';

export async function getGeminiUsageMetrics(
  timeRange: '24h' | '7d' | '30d'
): Promise<GeminiUsageMetrics> {
  try {
    // Parse credentials from environment variable
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'
    );

    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const monthlyBudget = parseFloat(process.env.MONTHLY_BUDGET_USD || '100');

    if (!projectId || !credentials.project_id) {
      throw new Error('Google Cloud credentials not configured');
    }

    // Initialize the client
    const client = new MetricServiceClient({
      credentials,
      projectId,
    });

    // Calculate time range
    const now = Date.now();
    const timeRanges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    const startTime = now - timeRanges[timeRange];

    // Fetch metrics from Google Cloud Monitoring
    const request = {
      name: `projects/${projectId}`,
      filter: 'metric.type="aiplatform.googleapis.com/prediction/online/response_count"',
      interval: {
        startTime: {
          seconds: Math.floor(startTime / 1000),
        },
        endTime: {
          seconds: Math.floor(now / 1000),
        },
      },
      aggregation: {
        alignmentPeriod: {
          seconds: 3600, // 1 hour intervals
        },
        perSeriesAligner: 'ALIGN_RATE' as const,
      },
    };

    const response = await client.listTimeSeries(request);
    const timeSeries = response[0] || [];

    // Process the time series data
    let totalRequests = 0;
    let totalTokens = 0;
    let totalCost = 0;
    const dailyCosts: DailyCost[] = [];

    // Gemini pricing (approximate - adjust based on your model)
    const COST_PER_1K_INPUT_TOKENS = 0.00025; // $0.25 per 1M tokens
    // const COST_PER_1K_OUTPUT_TOKENS = 0.001; // $1.00 per 1M tokens - for future use
    const AVG_TOKENS_PER_REQUEST = 1500; // Average tokens for receipt/barcode scanning

    if (timeSeries && Array.isArray(timeSeries) && timeSeries.length > 0) {
      const dailyMap = new Map<string, { cost: number; tokens: number; requests: number }>();

      for (const series of timeSeries) {
        if (series.points) {
          for (const point of series.points) {
            if (point.value?.doubleValue) {
              const requests = point.value.doubleValue;
              totalRequests += requests;

              const tokens = requests * AVG_TOKENS_PER_REQUEST;
              totalTokens += tokens;

              const cost = (tokens / 1000) * COST_PER_1K_INPUT_TOKENS;
              totalCost += cost;

              // Group by day
              if (point.interval?.startTime?.seconds) {
                const date = new Date(Number(point.interval.startTime.seconds) * 1000)
                  .toISOString()
                  .split('T')[0];
                
                const existing = dailyMap.get(date) || { cost: 0, tokens: 0, requests: 0 };
                dailyMap.set(date, {
                  cost: existing.cost + cost,
                  tokens: existing.tokens + tokens,
                  requests: existing.requests + requests,
                });
              }
            }
          }
        }
      }

      // Convert map to array
      dailyMap.forEach((value, date) => {
        dailyCosts.push({ date, ...value });
      });
      dailyCosts.sort((a, b) => a.date.localeCompare(b.date));
    }

    // Calculate monthly projection
    const daysInMonth = 30;
    const daysElapsed = Math.min(new Date().getDate(), daysInMonth);
    const dailyAverage = totalCost / (timeRange === '30d' ? daysElapsed : Math.min(daysElapsed, parseInt(timeRange)));
    const monthlyProjection = dailyAverage * daysInMonth;

    return {
      totalCost,
      apiRequests: Math.round(totalRequests),
      totalTokens: Math.round(totalTokens),
      monthlyProjection,
      dailyCosts,
      isOverBudget: monthlyProjection > monthlyBudget,
      budgetLimit: monthlyBudget,
    };
  } catch (error) {
    console.error('Error fetching Gemini usage metrics:', error);
    
    // Return mock data for development/testing
    return {
      totalCost: 0,
      apiRequests: 0,
      totalTokens: 0,
      monthlyProjection: 0,
      dailyCosts: [],
      isOverBudget: false,
      budgetLimit: parseFloat(process.env.MONTHLY_BUDGET_USD || '100'),
    };
  }
}

