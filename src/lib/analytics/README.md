/**
 * Analytics System Documentation
 * 
 * This file contains complete examples and usage patterns for the analytics system.
 * This is reference documentation - not actual code.
 */

/**
 * ============================================================================
 * DATA AGGREGATION FUNCTIONS
 * ============================================================================
 */

/**
 * HOURLY/DAILY GROUPING
 * 
 * Group raw records by time period, returning arrays with timestamps and counts.
 * Automatically fills in missing hours/days with 0 values for continuous charts.
 * 
 * Usage:
 * 
 *   import { groupByHour, groupByDay } from '@/lib/analytics/aggregation';
 *   
 *   const hourlyData = groupByHour(analyticsRecords);
 *   // Returns: [
 *   //   { timestamp: "00:00", value: 42, date: Date },
 *   //   { timestamp: "01:00", value: 38, date: Date },
 *   //   ...
 *   // ]
 *   
 *   const dailyData = groupByDay(analyticsRecords);
 *   // Returns: [
 *   //   { timestamp: "2024-01-14", value: 512, date: Date },
 *   //   { timestamp: "2024-01-15", value: 623, date: Date },
 *   //   ...
 *   // ]
 */

/**
 * TOKEN AGGREGATION
 * 
 * Sum token usage (in, out, total) over time periods.
 * 
 * Usage:
 * 
 *   import {
 *     aggregateTokensByHour,
 *     aggregateTokensByDay
 *   } from '@/lib/analytics/aggregation';
 *   
 *   const hourlyTokens = aggregateTokensByHour(records);
 *   // Returns: [
 *   //   {
 *   //     timestamp: "00:00",
 *   //     tokenIn: 1250,
 *   //     tokenOut: 3420,
 *   //     totalToken: 4670
 *   //   },
 *   //   ...
 *   // ]
 */

/**
 * LATENCY CALCULATION
 * 
 * Calculate average, min, and max latency per time bucket.
 * 
 * Usage:
 * 
 *   import {
 *     calculateAverageLatencyByHour,
 *     calculateAverageLatencyByDay
 *   } from '@/lib/analytics/aggregation';
 *   
 *   const hourlyLatency = calculateAverageLatencyByHour(records);
 *   // Returns: [
 *   //   {
 *   //     timestamp: "00:00",
 *   //     averageLatency: 145.3,
 *   //     maxLatency: 2341,
 *   //     minLatency: 23
 *   //   },
 *   //   ...
 *   // ]
 */

/**
 * EVENT METRICS
 * 
 * Calculate distribution of event types and success rate.
 * 
 * Usage:
 * 
 *   import { calculateEventMetrics } from '@/lib/analytics/aggregation';
 *   
 *   const metrics = calculateEventMetrics(records);
 *   // Returns: {
 *   //   requests: 1024,
 *   //   errors: 12,
 *   //   timeouts: 3,
 *   //   rateLimitHits: 1,
 *   //   successRate: 98.4
 *   // }
 */

/**
 * MODEL USAGE BREAKDOWN
 * 
 * Aggregate requests and tokens per model.
 * 
 * Usage:
 * 
 *   import { aggregateModelUsage } from '@/lib/analytics/aggregation';
 *   
 *   const models = aggregateModelUsage(records);
 *   // Returns: [
 *   //   {
 *   //     model: "gpt-4",
 *   //     requestCount: 512,
 *   //     tokenIn: 45000,
 *   //     tokenOut: 125000,
 *   //     totalToken: 170000,
 *   //     averageLatency: 234.5
 *   //   },
 *   //   ...
 *   // ]
 */

/**
 * PLAN & REGION METRICS
 * 
 * Segment requests by plan or region.
 * 
 * Usage:
 * 
 *   import {
 *     aggregatePlanMetrics,
 *     aggregateRegionMetrics
 *   } from '@/lib/analytics/aggregation';
 *   
 *   const plans = aggregatePlanMetrics(records);
 *   // Returns: [
 *   //   { plan: "pro", requests: 750, percentage: 75 },
 *   //   { plan: "free", requests: 250, percentage: 25 }
 *   // ]
 */

/**
 * PEAK USAGE
 * 
 * Find the busiest hour or day.
 * 
 * Usage:
 * 
 *   import {
 *     getPeakUsageHourInDay,
 *     getPeakUsageDayInWeek
 *   } from '@/lib/analytics/aggregation';
 *   
 *   const peakHour = getPeakUsageHourInDay(records);
 *   // Returns: { label: "14:00", value: 256, percentage: 12.5 }
 */

