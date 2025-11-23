"use client";

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeminiUsageMetrics, TimeRange } from '@/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChartWrapper } from '@/components/charts/line-chart-wrapper';
import { BarChartWrapper } from '@/components/charts/bar-chart-wrapper';
import { AlertCircle, TrendingUp, DollarSign, Zap, Hash } from 'lucide-react';

export function GoogleCloudDashboard() {
  const [metrics, setMetrics] = useState<GeminiUsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/google-cloud/usage?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setMetrics(result.data);
      } else {
        console.error('API returned error:', result.error);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      // Don't set metrics to null on error, keep previous data if available
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="animate-pulse">Loading Google Cloud metrics...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Failed to load metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const budgetPercentage = (metrics.monthlyProjection / metrics.budgetLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Google Cloud (Gemini API)</h2>
          <p className="text-muted-foreground">
            Receipt & Barcode Scanning Usage
          </p>
        </div>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <TabsList>
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Budget Alert */}
      {metrics.isOverBudget && (
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Budget Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your projected monthly cost of <strong>${metrics.monthlyProjection.toFixed(2)}</strong> exceeds your budget limit of <strong>${metrics.budgetLimit.toFixed(2)}</strong> by{' '}
              <strong>${(metrics.monthlyProjection - metrics.budgetLimit).toFixed(2)}</strong>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange === '24h' ? '24 hours' : timeRange === '7d' ? '7 days' : '30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.apiRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total requests made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.totalTokens / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Tokens processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.monthlyProjection.toFixed(2)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    budgetPercentage > 100
                      ? 'bg-destructive'
                      : budgetPercentage > 80
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              <Badge variant={budgetPercentage > 100 ? 'destructive' : 'secondary'}>
                {budgetPercentage.toFixed(0)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Budget: ${metrics.budgetLimit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Cost Trend Chart */}
      {metrics.dailyCosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Cost Trend</CardTitle>
            <CardDescription>
              Cost breakdown over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartWrapper data={metrics.dailyCosts} />
          </CardContent>
        </Card>
      )}

      {/* Requests and Tokens Chart */}
      {metrics.dailyCosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Requests & Tokens</CardTitle>
            <CardDescription>
              Daily API requests and token usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartWrapper data={metrics.dailyCosts} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

