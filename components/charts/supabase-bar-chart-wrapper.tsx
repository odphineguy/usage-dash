'use client';

/**
 * Supabase Bar Chart Wrapper
 * 
 * NOTE: This component uses client-side only rendering due to Recharts compatibility
 * issues with React 19 and Next.js 15 SSR. See CLAUDE.md for details.
 * 
 * Pattern: useEffect + dynamic import() ensures Recharts only loads on client side.
 */

import { useState, useEffect } from 'react';

interface UsageDataItem {
  name: string;
  percentage: number;
  used: number;
  limit: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface SupabaseBarChartWrapperProps {
  data: UsageDataItem[];
  getStatusColor: (percentage: number) => string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChartComponentsType {
  BarChart: React.ComponentType<any>;
  Bar: React.ComponentType<any>;
  XAxis: React.ComponentType<any>;
  YAxis: React.ComponentType<any>;
  CartesianGrid: React.ComponentType<any>;
  Tooltip: React.ComponentType<any>;
  Legend: React.ComponentType<any>;
  ResponsiveContainer: React.ComponentType<any>;
  Cell: React.ComponentType<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function SupabaseBarChartWrapper({ data, getStatusColor }: SupabaseBarChartWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [ChartComponents, setChartComponents] = useState<ChartComponentsType | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Recharts only on client side
    import('recharts').then((recharts) => {
      setChartComponents({
        BarChart: recharts.BarChart,
        Bar: recharts.Bar,
        XAxis: recharts.XAxis,
        YAxis: recharts.YAxis,
        CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip,
        Legend: recharts.Legend,
        ResponsiveContainer: recharts.ResponsiveContainer,
        Cell: recharts.Cell,
      });
    });
  }, []);

  if (!isClient || !ChartComponents) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  const {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
  } = ChartComponents;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          label={{ value: 'Usage %', angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
        />
        <Tooltip
          formatter={(value: unknown) => {
            const numValue = typeof value === 'number' ? value : 0;
            return `${numValue.toFixed(1)}%`;
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
          }}
        />
        <Legend />
        <Bar dataKey="percentage" name="Usage %">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getStatusColor(entry.percentage)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

