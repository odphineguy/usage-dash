'use client';

/**
 * Line Chart Wrapper for Google Cloud Cost Trends
 * 
 * NOTE: This component uses client-side only rendering due to Recharts compatibility
 * issues with React 19 and Next.js 15 SSR. See CLAUDE.md for details.
 * 
 * Pattern: useEffect + dynamic import() ensures Recharts only loads on client side.
 */

import { useState, useEffect } from 'react';
import { DailyCost } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChartComponentsType {
  AreaChart: React.ComponentType<any>;
  Area: React.ComponentType<any>;
  XAxis: React.ComponentType<any>;
  YAxis: React.ComponentType<any>;
  CartesianGrid: React.ComponentType<any>;
  Tooltip: React.ComponentType<any>;
  Legend: React.ComponentType<any>;
  ResponsiveContainer: React.ComponentType<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface LineChartWrapperProps {
  data: DailyCost[];
}

export function LineChartWrapper({ data }: LineChartWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [ChartComponents, setChartComponents] = useState<ChartComponentsType | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Recharts only on client side
    import('recharts').then((recharts) => {
      setChartComponents({
        AreaChart: recharts.AreaChart,
        Area: recharts.Area,
        XAxis: recharts.XAxis,
        YAxis: recharts.YAxis,
        CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip,
        Legend: recharts.Legend,
        ResponsiveContainer: recharts.ResponsiveContainer,
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
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } = ChartComponents;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(value: unknown) => {
            try {
              return new Date(value as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } catch {
              return String(value);
            }
          }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(value: unknown) => {
            const numValue = typeof value === 'number' ? value : 0;
            return `$${numValue.toFixed(3)}`;
          }}
        />
        <Tooltip
          labelFormatter={(value: unknown) => {
            try {
              return new Date(value as string).toLocaleDateString();
            } catch {
              return String(value);
            }
          }}
          formatter={(value: unknown) => {
            const numValue = typeof value === 'number' ? value : 0;
            return [`$${numValue.toFixed(4)}`, 'Cost'];
          }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          fill="url(#colorCost)"
          name="Daily Cost"
          dot={{ fill: 'hsl(var(--primary))', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

