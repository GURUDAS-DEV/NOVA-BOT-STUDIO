/**
 * useAnalytics Hook
 * Provides reusable analytics processing and chart configuration logic
 */

"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  AnalyticsRecord,
  EventType,
  ChartConfig,
  EventMetrics,
  ModelUsageMetrics,
  TimeSeriesDataPoint,
  TokenMetrics,
  LatencyMetrics,
  PlanMetrics,
  RegionMetrics,
  PeakUsageMetrics,
} from "@/lib/Types/analytics";
import {
  groupByHour,
  groupByDay,
  aggregateTokensByHour,
  aggregateTokensByDay,
  calculateAverageLatencyByHour,
  calculateAverageLatencyByDay,
  calculateEventMetrics,
  aggregateModelUsage,
  aggregatePlanMetrics,
  aggregateRegionMetrics,
  getPeakUsageHourInDay,
  getPeakUsageDayInWeek,
  filterRecordsByDateRange,
  filterRecordsByEventType,
  filterRecordsByModel,
  filterRecordsByPlan,
  filterRecordsByRegion,
} from "./aggregation";
import {
  createRequestsOverTimeHourlyConfig,
  createRequestsOverTimeDailyConfig,
  createTokenUsageConfig,
  createLatencyPerformanceConfig,
  createEventDistributionConfig,
  createModelUsageConfig,
  createTokenUsageByModelConfig,
  createPlanDistributionConfig,
  createRegionDistributionConfig,
  createSuccessRateConfig,
} from "./chartConfigs";

export interface AnalyticsHookReturn {
  // Raw data
  rawData: AnalyticsRecord[];
  loading: boolean;
  error: string | null;

  // Theme
  isDark: boolean;

  // Time series data
  requestsHourly: TimeSeriesDataPoint[];
  requestsDaily: TimeSeriesDataPoint[];
  tokensHourly: TokenMetrics[];
  tokensDaily: TokenMetrics[];
  latencyHourly: LatencyMetrics[];
  latencyDaily: LatencyMetrics[];

  // Aggregated metrics
  eventMetrics: EventMetrics;
  modelMetrics: ModelUsageMetrics[];
  planMetrics: PlanMetrics[];
  regionMetrics: RegionMetrics[];
  peakHour: PeakUsageMetrics | null;
  peakDay: PeakUsageMetrics | null;

  // Chart configurations
  requestsOverTimeHourlyConfig: ChartConfig;
  requestsOverTimeDailyConfig: ChartConfig;
  tokenUsageHourlyConfig: ChartConfig;
  tokenUsageDailyConfig: ChartConfig;
  latencyPerformanceHourlyConfig: ChartConfig;
  latencyPerformanceDailyConfig: ChartConfig;
  eventDistributionConfig: ChartConfig;
  modelUsageConfig: ChartConfig;
  tokenUsageByModelConfig: ChartConfig;
  planDistributionConfig: ChartConfig;
  regionDistributionConfig: ChartConfig;
  successRateConfig: ChartConfig;

  // Filtering functions
  filterByDateRange: (startDate: Date, endDate: Date) => void;
  filterByEventType: (eventType: EventType) => void;
  filterByModel: (model: string) => void;
  filterByPlan: (plan: "free" | "pro") => void;
  filterByRegion: (region: string) => void;
  resetFilters: () => void;
}

/**
 * Main analytics hook
 * Processes raw analytics data and generates all chart configurations
 */