/**
 * FILTERING
 * 
 * Filter records by various criteria for detailed analysis.
 * 
 * Usage:
 * 
 *   import {
 *     filterRecordsByModel,
 *     filterRecordsByPlan,
 *     filterRecordsByRegion,
 *     filterRecordsByEventType,
 *     filterRecordsByDateRange
 *   } from '@/lib/analytics/aggregation';
 *   
 *   const gpt4Records = filterRecordsByModel(records, "gpt-4");
 *   const proRecords = filterRecordsByPlan(records, "pro");
 *   const usRecords = filterRecordsByRegion(records, "us-east-1");
 *   const errors = filterRecordsByEventType(records, "error");
 *   
 *   const yesterday = new Date();
 *   yesterday.setDate(yesterday.getDate() - 1);
 *   const todayRecords = filterRecordsByDateRange(
 *     records,
 *     yesterday,
 *     new Date()
 *   );
 */

/**
 * ============================================================================
 * CHART CONFIGURATIONS
 * ============================================================================
 */

/**
 * REQUESTS OVER TIME CHARTS
 * 
 * Line charts showing request volume trends.
 * Automatically adapts colors to dark/light mode.
 * 
 * Usage:
 * 
 *   import {
 *     createRequestsOverTimeHourlyConfig,
 *     createRequestsOverTimeDailyConfig
 *   } from '@/lib/analytics/chartConfigs';
 *   
 *   const data = groupByHour(records);
 *   const config = createRequestsOverTimeHourlyConfig(data, isDarkMode);
 *   
 *   // Use with react-chartjs-2:
 *   <Line data={config.data} options={config.options} />
 */

/**
 * TOKEN USAGE CHART
 * 
 * Multi-line chart showing token in/out/total trends.
 * 
 * Usage:
 * 
 *   import { createTokenUsageConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const tokenData = aggregateTokensByHour(records);
 *   const config = createTokenUsageConfig(tokenData, isDarkMode);
 *   
 *   <Line data={config.data} options={config.options} />
 */

/**
 * LATENCY PERFORMANCE CHART
 * 
 * Shows average and max latency over time.
 * 
 * Usage:
 * 
 *   import { createLatencyPerformanceConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const latencyData = calculateAverageLatencyByHour(records);
 *   const config = createLatencyPerformanceConfig(latencyData, isDarkMode);
 *   
 *   <Line data={config.data} options={config.options} />
 */

/**
 * EVENT DISTRIBUTION - DOUGHNUT CHART
 * 
 * Shows breakdown of request types.
 * 
 * Usage:
 * 
 *   import { createEventDistributionConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const metrics = calculateEventMetrics(records);
 *   const config = createEventDistributionConfig(metrics, isDarkMode);
 *   
 *   <Doughnut data={config.data} options={config.options} />
 */

/**
 * MODEL USAGE - HORIZONTAL BAR CHART
 * 
 * Compare request counts across models.
 * 
 * Usage:
 * 
 *   import { createModelUsageConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const models = aggregateModelUsage(records);
 *   const config = createModelUsageConfig(models, isDarkMode);
 *   
 *   <Bar data={config.data} options={config.options} />
 */

/**
 * TOKEN USAGE BY MODEL - GROUPED BAR CHART
 * 
 * Compare token consumption across models.
 * 
 * Usage:
 * 
 *   import { createTokenUsageByModelConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const models = aggregateModelUsage(records);
 *   const config = createTokenUsageByModelConfig(models, isDarkMode);
 *   
 *   <Bar data={config.data} options={config.options} />
 */

/**
 * PLAN DISTRIBUTION - PIE CHART
 * 
 * Shows free vs pro plan usage breakdown.
 * 
 * Usage:
 * 
 *   import { createPlanDistributionConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const plans = aggregatePlanMetrics(records);
 *   const config = createPlanDistributionConfig(plans, isDarkMode);
 *   
 *   <Pie data={config.data} options={config.options} />
 */

/**
 * REGION DISTRIBUTION - HORIZONTAL BAR CHART
 * 
 * Compare requests by region.
 * 
 * Usage:
 * 
 *   import { createRegionDistributionConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const regions = aggregateRegionMetrics(records);
 *   const config = createRegionDistributionConfig(regions, isDarkMode);
 *   
 *   <Bar data={config.data} options={config.options} />
 */

/**
 * SUCCESS RATE - STACKED BAR CHART
 * 
 * Shows percentage breakdown of successes vs failures.
 * 
 * Usage:
 * 
 *   import { createSuccessRateConfig } from '@/lib/analytics/chartConfigs';
 *   
 *   const metrics = calculateEventMetrics(records);
 *   const config = createSuccessRateConfig(metrics.successRate, isDarkMode);
 *   
 *   <Bar data={config.data} options={config.options} />
 */

/**
 * ============================================================================
 * HOOKS - USEANALYTICS
 * ============================================================================
 */

