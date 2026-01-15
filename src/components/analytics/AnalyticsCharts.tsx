/**
 * Analytics Charts Component
 * Renders all analytics charts using Chart.js
 * Supports dark and light modes automatically
 */

"use client";

import React, { useMemo } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { AnalyticsRecord } from "@/lib/Types/analytics";
import { useAnalytics, useAnalyticsFilters } from "@/lib/analytics/useAnalytics";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsChartsProps {
  data: AnalyticsRecord[];
  loading?: boolean;
  error?: string | null;
}

/**
 * Tab component for switching between hourly and daily views
 */
const TimePeriodTabs: React.FC<{
  period: "hourly" | "daily";
  onChange: (period: "hourly" | "daily") => void;
}> = ({ period, onChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange("hourly")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          period === "hourly"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        Last 24 Hours
      </button>
      <button
        onClick={() => onChange("daily")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          period === "daily"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        Last 7 Days
      </button>
    </div>
  );
};

/**
 * Chart Container - Reusable wrapper for all charts
 */
const ChartContainer: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 dark:bg-slate-900 dark:border-slate-700">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-slate-100">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground dark:text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

/**
 * Metrics Card - Display aggregated metric values
 */
const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}> = ({ label, value, subtext, icon }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground dark:text-slate-100 mt-1">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-muted-foreground dark:text-slate-500 mt-1">
              {subtext}
            </p>
          )}
        </div>
        {icon && <div className="text-primary dark:text-blue-400">{icon}</div>}
      </div>
    </div>
  );
};

/**
 * Main Analytics Charts Component
 */
