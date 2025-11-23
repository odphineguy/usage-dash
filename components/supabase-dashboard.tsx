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
import { SupabaseUsageMetrics } from '@/types';
import { formatBytes } from '@/lib/supabase';
import { Database, HardDrive, Users, Wifi, Zap, AlertCircle } from 'lucide-react';
import { SupabaseBarChartWrapper } from '@/components/charts/supabase-bar-chart-wrapper';

export function SupabaseDashboard() {
  const [metrics, setMetrics] = useState<SupabaseUsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/supabase/usage');
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
            <div className="animate-pulse">Loading Supabase metrics...</div>
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

  const usageData = [
    {
      name: 'Database',
      percentage: metrics.database.percentage,
      used: metrics.database.size,
      limit: metrics.database.limit,
      icon: Database,
    },
    {
      name: 'Bandwidth',
      percentage: metrics.bandwidth.percentage,
      used: metrics.bandwidth.used,
      limit: metrics.bandwidth.limit,
      icon: Wifi,
    },
    {
      name: 'Storage',
      percentage: metrics.storage.percentage,
      used: metrics.storage.used,
      limit: metrics.storage.limit,
      icon: HardDrive,
    },
    {
      name: 'Auth Users',
      percentage: metrics.authUsers.percentage,
      used: metrics.authUsers.count,
      limit: metrics.authUsers.limit,
      icon: Users,
    },
    {
      name: 'API Requests',
      percentage: metrics.apiRequests.percentage,
      used: metrics.apiRequests.count,
      limit: metrics.apiRequests.limit,
      icon: Zap,
    },
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'hsl(var(--destructive))';
    if (percentage >= 70) return 'hsl(45, 93%, 47%)'; // Yellow/warning
    return 'hsl(var(--primary))';
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 90) return { variant: 'destructive' as const, label: 'Critical' };
    if (percentage >= 70) return { variant: 'secondary' as const, label: 'Warning' };
    return { variant: 'default' as const, label: 'Healthy' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Supabase Usage</h2>
        <p className="text-muted-foreground">
          Monitor your Supabase free tier limits
        </p>
      </div>

      {/* Critical Alerts */}
      {usageData.some((item) => item.percentage >= 90) && (
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Usage Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {usageData
                .filter((item) => item.percentage >= 90)
                .map((item) => (
                  <p key={item.name} className="text-sm">
                    <strong>{item.name}</strong> is at{' '}
                    <strong>{item.percentage.toFixed(1)}%</strong> of your limit
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usageData.map((item) => {
          const Icon = item.icon;
          const status = getStatusBadge(item.percentage);
          
          return (
            <Card key={item.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold">
                      {item.name === 'Auth Users' || item.name === 'API Requests'
                        ? item.used.toLocaleString()
                        : formatBytes(item.used)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of{' '}
                      {item.name === 'Auth Users' || item.name === 'API Requests'
                        ? item.limit.toLocaleString()
                        : formatBytes(item.limit)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(item.percentage, 100)}%`,
                          backgroundColor: getStatusColor(item.percentage),
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-sm font-medium">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription>
            Percentage of free tier limits used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupabaseBarChartWrapper data={usageData} getStatusColor={getStatusColor} />
        </CardContent>
      </Card>
    </div>
  );
}

