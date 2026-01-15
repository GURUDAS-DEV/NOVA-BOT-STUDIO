/**
 * Chart.js Configuration Objects
 * Provides reusable chart configurations for various analytics visualizations
 */

import {
  ChartConfig,
  LatencyMetrics,
  TokenMetrics,
  EventMetrics,
  ModelUsageMetrics,
  PlanMetrics,
  RegionMetrics,
  TimeSeriesDataPoint,
} from "@/lib/Types/analytics";

/**
 * Get Chart.js theme colors based on theme mode
 */
export const getChartThemeColors = (isDark: boolean) => {
  return {
    primary: isDark ? "#3b82f6" : "#2563eb",
    secondary: isDark ? "#8b5cf6" : "#7c3aed",
    tertiary: isDark ? "#ec4899" : "#db2777",
    quaternary: isDark ? "#14b8a6" : "#0d9488",
    success: isDark ? "#10b981" : "#059669",
    danger: isDark ? "#ef4444" : "#dc2626",
    warning: isDark ? "#f59e0b" : "#d97706",
    info: isDark ? "#06b6d4" : "#0891b2",
    text: isDark ? "#f1f5f9" : "#1e293b",
    gridLine: isDark ? "#334155" : "#cbd5e1",
    tooltipBg: isDark ? "#1e293b" : "#f1f5f9",
    tooltipText: isDark ? "#f1f5f9" : "#1e293b",
  };
};

/**
 * Base chart options with dark/light mode support
 */
export const getBaseChartOptions = (isDark: boolean) => {
  const colors = getChartThemeColors(isDark);

  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: colors.text,
          padding: 16,
          font: {
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.gridLine,
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 13,
          weight: 600,
        },
        bodyFont: {
          size: 12,
        },
        displayColors: true,
        boxPadding: 8,
      },
      filler: {
        propagate: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: colors.gridLine,
          drawBorder: false,
          lineWidth: 0.5,
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: colors.gridLine,
          drawBorder: false,
          lineWidth: 0.5,
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11,
          },
        },
      },
    },
  };
};

/**
 * Requests Over Time - Line Chart (24 hours)
 */
