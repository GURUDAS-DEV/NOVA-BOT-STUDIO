/**
 * Analytics Type Definitions
 * Matches backend MongoDB schema
 */

export type EventType = "request" | "error" | "timeout" | "limitHit";
export type PlanType = "free" | "pro";

export interface AnalyticsRecord {
  botId: string;
  apiHashKey: string;
  timestamp: string | number; // ISO string or Unix timestamp
  eventType: EventType;
  usage: {
    model: string;
    tokenIn: number;
    tokenOut: number;
    totalToken: number;
  };
  performance: {
    latency: number; // in milliseconds
  };
  context: {
    plan: PlanType;
    region: string;
  };
}

/**
 * Aggregated data structures for charts
 */

export interface TimeSeriesDataPoint {
  timestamp: string; // formatted time (HH:MM or YYYY-MM-DD)
  value: number;
  date?: Date; // for sorting
}

export interface EventMetrics {
  requests: number;
  errors: number;
  timeouts: number;
  rateLimitHits: number;
  successRate: number;
}

export interface ModelUsageMetrics {
  model: string;
  requestCount: number;
  tokenIn: number;
  tokenOut: number;
  totalToken: number;
  averageLatency: number;
}

export interface LatencyMetrics {
  timestamp: string;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
}

export interface TokenMetrics {
  timestamp: string;
  tokenIn: number;
  tokenOut: number;
  totalToken: number;
}

export interface PlanMetrics {
  plan: PlanType;
  requests: number;
  percentage: number;
}

export interface RegionMetrics {
  region: string;
  requests: number;
  percentage: number;
}

export interface PeakUsageMetrics {
  label: string;
  value: number;
  percentage: number;
}

/**
 * Chart data structures for Chart.js
 */

export interface ChartDataset {
  label?: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[] | undefined;
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointBackgroundColor?: string;
  borderDash?: number[];
  yAxisID?: string;
  pointBorderColor?: string;
  pointBorderWidth?: number;
}

export interface ChartConfig {
  type: "line" | "bar" | "doughnut" | "pie" | "radar";
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>;
}
