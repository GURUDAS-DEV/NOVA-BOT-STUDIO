import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { AnalyticsRecord } from "@/lib/Types/analytics";

type BotAnalyticsPageProps = {
  params: Promise<{
    id?: string;
  }>;
  searchParams?: Promise<{
    id?: string;
  }>;
};

async function getAnalytics(botId: string): Promise<{ data: AnalyticsRecord[]; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botAnalytics/getAnalytics/${botId}`,
      { cache: "no-store" }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || response.statusText || "Failed to fetch analytics");
    }

    return { data: Array.isArray(result) ? result : result.result || [] };
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err.message : "Failed to load analytics",
    };
  }
}

const BotAnalyticsPage = async ({ params, searchParams }: BotAnalyticsPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const botId = resolvedParams?.id || resolvedSearchParams?.id;

  if (!botId) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-950">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">Missing bot id</p>
            <p className="text-sm text-destructive/80 mt-2">Add the bot id to the path to view analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  const { data, error } = await getAnalytics(botId);

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-slate-100">Bot Analytics</h1>
          <p className="text-muted-foreground dark:text-slate-400 mt-2">
            Detailed performance metrics and usage analytics for your bot
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <p className="text-sm text-destructive/80 mt-2">
              Make sure your backend API endpoint is configured correctly at /api/botAnalytics/getAnalytics/[id]
            </p>
          </div>
        ) : (
          <AnalyticsCharts data={data} loading={false} error={null} />
        )}
      </div>
    </div>
  );
};

export default BotAnalyticsPage;