export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  data,
  loading = false,
  error = null,
}) => {
  const [timePeriod, setTimePeriod] = React.useState<"hourly" | "daily">("hourly");
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<"free" | "pro" | null>(null);
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  // Get analytics data
  const analytics = useAnalytics(data);

  // Filter data based on selections
  const { filteredData, activeFilters, updateFilter, resetAllFilters } =
    useAnalyticsFilters(data);

  // Get filtered analytics
  const filteredAnalytics = useAnalytics(filteredData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-sm font-medium text-destructive">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Requests"
          value={filteredAnalytics.eventMetrics.requests}
          subtext={`Success Rate: ${filteredAnalytics.eventMetrics.successRate.toFixed(1)}%`}
        />
        <MetricCard
          label="Errors"
          value={filteredAnalytics.eventMetrics.errors}
          subtext={`Timeouts: ${filteredAnalytics.eventMetrics.timeouts}`}
        />
        <MetricCard
          label="Total Tokens"
          value={filteredAnalytics.tokensHourly.reduce((sum, t) => sum + t.totalToken, 0)}
          subtext={`Per Request: ${Math.round(
            filteredAnalytics.tokensHourly.reduce((sum, t) => sum + t.totalToken, 0) /
              Math.max(filteredAnalytics.eventMetrics.requests, 1)
          )}`}
        />
        <MetricCard
          label="Avg Latency"
          value={`${Math.round(
            filteredAnalytics.latencyHourly.reduce((sum, l) => sum + l.averageLatency, 0) /
              Math.max(filteredAnalytics.latencyHourly.length, 1)
          )}ms`}
          subtext="Milliseconds"
        />
      </div>

      {/* Requests Over Time */}
      <ChartContainer
        title="Requests Over Time"
        description="Monitor request volume trends and patterns"
      >
        <div className="space-y-4">
          <TimePeriodTabs period={timePeriod} onChange={setTimePeriod} />
          <div className="w-full h-80">
            {timePeriod === "hourly" ? (
              <Line
                data={filteredAnalytics.requestsOverTimeHourlyConfig.data}
                options={filteredAnalytics.requestsOverTimeHourlyConfig.options}
              />
            ) : (
              <Line
                data={filteredAnalytics.requestsOverTimeDailyConfig.data}
                options={filteredAnalytics.requestsOverTimeDailyConfig.options}
              />
            )}
          </div>
        </div>
      </ChartContainer>

      {/* Token Usage */}
      <ChartContainer
        title="Token Usage"
        description="Track input, output, and total token consumption"
      >
        <div className="space-y-4">
          <TimePeriodTabs period={timePeriod} onChange={setTimePeriod} />
          <div className="w-full h-80">
            {timePeriod === "hourly" ? (
              <Line
                data={filteredAnalytics.tokenUsageHourlyConfig.data}
                options={filteredAnalytics.tokenUsageHourlyConfig.options}
              />
            ) : (
              <Line
                data={filteredAnalytics.tokenUsageDailyConfig.data}
                options={filteredAnalytics.tokenUsageDailyConfig.options}
              />
            )}
          </div>
        </div>
      </ChartContainer>

      {/* Latency Performance */}
      <ChartContainer
        title="Latency Performance"
        description="Monitor response times and peak latency"
      >
        <div className="space-y-4">
          <TimePeriodTabs period={timePeriod} onChange={setTimePeriod} />
          <div className="w-full h-80">
            {timePeriod === "hourly" ? (
              <Line
                data={filteredAnalytics.latencyPerformanceHourlyConfig.data}
                options={filteredAnalytics.latencyPerformanceHourlyConfig.options}
              />
            ) : (
              <Line
                data={filteredAnalytics.latencyPerformanceDailyConfig.data}
                options={filteredAnalytics.latencyPerformanceDailyConfig.options}
              />
            )}
          </div>
        </div>
      </ChartContainer>

      {/* Event Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Event Distribution"
          description="Breakdown of successful requests, errors, timeouts, and rate limits"
        >
          <div className="w-full h-80">
            <Doughnut
              data={filteredAnalytics.eventDistributionConfig.data}
              options={filteredAnalytics.eventDistributionConfig.options}
            />
          </div>
        </ChartContainer>

        <ChartContainer
          title="Success Rate"
          description="Percentage of successful vs failed requests"
        >
          <div className="w-full h-80">
            <Bar
              data={filteredAnalytics.successRateConfig.data}
              options={filteredAnalytics.successRateConfig.options}
            />
          </div>
        </ChartContainer>
      </div>

      {/* Model Usage */}
      <ChartContainer
        title="Model Usage"
        description="Request distribution across different AI models"
      >
        <div className="w-full h-80">
          <Bar
            data={filteredAnalytics.modelUsageConfig.data}
            options={filteredAnalytics.modelUsageConfig.options}
          />
        </div>
      </ChartContainer>

      {/* Token Usage by Model */}
      <ChartContainer
        title="Token Usage by Model"
        description="Token consumption breakdown for each model"
      >
        <div className="w-full h-80">
          <Bar
            data={filteredAnalytics.tokenUsageByModelConfig.data}
            options={filteredAnalytics.tokenUsageByModelConfig.options}
          />
        </div>
      </ChartContainer>

      {/* Plan Distribution */}
      {filteredAnalytics.planMetrics.length > 0 && (
        <ChartContainer
          title="Plan Distribution"
          description="Request distribution between free and pro plans"
        >
          <div className="w-full h-80">
            <Pie
              data={filteredAnalytics.planDistributionConfig.data}
              options={filteredAnalytics.planDistributionConfig.options}
            />
          </div>
        </ChartContainer>
      )}

      {/* Region Distribution */}
      {filteredAnalytics.regionMetrics.length > 0 && (
        <ChartContainer
          title="Region Distribution"
          description="Request volume by geographical region"
        >
          <div className="w-full h-80">
            <Bar
              data={filteredAnalytics.regionDistributionConfig.data}
              options={filteredAnalytics.regionDistributionConfig.options}
            />
          </div>
        </ChartContainer>
      )}

      {/* Peak Usage Metrics */}
      {filteredAnalytics.peakHour && filteredAnalytics.peakDay && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            label="Peak Usage Hour"
            value={filteredAnalytics.peakHour.label}
            subtext={`${filteredAnalytics.peakHour.value} requests (${filteredAnalytics.peakHour.percentage.toFixed(1)}%)`}
          />
          <MetricCard
            label="Peak Usage Day"
            value={filteredAnalytics.peakDay.label}
            subtext={`${filteredAnalytics.peakDay.value} requests (${filteredAnalytics.peakDay.percentage.toFixed(1)}%)`}
          />
        </div>
      )}

      {/* Detailed Metrics Tables */}
      {filteredAnalytics.modelMetrics.length > 0 && (
        <ChartContainer title="Model Metrics" description="Detailed performance by model">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border dark:border-slate-700">
                <tr className="bg-muted/50 dark:bg-slate-800">
                  <th className="px-4 py-2 text-left font-medium text-foreground dark:text-slate-200">
                    Model
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-foreground dark:text-slate-200">
                    Requests
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-foreground dark:text-slate-200">
                    Tokens
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-foreground dark:text-slate-200">
                    Avg Latency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-700">
                {filteredAnalytics.modelMetrics.map((model) => (
                  <tr
                    key={model.model}
                    className="hover:bg-muted/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground dark:text-slate-100">
                      {model.model}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground dark:text-slate-100">
                      {model.requestCount}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground dark:text-slate-100">
                      {model.totalToken.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground dark:text-slate-100">
                      {model.averageLatency.toFixed(2)}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartContainer>
      )}
    </div>
  );
};
