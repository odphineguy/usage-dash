// Google Cloud Types
export interface GeminiUsageMetrics {
  totalCost: number;
  apiRequests: number;
  totalTokens: number;
  monthlyProjection: number;
  dailyCosts: DailyCost[];
  isOverBudget: boolean;
  budgetLimit: number;
}

export interface DailyCost {
  date: string;
  cost: number;
  tokens: number;
  requests: number;
}

// Supabase Types
export interface SupabaseUsageMetrics {
  database: {
    size: number;
    limit: number;
    percentage: number;
  };
  bandwidth: {
    used: number;
    limit: number;
    percentage: number;
  };
  storage: {
    used: number;
    limit: number;
    percentage: number;
  };
  authUsers: {
    count: number;
    limit: number;
    percentage: number;
  };
  apiRequests: {
    count: number;
    limit: number;
    percentage: number;
  };
}

export type TimeRange = '24h' | '7d' | '30d';

export interface UsageResponse {
  success: boolean;
  data?: GeminiUsageMetrics | SupabaseUsageMetrics;
  error?: string;
}

