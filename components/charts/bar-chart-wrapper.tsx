'use client';

/**
 * Bar Chart Wrapper for Google Cloud Requests & Tokens
 * 
 * NOTE: This component uses client-side only rendering due to Recharts compatibility
 * issues with React 19 and Next.js 15 SSR. See CLAUDE.md for details.
 * 
 * Pattern: dynamic imports with ssr: false ensure Recharts only loads on client side.
 */

import dynamic from 'next/dynamic';
import { DailyCost } from '@/types';

const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
);

const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
);

const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);

const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);

const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);

const Legend = dynamic(
  () => import('recharts').then((mod) => mod.Legend),
  { ssr: false }
);

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

interface BarChartWrapperProps {
  data: DailyCost[];
}

export function BarChartWrapper({ data }: BarChartWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(value) => {
            try {
              return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } catch {
              return String(value);
            }
          }}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          labelFormatter={(value) => {
            try {
              return new Date(value).toLocaleDateString();
            } catch {
              return String(value);
            }
          }}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="requests"
          fill="hsl(var(--primary))"
          name="Requests"
        />
        <Bar
          yAxisId="right"
          dataKey="tokens"
          fill="hsl(var(--accent))"
          name="Tokens"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

