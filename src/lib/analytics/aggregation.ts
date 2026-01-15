/**
 * Analytics Data Aggregation Functions
 * Process raw backend data into format suitable for Chart.js
 */

import {
  AnalyticsRecord,
  EventType,
  EventMetrics,
  ModelUsageMetrics,
  LatencyMetrics,
  TokenMetrics,
  PlanMetrics,
  RegionMetrics,
  PeakUsageMetrics,
  TimeSeriesDataPoint,
} from "@/lib/Types/analytics";

/**
 * Parse timestamp to Date object
 * Handles both ISO strings and Unix timestamps
 */
export const parseTimestamp = (timestamp: string | number): Date => {
  if (typeof timestamp === "string") {
    return new Date(timestamp);
  }
  return new Date(timestamp);
};

/**
 * Format date to HH:MM format
 */
export const formatTimeHourly = (date: Date): string => {
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Format date to YYYY-MM-DD format
 */
export const formatTimeDaily = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Group records by hour (last 24 hours)
 * Returns array with one entry per hour
 */
export const groupByHour = (records: AnalyticsRecord[]): TimeSeriesDataPoint[] => {
  const now = new Date();
  const hourMap: Map<string, number> = new Map();

  // Initialize all hours in the last 24 hours with 0
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeHourly(date);
    hourMap.set(key, 0);
  }

  // Count records by hour
  records.forEach((record) => {
    const date = parseTimestamp(record.timestamp);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeHourly(date);

    if (hourMap.has(key)) {
      hourMap.set(key, (hourMap.get(key) || 0) + 1);
    }
  });

  // Convert to sorted array
  return Array.from(hourMap.entries())
    .map(([timestamp, value]) => ({
      timestamp,
      value,
      date: parseTimestamp(timestamp),
    }))
    .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));
};

/**
 * Group records by day (last 7 days)
 * Returns array with one entry per day
 */
export const groupByDay = (records: AnalyticsRecord[]): TimeSeriesDataPoint[] => {
  const now = new Date();
  const dayMap: Map<string, number> = new Map();

  // Initialize all days in the last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeDaily(date);
    dayMap.set(key, 0);
  }

  // Count records by day
  records.forEach((record) => {
    const date = parseTimestamp(record.timestamp);
    const key = formatTimeDaily(date);

    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) || 0) + 1);
    }
  });

  // Convert to sorted array
  return Array.from(dayMap.entries())
    .map(([timestamp, value]) => ({
      timestamp,
      value,
      date: parseTimestamp(timestamp),
    }))
    .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));
};

/**
 * Aggregate token usage over time (hourly)
 */
export const aggregateTokensByHour = (records: AnalyticsRecord[]): TokenMetrics[] => {
  const now = new Date();
  const tokenMap: Map<string, TokenMetrics> = new Map();

  // Initialize all hours
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeHourly(date);
    tokenMap.set(key, {
      timestamp: key,
      tokenIn: 0,
      tokenOut: 0,
      totalToken: 0,
    });
  }

  // Aggregate tokens
  records.forEach((record) => {
    const date = parseTimestamp(record.timestamp);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeHourly(date);

    if (tokenMap.has(key)) {
      const current = tokenMap.get(key)!;
      current.tokenIn += record.usage.tokenIn;
      current.tokenOut += record.usage.tokenOut;
      current.totalToken += record.usage.totalToken;
    }
  });

  return Array.from(tokenMap.values()).sort(
    (a, b) =>
      parseTimestamp(a.timestamp).getTime() - parseTimestamp(b.timestamp).getTime()
  );
};

/**
 * Aggregate token usage over time (daily)
 */
export const aggregateTokensByDay = (records: AnalyticsRecord[]): TokenMetrics[] => {
  const now = new Date();
  const tokenMap: Map<string, TokenMetrics> = new Map();

  // Initialize all days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeDaily(date);
    tokenMap.set(key, {
      timestamp: key,
      tokenIn: 0,
      tokenOut: 0,
      totalToken: 0,
    });
  }

  // Aggregate tokens
  records.forEach((record) => {
    const date = parseTimestamp(record.timestamp);
    const key = formatTimeDaily(date);

    if (tokenMap.has(key)) {
      const current = tokenMap.get(key)!;
      current.tokenIn += record.usage.tokenIn;
      current.tokenOut += record.usage.tokenOut;
      current.totalToken += record.usage.totalToken;
    }
  });

  return Array.from(tokenMap.values()).sort(
    (a, b) =>
      parseTimestamp(a.timestamp).getTime() - parseTimestamp(b.timestamp).getTime()
  );
};

