"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { AnalyticsRecord } from "@/lib/Types/analytics";
import { Spinner } from "@/components/ui/spinner";

const BotAnalyticsPage = () => {
  const params = useParams();
  const botId = params.id as string;

  const [data, setData] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Replace with your actual API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/botAnalytics/getAnalytics/${botId}`);

        if (!response.ok) {
          console.log("Error");
          throw new Error(`Failed to fetch analytics: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("Fetched analytics data:", result);
        setData(Array.isArray(result) ? result : result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (botId) {
      fetchAnalytics();
    }
  }, [botId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-slate-100">
            Bot Analytics
          </h1>
          <p className="text-muted-foreground dark:text-slate-400 mt-2">
            Detailed performance metrics and usage analytics for your bot
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Spinner />
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
            <p className="text-sm text-destructive/80 mt-2">
              Make sure your backend API endpoint is configured correctly at /api/analytics/[botId]
            </p>
          </div>
        ) : (
          <AnalyticsCharts data={data} loading={loading} error={error} />
        )}
      </div>
    </div>
  );
};

export default BotAnalyticsPage;
