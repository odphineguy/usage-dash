import { NextRequest, NextResponse } from 'next/server';
import { TimeRange, DailyCost } from '@/types';

// Mock data generator
function generateMockData(timeRange: TimeRange) {
  const now = new Date();
  const dailyCosts: DailyCost[] = [];
  
  let days = 1;
  if (timeRange === '7d') days = 7;
  if (timeRange === '30d') days = 30;

  let totalCost = 0;
  let totalRequests = 0;
  let totalTokens = 0;

  // Generate daily data with some variation
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Random variation: 50-150% of base values
    const variation = 0.5 + Math.random();
    const baseRequests = timeRange === '24h' ? 120 : timeRange === '7d' ? 150 : 180;
    const requests = Math.round(baseRequests * variation);
    const tokens = requests * 1500; // Average tokens per request
    const cost = (tokens / 1000) * 0.00025; // $0.25 per 1M tokens

    totalCost += cost;
    totalRequests += requests;
    totalTokens += tokens;

    dailyCosts.push({
      date: dateStr,
      cost: parseFloat(cost.toFixed(6)),
      tokens: Math.round(tokens),
      requests: Math.round(requests),
    });
  }

  const monthlyBudget = 100; // Default budget
  const dailyAverage = totalCost / days;
  const monthlyProjection = dailyAverage * 30;

  return {
    totalCost: parseFloat(totalCost.toFixed(4)),
    apiRequests: Math.round(totalRequests),
    totalTokens: Math.round(totalTokens),
    monthlyProjection: parseFloat(monthlyProjection.toFixed(2)),
    dailyCosts,
    isOverBudget: monthlyProjection > monthlyBudget,
    budgetLimit: monthlyBudget,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = (searchParams.get('timeRange') || '7d') as TimeRange;

    // Validate timeRange
    if (!['24h', '7d', '30d'].includes(timeRange)) {
      return NextResponse.json(
        { success: false, error: 'Invalid timeRange. Must be 24h, 7d, or 30d' },
        { status: 400 }
      );
    }

    // Return mock data
    const metrics = generateMockData(timeRange);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error in Google Cloud usage API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch Google Cloud metrics',
      },
      { status: 500 }
    );
  }
}