/**
 * Calculate average latency over time (hourly)
 */
export const calculateAverageLatencyByHour = (
  records: AnalyticsRecord[]
): LatencyMetrics[] => {
  const now = new Date();
  const latencyMap: Map<string, { sum: number; count: number; max: number; min: number }> =
    new Map();

  // Initialize all hours
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeHourly(date);
    latencyMap.set(key, { sum: 0, count: 0, max: 0, min: Infinity });
  }

  // Calculate latency metrics
  records.forEach((record) => {
    const date = parseTimestamp(record.timestamp);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeHourly(date);

    if (latencyMap.has(key)) {
      const current = latencyMap.get(key)!;
      current.sum += record.performance.latency;
      current.count++;
      current.max = Math.max(current.max, record.performance.latency);
      current.min = Math.min(current.min, record.performance.latency);
    }
  });

  // Convert to LatencyMetrics
  return Array.from(latencyMap.entries())
    .map(([timestamp, data]) => ({
      timestamp,
      averageLatency: data.count > 0 ? data.sum / data.count : 0,
      maxLatency: data.max === -Infinity ? 0 : data.max,
      minLatency: data.min === Infinity ? 0 : data.min,
    }))
    .sort(
      (a, b) =>
        parseTimestamp(a.timestamp).getTime() - parseTimestamp(b.timestamp).getTime()
    );
};

/**
 * Calculate average latency over time (daily)
 */
export const calculateAverageLatencyByDay = (
  records: AnalyticsRecord[]
): LatencyMetrics[] => {
  const now = new Date();
  const latencyMap: Map<string, { sum: number; count: number; max: number; min: number }> =
    new Map();

  // Initialize all days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const key = formatTimeDaily(date);
    latencyMap.set(key, { sum: 0, count: 0, max: 0, min: Infinity });
  }

  // Calculate latency metrics
  records.forEach((record) => {
    const date = parseTimestamp(record.timestamp);
    const key = formatTimeDaily(date);

    if (latencyMap.has(key)) {
      const current = latencyMap.get(key)!;
      current.sum += record.performance.latency;
      current.count++;
      current.max = Math.max(current.max, record.performance.latency);
      current.min = Math.min(current.min, record.performance.latency);
    }
  });

  // Convert to LatencyMetrics
  return Array.from(latencyMap.entries())
    .map(([timestamp, data]) => ({
      timestamp,
      averageLatency: data.count > 0 ? data.sum / data.count : 0,
      maxLatency: data.max === -Infinity ? 0 : data.max,
      minLatency: data.min === Infinity ? 0 : data.min,
    }))
    .sort(
      (a, b) =>
        parseTimestamp(a.timestamp).getTime() - parseTimestamp(b.timestamp).getTime()
    );
};

/**
 * Calculate event distribution metrics
 */
export const calculateEventMetrics = (records: AnalyticsRecord[]): EventMetrics => {
  const eventCounts: Record<EventType, number> = {
    request: 0,
    error: 0,
    timeout: 0,
    limitHit: 0,
  };

  records.forEach((record) => {
    eventCounts[record.eventType]++;
  });

  const totalRequests = records.length;
  const successfulRequests = eventCounts.request;
  const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

  return {
    requests: eventCounts.request,
    errors: eventCounts.error,
    timeouts: eventCounts.timeout,
    rateLimitHits: eventCounts.limitHit,
    successRate,
  };
};

/**
 * Calculate model usage breakdown
 */