/**
 * USE ANALYTICS HOOK
 * 
 * Main hook for processing analytics data and generating all chart configs.
 * Returns pre-computed data and chart configurations ready for rendering.
 * 
 * Usage:
 * 
 *   import { useAnalytics } from '@/lib/analytics/useAnalytics';
 *   
 *   export function MyComponent() {
 *     const analytics = useAnalytics(analyticsRecords);
 *     
 *     return (
 *       <>
 *         <Line data={analytics.requestsOverTimeHourlyConfig.data} />
 *         <Bar data={analytics.modelUsageConfig.data} />
 *         <Doughnut data={analytics.eventDistributionConfig.data} />
 *       </>
 *     );
 *   }
 * 
 * Returns:
 *   - rawData: Original analytics records
 *   - loading: Loading state (for fetching)
 *   - error: Error message if data fetch fails
 *   - isDark: Current theme mode
 *   
 *   - requestsHourly: Grouped by hour
 *   - requestsDaily: Grouped by day
 *   - tokensHourly: Token data by hour
 *   - tokensDaily: Token data by day
 *   - latencyHourly: Latency data by hour
 *   - latencyDaily: Latency data by day
 *   
 *   - eventMetrics: Aggregated event counts
 *   - modelMetrics: Per-model breakdown
 *   - planMetrics: Free vs pro breakdown
 *   - regionMetrics: Regional breakdown
 *   - peakHour: Highest request hour
 *   - peakDay: Highest request day
 *   
 *   - requestsOverTimeHourlyConfig: Ready-to-use chart config
 *   - requestsOverTimeDailyConfig: Ready-to-use chart config
 *   - tokenUsageHourlyConfig: Ready-to-use chart config
 *   - tokenUsageDailyConfig: Ready-to-use chart config
 *   - latencyPerformanceHourlyConfig: Ready-to-use chart config
 *   - latencyPerformanceDailyConfig: Ready-to-use chart config
 *   - eventDistributionConfig: Ready-to-use chart config
 *   - modelUsageConfig: Ready-to-use chart config
 *   - tokenUsageByModelConfig: Ready-to-use chart config
 *   - planDistributionConfig: Ready-to-use chart config
 *   - regionDistributionConfig: Ready-to-use chart config
 *   - successRateConfig: Ready-to-use chart config
 *   
 *   - filterByDateRange(startDate, endDate): Update filtered data
 *   - filterByEventType(type): Filter by event type
 *   - filterByModel(modelName): Filter by model
 *   - filterByPlan(plan): Filter by plan
 *   - filterByRegion(region): Filter by region
 *   - resetFilters(): Clear all filters
 */

/**
 * USE FETCH ANALYTICS DATA HOOK
 * 
 * Fetches analytics data from your backend API.
 * Handles loading and error states.
 * 
 * Usage:
 * 
 *   import { useFetchAnalyticsData } from '@/lib/analytics/useAnalytics';
 *   
 *   export function MyComponent() {
 *     const { data, loading, error } = useFetchAnalyticsData(botId);
 *     const analytics = useAnalytics(data);
 *     
 *     if (loading) return <Spinner />;
 *     if (error) return <Error message={error} />;
 *     
 *     return <AnalyticsCharts data={data} />;
 *   }
 * 
 * API Endpoint Expected:
 *   GET /api/analytics/[botId]
 *   
 * Response Format:
 *   {
 *     "data": [AnalyticsRecord, AnalyticsRecord, ...]
 *   }
 *   or simply an array: [AnalyticsRecord, AnalyticsRecord, ...]
 */

/**
 * USE ANALYTICS FILTERS HOOK
 * 
 * Advanced filtering with state management.
 * Combines multiple filters together.
 * 
 * Usage:
 * 
 *   import { useAnalyticsFilters } from '@/lib/analytics/useAnalytics';
 *   
 *   export function MyComponent() {
 *     const {
 *       filteredData,
 *       activeFilters,
 *       updateFilter,
 *       resetAllFilters
 *     } = useAnalyticsFilters(analyticsRecords);
 *     
 *     // Update individual filters
 *     updateFilter('model', 'gpt-4');
 *     updateFilter('plan', 'pro');
 *     
 *     // Check active filters
 *     if (activeFilters.model === 'gpt-4') {
 *       console.log('Filtering by gpt-4');
 *     }
 *     
 *     // Reset filters
 *     resetAllFilters();
 *     
 *     return <AnalyticsCharts data={filteredData} />;
 *   }
 */

/**
 * ============================================================================
 * COMPONENT - ANALYTICS CHARTS
 * ============================================================================
 */