export const createRequestsOverTimeHourlyConfig = (
  data: TimeSeriesDataPoint[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "line",
    data: {
      labels: data.map((d) => d.timestamp),
      datasets: [
        {
          label: "Requests",
          data: data.map((d) => d.value),
          borderColor: colors.primary,
          backgroundColor: isDark
            ? `rgba(59, 130, 246, 0.1)`
            : `rgba(37, 99, 235, 0.1)`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: isDark ? "#1e293b" : "#f1f5f9",
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      ...getBaseChartOptions(isDark),
      plugins: {
        ...getBaseChartOptions(isDark).plugins,
        filler: {
          propagate: true,
        },
      },
    },
  };
};

/**
 * Requests Over Time - Line Chart (7 days)
 */
export const createRequestsOverTimeDailyConfig = (
  data: TimeSeriesDataPoint[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "line",
    data: {
      labels: data.map((d) => d.timestamp),
      datasets: [
        {
          label: "Daily Requests",
          data: data.map((d) => d.value),
          borderColor: colors.secondary,
          backgroundColor: isDark
            ? `rgba(139, 92, 246, 0.1)`
            : `rgba(124, 58, 237, 0.1)`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: colors.secondary,
          pointBorderColor: isDark ? "#1e293b" : "#f1f5f9",
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      ...getBaseChartOptions(isDark),
    },
  };
};

/**
 * Token Usage - Multi-line Chart
 */
export const createTokenUsageConfig = (
  data: TokenMetrics[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "line",
    data: {
      labels: data.map((d) => d.timestamp),
      datasets: [
        {
          label: "Token In",
          data: data.map((d) => d.tokenIn),
          borderColor: colors.primary,
          backgroundColor: isDark
            ? `rgba(59, 130, 246, 0.05)`
            : `rgba(37, 99, 235, 0.05)`,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: colors.primary,
        },
        {
          label: "Token Out",
          data: data.map((d) => d.tokenOut),
          borderColor: colors.tertiary,
          backgroundColor: isDark
            ? `rgba(236, 72, 153, 0.05)`
            : `rgba(219, 39, 119, 0.05)`,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: colors.tertiary,
        },
        {
          label: "Total Tokens",
          data: data.map((d) => d.totalToken),
          borderColor: colors.warning,
          backgroundColor: isDark
            ? `rgba(245, 158, 11, 0.05)`
            : `rgba(217, 119, 6, 0.05)`,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: colors.warning,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      ...getBaseChartOptions(isDark),
    },
  };
};

/**
 * Latency Performance - Line Chart
 */
export const createLatencyPerformanceConfig = (
  data: LatencyMetrics[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "line",
    data: {
      labels: data.map((d) => d.timestamp),
      datasets: [
        {
          label: "Average Latency (ms)",
          data: data.map((d) => d.averageLatency),
          borderColor: colors.quaternary,
          backgroundColor: isDark
            ? `rgba(20, 184, 166, 0.1)`
            : `rgba(13, 148, 136, 0.1)`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: colors.quaternary,
          yAxisID: "y",
        },
        {
          label: "Max Latency (ms)",
          data: data.map((d) => d.maxLatency),
          borderColor: colors.danger,
          backgroundColor: "transparent",
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: colors.danger,
          borderDash: [5, 5],
          yAxisID: "y",
        },
      ],
    },
    options: {
      ...getBaseChartOptions(isDark),
    },
  };
};

/**
 * Event Distribution - Doughnut Chart
 */
export const createEventDistributionConfig = (
  metrics: EventMetrics,
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);
  const data = [
    metrics.requests,
    metrics.errors,
    metrics.timeouts,
    metrics.rateLimitHits,
  ];

  return {
    type: "doughnut",
    data: {
      labels: ["Successful Requests", "Errors", "Timeouts", "Rate Limit Hits"],
      datasets: [
        {
          data,
          backgroundColor: [
            colors.success,
            colors.danger,
            colors.warning,
            colors.info,
          ],
          borderColor: isDark ? "#1e293b" : "#f1f5f9",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: colors.text,
            padding: 16,
            font: {
              size: 12,
              weight: 500,
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.text,
          bodyColor: colors.text,
          borderColor: colors.gridLine,
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  };
};

/**
 * Model Usage - Horizontal Bar Chart
 */
export const createModelUsageConfig = (
  models: ModelUsageMetrics[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "bar",
    data: {
      labels: models.map((m) => m.model),
      datasets: [
        {
          label: "Requests",
          data: models.map((m) => m.requestCount),
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y" as const,
      ...getBaseChartOptions(isDark),
      scales: {
        x: {
          ...getBaseChartOptions(isDark).scales!.x,
          beginAtZero: true,
        },
      },
    },
  };
};

/**
 * Token Usage by Model - Grouped Bar Chart
 */
export const createTokenUsageByModelConfig = (
  models: ModelUsageMetrics[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "bar",
    data: {
      labels: models.map((m) => m.model),
      datasets: [
        {
          label: "Token In",
          data: models.map((m) => m.tokenIn),
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        },
        {
          label: "Token Out",
          data: models.map((m) => m.tokenOut),
          backgroundColor: colors.tertiary,
          borderColor: colors.tertiary,
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...getBaseChartOptions(isDark),
      scales: {
        y: {
          ...getBaseChartOptions(isDark).scales!.y,
          beginAtZero: true,
        },
      },
    },
  };
};

/**
 * Plan Distribution - Pie Chart
 */
export const createPlanDistributionConfig = (
  planMetrics: PlanMetrics[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "pie",
    data: {
      labels: planMetrics.map((p) => `${p.plan.toUpperCase()} Plan`),
      datasets: [
        {
          data: planMetrics.map((p) => p.requests),
          backgroundColor: [colors.primary, colors.secondary],
          borderColor: isDark ? "#1e293b" : "#f1f5f9",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: colors.text,
            padding: 16,
            font: {
              size: 12,
              weight: 500,
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.text,
          bodyColor: colors.text,
          borderColor: colors.gridLine,
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = planMetrics.reduce((a, b) => a + b.requests, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  };
};

/**
 * Region Distribution - Horizontal Bar Chart
 */
export const createRegionDistributionConfig = (
  regionMetrics: RegionMetrics[],
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);

  return {
    type: "bar",
    data: {
      labels: regionMetrics.map((r) => r.region),
      datasets: [
        {
          label: "Requests",
          data: regionMetrics.map((r) => r.requests),
          backgroundColor: colors.info,
          borderColor: colors.info,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y" as const,
      ...getBaseChartOptions(isDark),
      scales: {
        x: {
          ...getBaseChartOptions(isDark).scales!.x,
          beginAtZero: true,
        },
      },
    },
  };
};

/**
 * Success Rate - Gauge Chart (using Bar Chart)
 */
export const createSuccessRateConfig = (
  successRate: number,
  isDark: boolean
): ChartConfig => {
  const colors = getChartThemeColors(isDark);
  const failureRate = 100 - successRate;

  return {
    type: "bar",
    data: {
      labels: ["Success Rate"],
      datasets: [
        {
          label: "Success",
          data: [successRate],
          backgroundColor: colors.success,
          borderColor: colors.success,
          borderWidth: 1,
        },
        {
          label: "Failure",
          data: [failureRate],
          backgroundColor: isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(220, 38, 38, 0.3)",
          borderColor: colors.danger,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y" as const,
      ...getBaseChartOptions(isDark),
      scales: {
        x: {
          ...getBaseChartOptions(isDark).scales!.x,
          max: 100,
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return value + "%";
            },
          },
        },
      },
      plugins: {
        ...getBaseChartOptions(isDark).plugins,
        legend: {
          ...getBaseChartOptions(isDark).plugins.legend,
          position: "top" as const,
        },
      },
    },
  };
};