export const useAnalytics = (data: AnalyticsRecord[] = []): AnalyticsHookReturn => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "system";

  // Use the provided data directly for processing
  const filteredData = [...data];

  // Process time series data
  const requestsHourly = groupByHour(filteredData);
  const requestsDaily = groupByDay(filteredData);
  const tokensHourly = aggregateTokensByHour(filteredData);
  const tokensDaily = aggregateTokensByDay(filteredData);
  const latencyHourly = calculateAverageLatencyByHour(filteredData);
  const latencyDaily = calculateAverageLatencyByDay(filteredData);

  // Calculate aggregated metrics
  const eventMetrics = calculateEventMetrics(filteredData);
  const modelMetrics = aggregateModelUsage(filteredData);
  const planMetrics = aggregatePlanMetrics(filteredData);
  const regionMetrics = aggregateRegionMetrics(filteredData);
  const peakHour = filteredData.length > 0 ? getPeakUsageHourInDay(filteredData) : null;
  const peakDay = filteredData.length > 0 ? getPeakUsageDayInWeek(filteredData) : null;

  // Generate chart configurations
  const requestsOverTimeHourlyConfig = createRequestsOverTimeHourlyConfig(
    requestsHourly,
    isDark
  );
  const requestsOverTimeDailyConfig = createRequestsOverTimeDailyConfig(
    requestsDaily,
    isDark
  );
  const tokenUsageHourlyConfig = createTokenUsageConfig(tokensHourly, isDark);
  const tokenUsageDailyConfig = createTokenUsageConfig(tokensDaily, isDark);
  const latencyPerformanceHourlyConfig = createLatencyPerformanceConfig(
    latencyHourly,
    isDark
  );
  const latencyPerformanceDailyConfig = createLatencyPerformanceConfig(
    latencyDaily,
    isDark
  );
  const eventDistributionConfig = createEventDistributionConfig(eventMetrics, isDark);
  const modelUsageConfig = createModelUsageConfig(modelMetrics, isDark);
  const tokenUsageByModelConfig = createTokenUsageByModelConfig(modelMetrics, isDark);
  const planDistributionConfig = createPlanDistributionConfig(planMetrics, isDark);
  const regionDistributionConfig = createRegionDistributionConfig(regionMetrics, isDark);
  const successRateConfig = createSuccessRateConfig(eventMetrics.successRate, isDark);

  // Filter functions (return new filtered data without reassignment)
  const filterByDateRange = (startDate: Date, endDate: Date) => {
    return filterRecordsByDateRange(filteredData, startDate, endDate);
  };

  const filterByEventType = (eventType: EventType) => {
    return filterRecordsByEventType(filteredData, eventType);
  };

  const filterByModel = (model: string) => {
    return filterRecordsByModel(filteredData, model);
  };

  const filterByPlan = (plan: "free" | "pro") => {
    return filterRecordsByPlan(filteredData, plan);
  };

  const filterByRegion = (region: string) => {
    return filterRecordsByRegion(filteredData, region);
  };

  const resetFilters = () => {
    return [...data];
  };

  return {
    // Raw data
    rawData: data,
    loading: false,
    error: null,

    // Theme
    isDark,

    // Time series data
    requestsHourly,
    requestsDaily,
    tokensHourly,
    tokensDaily,
    latencyHourly,
    latencyDaily,

    // Aggregated metrics
    eventMetrics,
    modelMetrics,
    planMetrics,
    regionMetrics,
    peakHour,
    peakDay,

    // Chart configurations
    requestsOverTimeHourlyConfig,
    requestsOverTimeDailyConfig,
    tokenUsageHourlyConfig,
    tokenUsageDailyConfig,
    latencyPerformanceHourlyConfig,
    latencyPerformanceDailyConfig,
    eventDistributionConfig,
    modelUsageConfig,
    tokenUsageByModelConfig,
    planDistributionConfig,
    regionDistributionConfig,
    successRateConfig,

    // Filtering functions
    filterByDateRange,
    filterByEventType,
    filterByModel,
    filterByPlan,
    filterByRegion,
    resetFilters,
  };
};

/**
 * Hook for fetching analytics data from API
 * Replace endpoint with your actual backend endpoint
 */
export const useFetchAnalyticsData = (botId: string | undefined) => {
  const [data, setData] = React.useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!botId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/analytics/${botId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch analytics: ${response.statusText}`);
        }

        const result = await response.json();
        setData(Array.isArray(result) ? result : result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [botId]);

  return { data, loading, error };
};

/**
 * Advanced filtering hook with state management
 * Use this in components that need dynamic filtering
 */
export const useAnalyticsFilters = (initialData: AnalyticsRecord[]) => {
  const [filteredData, setFilteredData] = React.useState<AnalyticsRecord[]>(initialData);
  const [activeFilters, setActiveFilters] = React.useState({
    eventType: null as EventType | null,
    model: null as string | null,
    plan: null as ("free" | "pro") | null,
    region: null as string | null,
  });

  React.useEffect(() => {
    let result = [...initialData];

    if (activeFilters.eventType) {
      result = filterRecordsByEventType(result, activeFilters.eventType);
    }
    if (activeFilters.model) {
      result = filterRecordsByModel(result, activeFilters.model);
    }
    if (activeFilters.plan) {
      result = filterRecordsByPlan(result, activeFilters.plan);
    }
    if (activeFilters.region) {
      result = filterRecordsByRegion(result, activeFilters.region);
    }

    setFilteredData(result);
  }, [initialData, activeFilters]);

  const updateFilter = React.useCallback(
    (filterName: keyof typeof activeFilters, value: string) => {
      setActiveFilters((prev) => {
        const currentValue = prev[filterName];
        return {
          ...prev,
          [filterName]: currentValue === value ? null : value,
        };
      });
    },
    []
  );

  const resetAllFilters = React.useCallback(() => {
    setActiveFilters({
      eventType: null,
      model: null,
      plan: null,
      region: null,
    });
  }, []);

  return {
    filteredData,
    activeFilters,
    updateFilter,
    resetAllFilters,
  };
};
