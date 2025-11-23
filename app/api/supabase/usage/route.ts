import { NextResponse } from 'next/server';

// Mock data - realistic usage percentages
function generateMockData() {
  const FREE_TIER_LIMITS = {
    database: 500 * 1024 * 1024, // 500 MB
    bandwidth: 2 * 1024 * 1024 * 1024, // 2 GB
    storage: 1 * 1024 * 1024 * 1024, // 1 GB
    authUsers: 50000, // 50k users
    apiRequests: 500000, // 500k per month
  };

  // Generate realistic usage percentages
  const databasePercentage = 15.3; // 15.3% used
  const bandwidthPercentage = 8.7; // 8.7% used
  const storagePercentage = 23.4; // 23.4% used
  const authUsersPercentage = 2.1; // 2.1% used
  const apiRequestsPercentage = 12.5; // 12.5% used

  return {
    database: {
      size: Math.round((FREE_TIER_LIMITS.database * databasePercentage) / 100),
      limit: FREE_TIER_LIMITS.database,
      percentage: databasePercentage,
    },
    bandwidth: {
      used: Math.round((FREE_TIER_LIMITS.bandwidth * bandwidthPercentage) / 100),
      limit: FREE_TIER_LIMITS.bandwidth,
      percentage: bandwidthPercentage,
    },
    storage: {
      used: Math.round((FREE_TIER_LIMITS.storage * storagePercentage) / 100),
      limit: FREE_TIER_LIMITS.storage,
      percentage: storagePercentage,
    },
    authUsers: {
      count: Math.round((FREE_TIER_LIMITS.authUsers * authUsersPercentage) / 100),
      limit: FREE_TIER_LIMITS.authUsers,
      percentage: authUsersPercentage,
    },
    apiRequests: {
      count: Math.round((FREE_TIER_LIMITS.apiRequests * apiRequestsPercentage) / 100),
      limit: FREE_TIER_LIMITS.apiRequests,
      percentage: apiRequestsPercentage,
    },
  };
}

export async function GET() {
  try {
    // Return mock data
    const metrics = generateMockData();

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error in Supabase usage API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch Supabase metrics',
      },
      { status: 500 }
    );
  }
}

