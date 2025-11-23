import { GoogleCloudDashboard } from '@/components/google-cloud-dashboard';
import { SupabaseDashboard } from '@/components/supabase-dashboard';
import { ThemeToggle } from '@/components/theme-toggle';
import { ErrorBoundary } from '@/components/error-boundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Abe&apos;s AI Usage Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor and track your Google Cloud AI and Supabase usage
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="google-cloud" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="google-cloud">Google Cloud</TabsTrigger>
            <TabsTrigger value="supabase">Supabase</TabsTrigger>
          </TabsList>

          <TabsContent value="google-cloud" className="space-y-6">
            <ErrorBoundary>
              <GoogleCloudDashboard />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="supabase" className="space-y-6">
            <ErrorBoundary>
              <SupabaseDashboard />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