export const aggregateModelUsage = (records: AnalyticsRecord[]): ModelUsageMetrics[] => {
  const modelMap: Map<string, ModelUsageMetrics> = new Map();

  records.forEach((record) => {
    const model = record.usage.model;

    if (!modelMap.has(model)) {
      modelMap.set(model, {
        model,
        requestCount: 0,
        tokenIn: 0,
        tokenOut: 0,
        totalToken: 0,
        averageLatency: 0,
      });
    }

    const current = modelMap.get(model)!;
    current.requestCount++;
    current.tokenIn += record.usage.tokenIn;
    current.tokenOut += record.usage.tokenOut;
    current.totalToken += record.usage.totalToken;
    current.averageLatency += record.performance.latency;
  });

  // Calculate averages
  return Array.from(modelMap.values())
    .map((metric) => ({
      ...metric,
      averageLatency:
        metric.requestCount > 0
          ? metric.averageLatency / metric.requestCount
          : 0,
    }))
    .sort((a, b) => b.requestCount - a.requestCount);
};

/**
 * Aggregate requests by plan
 */
export const aggregatePlanMetrics = (records: AnalyticsRecord[]): PlanMetrics[] => {
  const planMap: Map<string, number> = new Map();
  let total = 0;

  records.forEach((record) => {
    const plan = record.context.plan;
    planMap.set(plan, (planMap.get(plan) || 0) + 1);
    total++;
  });

  return Array.from(planMap.entries())
    .map(([plan, count]) => ({
      plan: plan as "free" | "pro",
      requests: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.requests - a.requests);
};

/**
 * Aggregate requests by region
 */
export const aggregateRegionMetrics = (records: AnalyticsRecord[]): RegionMetrics[] => {
  const regionMap: Map<string, number> = new Map();
  let total = 0;

  records.forEach((record) => {
    const region = record.context.region;
    regionMap.set(region, (regionMap.get(region) || 0) + 1);
    total++;
  });

  return Array.from(regionMap.entries())
    .map(([region, count]) => ({
      region,
      requests: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.requests - a.requests);
};

/**
 * Find peak usage hour in a day
 */
export const getPeakUsageHourInDay = (records: AnalyticsRecord[]): PeakUsageMetrics => {
  const hourlyData = groupByHour(records);
  let maxHour = hourlyData[0];

  hourlyData.forEach((data) => {
    if (data.value > maxHour.value) {
      maxHour = data;
    }
  });

  const total = hourlyData.reduce((sum, data) => sum + data.value, 0);
  const percentage = total > 0 ? (maxHour.value / total) * 100 : 0;

  return {
    label: maxHour.timestamp,
    value: maxHour.value,
    percentage,
  };
};

/**
 * Find peak usage day in last 7 days
 */
export const getPeakUsageDayInWeek = (records: AnalyticsRecord[]): PeakUsageMetrics => {
  const dailyData = groupByDay(records);
  let maxDay = dailyData[0];

  dailyData.forEach((data) => {
    if (data.value > maxDay.value) {
      maxDay = data;
    }
  });

  const total = dailyData.reduce((sum, data) => sum + data.value, 0);
  const percentage = total > 0 ? (maxDay.value / total) * 100 : 0;

  return {
    label: maxDay.timestamp,
    value: maxDay.value,
    percentage,
  };
};

/**
 * Filter records by date range
 */
export const filterRecordsByDateRange = (
  records: AnalyticsRecord[],
  startDate: Date,
  endDate: Date
): AnalyticsRecord[] => {
  return records.filter((record) => {
    const recordDate = parseTimestamp(record.timestamp);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

/**
 * Filter records by event type
 */
export const filterRecordsByEventType = (
  records: AnalyticsRecord[],
  eventType: EventType
): AnalyticsRecord[] => {
  return records.filter((record) => record.eventType === eventType);
};

/**
 * Filter records by model
 */
export const filterRecordsByModel = (
  records: AnalyticsRecord[],
  model: string
): AnalyticsRecord[] => {
  return records.filter((record) => record.usage.model === model);
};

/**
 * Filter records by plan
 */
export const filterRecordsByPlan = (
  records: AnalyticsRecord[],
  plan: "free" | "pro"
): AnalyticsRecord[] => {
  return records.filter((record) => record.context.plan === plan);
};

/**
 * Filter records by region
 */
export const filterRecordsByRegion = (
  records: AnalyticsRecord[],
  region: string
): AnalyticsRecord[] => {
  return records.filter((record) => record.context.region === region);
};