/**
 * ANALYTICS CHARTS COMPONENT
 * 
 * Complete analytics dashboard with all charts and metrics.
 * Automatically supports dark/light mode.
 * Includes time period switcher (hourly/daily).
 * 
 * Usage:
 * 
 *   import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
 *   
 *   export default function Page() {
 *     const { data } = useFetchAnalyticsData(botId);
 *     
 *     return (
 *       <AnalyticsCharts
 *         data={data}
 *         loading={loading}
 *         error={error}
 *       />
 *     );
 *   }
 * 
 * Props:
 *   - data: AnalyticsRecord[] - Raw analytics records
 *   - loading?: boolean - Show loading spinner
 *   - error?: string | null - Show error message
 * 
 * Renders:
 *   - Key metrics cards (total requests, errors, tokens, latency)
 *   - Requests over time (hourly/daily toggle)
 *   - Token usage trends
 *   - Latency performance
 *   - Event distribution (doughnut)
 *   - Success rate (bar)
 *   - Model usage breakdown
 *   - Token usage by model
 *   - Plan distribution (pie)
 *   - Region distribution (bar)
 *   - Peak usage metrics
 *   - Detailed model metrics table
 */

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

/**
 * ANALYTICS RECORD
 * 
 * Raw backend record structure (matches MongoDB schema).
 * 
 * Structure:
 *   {
 *     botId: string;
 *     apiHashKey: string;
 *     timestamp: string | number; // ISO string or Unix timestamp
 *     eventType: "request" | "error" | "timeout" | "limitHit";
 *     usage: {
 *       model: string;
 *       tokenIn: number;
 *       tokenOut: number;
 *       totalToken: number;
 *     };
 *     performance: {
 *       latency: number; // milliseconds
 *     };
 *     context: {
 *       plan: "free" | "pro";
 *       region: string;
 *     };
 *   }
 */

/**
 * ============================================================================
 * EXAMPLE: COMPLETE ANALYTICS PAGE
 * ============================================================================
 */

/**
 * Complete example of implementing an analytics page:
 * 
 *   import React from 'react';
 *   import { useFetchAnalyticsData } from '@/lib/analytics/useAnalytics';
 *   import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
 *   import { Spinner } from '@/components/ui/spinner';
 *   
 *   export default function AnalyticsPage() {
 *     const params = useParams();
 *     const botId = params.id as string;
 *     
 *     const { data, loading, error } = useFetchAnalyticsData(botId);
 *     
 *     return (
 *       <div className="min-h-screen bg-background">
 *         <div className="container mx-auto px-4 py-8">
 *           <h1 className="text-3xl font-bold mb-4">Bot Analytics</h1>
 *           
 *           {loading && (
 *             <div className="flex items-center justify-center h-64">
 *               <Spinner />
 *             </div>
 *           )}
 *           
 *           {error && (
 *             <div className="rounded-lg border border-red-500 bg-red-50 p-4">
 *               <p className="text-red-700">{error}</p>
 *             </div>
 *           )}
 *           
 *           {!loading && !error && (
 *             <AnalyticsCharts data={data} />
 *           )}
 *         </div>
 *       </div>
 *     );
 *   }
 */

/**
 * ============================================================================
 * PERFORMANCE TIPS
 * ============================================================================
 */

/**
 * 1. MEMOIZATION
 *    Wrap chart components with React.memo to prevent unnecessary re-renders
 * 
 *    export const MyChart = React.memo(({ config }) => {
 *      return <Line data={config.data} options={config.options} />;
 *    });
 * 
 * 2. PAGINATION
 *    For very large datasets (100k+ records), consider pagination:
 * 
 *    const [page, setPage] = useState(0);
 *    const pageSize = 10000;
 *    const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);
 * 
 * 3. LAZY LOADING
 *    Load charts dynamically as they come into view using Intersection Observer
 * 
 * 4. BACKEND AGGREGATION
 *    For extremely large datasets, pre-aggregate on backend:
 *    Instead of: /api/analytics/botId (all records)
 *    Use: /api/analytics/botId?aggregation=hourly (pre-aggregated)
 * 
 * 5. CACHING
 *    Cache aggregated results to avoid recalculation:
 * 
 *    const [cache, setCache] = useState({});
 *    const key = `${botId}_${period}`;
 *    if (cache[key]) return cache[key];
 */

/**
 * ============================================================================
 * DARK/LIGHT MODE SUPPORT
 * ============================================================================
 */

/**
 * The entire system automatically adapts to dark/light mode using next-themes.
 * 
 * Chart colors are automatically adjusted based on theme:
 * 
 *   Light mode:
 *     - Primary: #2563eb (blue)
 *     - Text: #1e293b (dark slate)
 *     - Background: white
 *   
 *   Dark mode:
 *     - Primary: #3b82f6 (lighter blue)
 *     - Text: #f1f5f9 (light slate)
 *     - Background: #1e293b (dark slate)
 * 
 * Get current theme in components:
 * 
 *   import { useTheme } from 'next-themes';
 *   
 *   export function MyComponent() {
 *     const { theme } = useTheme();
 *     const isDark = theme === 'dark';
 *     // Use isDark to customize rendering
 *   }
 */
