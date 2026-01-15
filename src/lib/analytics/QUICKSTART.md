/**
 * QUICK START GUIDE - Analytics System
 * 
 * This guide walks through implementing the analytics system in your application.
 */

/**
 * STEP 1: INSTALL DEPENDENCIES
 * 
 * Already done in package.json:
 * - chart.js@^4.4.1
 * - react-chartjs-2@^5.2.0
 * 
 * These are already added. If you haven't installed yet, run:
 * npm install
 * or
 * yarn install
 */

/**
 * STEP 2: CREATE API ENDPOINT
 * 
 * Create: src/app/api/analytics/[botId]/route.ts
 * 
 * Example:
 * 
 *   import { NextRequest, NextResponse } from 'next/server';
 *   import { verifyAuth } from '@/lib/auth';
 *   import { db } from '@/lib/db';
 *   
 *   export async function GET(
 *     request: NextRequest,
 *     { params }: { params: { botId: string } }
 *   ) {
 *     const user = await verifyAuth(request);
 *     if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *     
 *     // Fetch from MongoDB
 *     const records = await db.collection('analytics')
 *       .find({ botId: params.botId })
 *       .limit(100000)
 *       .toArray();
 *     
 *     return NextResponse.json(records);
 *   }
 * 
 * See src/lib/analytics/API_EXAMPLE.ts for more details
 */

/**
 * STEP 3: USE IN YOUR PAGE
 * 
 * The Bot-Analytics page is already set up, but here's how to use it elsewhere:
 * 
 *   "use client";
 *   
 *   import { useFetchAnalyticsData } from '@/lib/analytics/useAnalytics';
 *   import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
 *   import { Spinner } from '@/components/ui/spinner';
 *   
 *   export default function Page() {
 *     const botId = "your-bot-id";
 *     const { data, loading, error } = useFetchAnalyticsData(botId);
 *     
 *     return (
 *       <div>
 *         {loading && <Spinner />}
 *         {error && <div>Error: {error}</div>}
 *         {!loading && !error && <AnalyticsCharts data={data} />}
 *       </div>
 *     );
 *   }
 */

/**
 * STEP 4: USE INDIVIDUAL COMPONENTS
 * 
 * For more granular control, use the hook directly:
 * 
 *   "use client";
 *   
 *   import { Line, Bar } from 'react-chartjs-2';
 *   import { useAnalytics, useFetchAnalyticsData } from '@/lib/analytics/useAnalytics';
 *   import {
 *     Chart as ChartJS,
 *     CategoryScale,
 *     LinearScale,
 *     PointElement,
 *     LineElement,
 *     BarElement,
 *     Title,
 *     Tooltip,
 *     Legend,
 *     Filler
 *   } from 'chart.js';
 *   
 *   ChartJS.register(
 *     CategoryScale,
 *     LinearScale,
 *     PointElement,
 *     LineElement,
 *     BarElement,
 *     Title,
 *     Tooltip,
 *     Legend,
 *     Filler
 *   );
 *   
 *   export default function Page() {
 *     const { data } = useFetchAnalyticsData("bot-id");
 *     const analytics = useAnalytics(data);
 *     
 *     return (
 *       <>
 *         <h1>Total Requests: {analytics.eventMetrics.requests}</h1>
 *         <Line data={analytics.requestsOverTimeHourlyConfig.data} />
 *         <Bar data={analytics.modelUsageConfig.data} />
 *       </>
 *     );
 *   }
 */

/**
 * STEP 5: DARK MODE SUPPORT
 * 
 * Dark mode is automatic! Your app uses next-themes.
 * The analytics system automatically detects and applies correct colors.
 * 
 * No additional configuration needed.
 * 
 * To manually check theme:
 * 
 *   import { useTheme } from 'next-themes';
 *   
 *   export function Component() {
 *     const { theme } = useTheme();
 *     console.log(theme); // 'light', 'dark', or 'system'
 *   }
 */

/**
 * STEP 6: FILTERING DATA
 * 
 * Use the filtering hook for interactive filtering:
 * 
 *   "use client";
 *   
 *   import { useAnalyticsFilters } from '@/lib/analytics/useAnalytics';
 *   import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
 *   
 *   export function MyComponent({ data }) {
 *     const {
 *       filteredData,
 *       activeFilters,
 *       updateFilter,
 *       resetAllFilters
 *     } = useAnalyticsFilters(data);
 *     
 *     return (
 *       <>
 *         <button onClick={() => updateFilter('plan', 'pro')}>
 *           Pro Plan
 *         </button>
 *         <button onClick={resetAllFilters}>Clear Filters</button>
 *         <AnalyticsCharts data={filteredData} />
 *       </>
 *     );
 *   }
 */

