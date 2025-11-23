import { createClient } from '@supabase/supabase-js';
import { SupabaseUsageMetrics } from '@/types';

export async function getSupabaseUsageMetrics(): Promise<SupabaseUsageMetrics> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch database size
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_schema', 'public');

    // Storage usage
    const { data: storageData } = await supabase.storage
      .listBuckets();

    let totalStorageSize = 0;
    if (storageData) {
      for (const bucket of storageData) {
        const { data: files } = await supabase.storage.from(bucket.name).list();
        if (files) {
          // Note: This is an approximation. You may need to sum actual file sizes
          totalStorageSize += files.length * 1024 * 1024; // Rough estimate
        }
      }
    }

    // Auth users count
    const { data: authData } = await supabase.auth.admin.listUsers();
    const userCount = authData?.users?.length || 0;

    // Free tier limits (adjust based on your Supabase plan)
    const FREE_TIER_LIMITS = {
      database: 500 * 1024 * 1024, // 500 MB
      bandwidth: 2 * 1024 * 1024 * 1024, // 2 GB
      storage: 1 * 1024 * 1024 * 1024, // 1 GB
      authUsers: 50000, // 50k users
      apiRequests: 500000, // 500k per month
    };

    // Calculate approximate database size (this is a rough estimate)
    const estimatedDbSize = (tables?.length || 0) * 10 * 1024 * 1024; // 10MB per table estimate

    // Bandwidth estimation (this would require additional tracking)
    const estimatedBandwidth = 0; // You'd need to track this separately

    // API requests estimation (this would require additional tracking)
    const estimatedApiRequests = 0; // You'd need to track this separately

    return {
      database: {
        size: estimatedDbSize,
        limit: FREE_TIER_LIMITS.database,
        percentage: (estimatedDbSize / FREE_TIER_LIMITS.database) * 100,
      },
      bandwidth: {
        used: estimatedBandwidth,
        limit: FREE_TIER_LIMITS.bandwidth,
        percentage: (estimatedBandwidth / FREE_TIER_LIMITS.bandwidth) * 100,
      },
      storage: {
        used: totalStorageSize,
        limit: FREE_TIER_LIMITS.storage,
        percentage: (totalStorageSize / FREE_TIER_LIMITS.storage) * 100,
      },
      authUsers: {
        count: userCount,
        limit: FREE_TIER_LIMITS.authUsers,
        percentage: (userCount / FREE_TIER_LIMITS.authUsers) * 100,
      },
      apiRequests: {
        count: estimatedApiRequests,
        limit: FREE_TIER_LIMITS.apiRequests,
        percentage: (estimatedApiRequests / FREE_TIER_LIMITS.apiRequests) * 100,
      },
    };
  } catch (error) {
    console.error('Error fetching Supabase usage metrics:', error);
    
    // Return default structure on error
    return {
      database: { size: 0, limit: 500 * 1024 * 1024, percentage: 0 },
      bandwidth: { used: 0, limit: 2 * 1024 * 1024 * 1024, percentage: 0 },
      storage: { used: 0, limit: 1 * 1024 * 1024 * 1024, percentage: 0 },
      authUsers: { count: 0, limit: 50000, percentage: 0 },
      apiRequests: { count: 0, limit: 500000, percentage: 0 },
    };
  }
}

// Helper function to format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