/**
 * FILE STRUCTURE CREATED
 * 
 * src/lib/
 *   ├── Types/
 *   │   └── analytics.ts          # Type definitions
 *   └── analytics/
 *       ├── aggregation.ts        # Data processing functions
 *       ├── chartConfigs.ts       # Chart.js configurations
 *       ├── useAnalytics.ts       # React hooks
 *       ├── API_EXAMPLE.ts        # API implementation guide
 *       └── README.md             # Complete documentation
 * 
 * src/components/
 *   └── analytics/
 *       └── AnalyticsCharts.tsx   # Main component
 * 
 * src/app/(private)/home/Bot-Analytics/(id)/
 *   └── page.tsx                  # Analytics page (updated)
 */

/**
 * AVAILABLE FUNCTIONS IN AGGREGATION
 * 
 * Time Grouping:
 *   - groupByHour(records)
 *   - groupByDay(records)
 * 
 * Token Aggregation:
 *   - aggregateTokensByHour(records)
 *   - aggregateTokensByDay(records)
 * 
 * Latency Calculations:
 *   - calculateAverageLatencyByHour(records)
 *   - calculateAverageLatencyByDay(records)
 * 
 * Event Metrics:
 *   - calculateEventMetrics(records)
 * 
 * Breakdowns:
 *   - aggregateModelUsage(records)
 *   - aggregatePlanMetrics(records)
 *   - aggregateRegionMetrics(records)
 * 
 * Peak Usage:
 *   - getPeakUsageHourInDay(records)
 *   - getPeakUsageDayInWeek(records)
 * 
 * Filtering:
 *   - filterRecordsByDateRange(records, startDate, endDate)
 *   - filterRecordsByEventType(records, type)
 *   - filterRecordsByModel(records, model)
 *   - filterRecordsByPlan(records, plan)
 *   - filterRecordsByRegion(records, region)
 */

/**
 * AVAILABLE CHART CONFIGS
 * 
 * All chart configs handle dark/light mode automatically.
 * Import from src/lib/analytics/chartConfigs.ts
 * 
 * - createRequestsOverTimeHourlyConfig(data, isDark)
 * - createRequestsOverTimeDailyConfig(data, isDark)
 * - createTokenUsageConfig(data, isDark)
 * - createLatencyPerformanceConfig(data, isDark)
 * - createEventDistributionConfig(metrics, isDark)
 * - createModelUsageConfig(models, isDark)
 * - createTokenUsageByModelConfig(models, isDark)
 * - createPlanDistributionConfig(plans, isDark)
 * - createRegionDistributionConfig(regions, isDark)
 * - createSuccessRateConfig(successRate, isDark)
 */

/**
 * AVAILABLE HOOKS
 * 
 * useAnalytics(records)
 *   Main hook - processes all data and generates all chart configs
 * 
 * useFetchAnalyticsData(botId)
 *   Fetches data from API endpoint
 *   Returns: { data, loading, error }
 * 
 * useAnalyticsFilters(initialData)
 *   Advanced filtering with state
 *   Returns: { filteredData, activeFilters, updateFilter, resetAllFilters }
 */

/**
 * EXAMPLE: MINIMAL SETUP
 * 
 * 1. Create API endpoint at src/app/api/analytics/[botId]/route.ts
 * 
 * 2. Create a page with:
 * 
 *   "use client";
 *   import { useFetchAnalyticsData } from '@/lib/analytics/useAnalytics';
 *   import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
 *   
 *   export default function Page({ params }) {
 *     const { data, loading, error } = useFetchAnalyticsData(params.id);
 *     return <AnalyticsCharts data={data} loading={loading} error={error} />;
 *   }
 * 
 * That's it! Everything else is automatic.
 */

/**
 * PERFORMANCE CONSIDERATIONS
 * 
 * For optimal performance:
 * 
 * 1. Database Indexes
 *    CREATE INDEX on (botId, timestamp) for fast queries
 * 
 * 2. Pagination
 *    Limit results to last 30 days or 100k records
 * 
 * 3. Caching
 *    Cache results for 1-5 minutes using Redis
 * 
 * 4. Aggregation
 *    Pre-aggregate on backend if > 1M records
 * 
 * 5. Lazy Loading
 *    Load charts as they scroll into view
 */

/**
 * TROUBLESHOOTING
 * 
 * "No charts are showing"
 *   - Check API endpoint exists and returns data
 *   - Open browser console for errors
 *   - Verify data matches AnalyticsRecord type
 * 
 * "Charts look weird in dark mode"
 *   - Check useTheme() is working
 *   - Clear browser cache
 *   - Check next-themes is properly configured
 * 
 * "Data not updating"
 *   - Check API endpoint is returning fresh data
 *   - Add refetch button to manually trigger update
 *   - Check browser Network tab for API calls
 * 
 * "Performance issues with large datasets"
 *   - Reduce date range in API query
 *   - Implement backend aggregation
 *   - Use pagination
 *   - Add database indexes
 */

export const QUICK_START_COMPLETE = `
You're ready to go! 

1. Create your API endpoint
2. Visit /home/Bot-Analytics/[botId]
3. See all your analytics data with interactive charts

For detailed docs, see src/lib/analytics/README.md
`;
