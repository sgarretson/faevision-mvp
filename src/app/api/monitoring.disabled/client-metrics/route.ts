import { NextRequest, NextResponse } from 'next/server';

/**
 * Client-Side Performance Metrics Collection
 * 
 * Collects and analyzes client-side performance metrics:
 * - Page load times and Core Web Vitals
 * - API response times from client perspective
 * - User interaction performance
 * - Mobile performance specific metrics
 * 
 * Expert: Jordan Kim (Vercel Engineer)
 * Support: Alex Thompson (Lead Developer)
 */

interface ClientMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, any>;
}

interface MetricsPayload {
  metrics: ClientMetric[];
  sessionId?: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: MetricsPayload = await request.json();
    const { metrics, sessionId, userAgent, viewport } = body;

    console.log(`📊 Received ${metrics.length} client performance metrics`);

    // Process and analyze metrics
    const analysis = analyzeMetrics(metrics);
    
    // Store metrics for monitoring (in production, this would go to a monitoring service)
    await storeMetrics({
      metrics,
      analysis,
      sessionInfo: {
        sessionId,
        userAgent,
        viewport,
        timestamp: new Date().toISOString(),
        ip: getClientIP(request)
      }
    });

    // Check for performance issues and alert if necessary
    const alerts = checkPerformanceAlerts(analysis);

    return NextResponse.json({
      success: true,
      processed: metrics.length,
      analysis: {
        summary: analysis,
        alerts
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing client metrics:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process metrics',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Analyze performance metrics for insights
 */
function analyzeMetrics(metrics: ClientMetric[]) {
  const analysis: Record<string, any> = {
    totalMetrics: metrics.length,
    timeRange: {
      start: Math.min(...metrics.map(m => m.timestamp)),
      end: Math.max(...metrics.map(m => m.timestamp))
    },
    categories: {}
  };

  // Group metrics by category
  const categories = groupMetricsByCategory(metrics);
  
  for (const [category, categoryMetrics] of Object.entries(categories)) {
    analysis.categories[category] = {
      count: categoryMetrics.length,
      avg: categoryMetrics.reduce((sum, m) => sum + m.value, 0) / categoryMetrics.length,
      min: Math.min(...categoryMetrics.map(m => m.value)),
      max: Math.max(...categoryMetrics.map(m => m.value)),
      p95: calculatePercentile(categoryMetrics.map(m => m.value), 95)
    };
  }

  // Core Web Vitals analysis
  analysis.webVitals = analyzeWebVitals(metrics);
  
  // Mobile performance analysis
  analysis.mobile = analyzeMobilePerformance(metrics);

  return analysis;
}

/**
 * Group metrics by category for analysis
 */
function groupMetricsByCategory(metrics: ClientMetric[]): Record<string, ClientMetric[]> {
  const categories: Record<string, ClientMetric[]> = {};
  
  for (const metric of metrics) {
    let category = 'other';
    
    // Categorize metrics
    if (metric.name.includes('page_load') || metric.name.includes('navigation')) {
      category = 'page_load';
    } else if (metric.name.includes('paint') || metric.name.includes('render')) {
      category = 'rendering';
    } else if (metric.name.includes('api') || metric.name.includes('fetch')) {
      category = 'api';
    } else if (metric.name.includes('click') || metric.name.includes('interaction')) {
      category = 'interaction';
    } else if (metric.name.includes('clustering') || metric.name.includes('ai')) {
      category = 'ai_processing';
    }
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(metric);
  }
  
  return categories;
}

/**
 * Analyze Core Web Vitals metrics
 */
function analyzeWebVitals(metrics: ClientMetric[]) {
  const webVitals = {
    lcp: null as number | null, // Largest Contentful Paint
    fid: null as number | null, // First Input Delay
    cls: null as number | null, // Cumulative Layout Shift
    fcp: null as number | null, // First Contentful Paint
    ttfb: null as number | null // Time to First Byte
  };

  for (const metric of metrics) {
    switch (metric.name) {
      case 'largest-contentful-paint':
        webVitals.lcp = metric.value;
        break;
      case 'first-input-delay':
        webVitals.fid = metric.value;
        break;
      case 'cumulative-layout-shift':
        webVitals.cls = metric.value;
        break;
      case 'first-contentful-paint':
        webVitals.fcp = metric.value;
        break;
      case 'time-to-first-byte':
        webVitals.ttfb = metric.value;
        break;
    }
  }

  // Score web vitals (good/needs improvement/poor)
  const scores = {
    lcp: webVitals.lcp ? (webVitals.lcp <= 2500 ? 'good' : webVitals.lcp <= 4000 ? 'needs-improvement' : 'poor') : null,
    fid: webVitals.fid ? (webVitals.fid <= 100 ? 'good' : webVitals.fid <= 300 ? 'needs-improvement' : 'poor') : null,
    cls: webVitals.cls ? (webVitals.cls <= 0.1 ? 'good' : webVitals.cls <= 0.25 ? 'needs-improvement' : 'poor') : null
  };

  return { values: webVitals, scores };
}

/**
 * Analyze mobile-specific performance metrics
 */
function analyzeMobilePerformance(metrics: ClientMetric[]) {
  const mobileMetrics = metrics.filter(m => 
    m.context?.isMobile || 
    m.context?.viewport?.width < 768
  );

  if (mobileMetrics.length === 0) {
    return { available: false };
  }

  const pageLoadMetrics = mobileMetrics.filter(m => m.name.includes('page_load'));
  const interactionMetrics = mobileMetrics.filter(m => m.name.includes('interaction'));
  
  return {
    available: true,
    pageLoadAvg: pageLoadMetrics.length > 0 
      ? pageLoadMetrics.reduce((sum, m) => sum + m.value, 0) / pageLoadMetrics.length 
      : null,
    interactionAvg: interactionMetrics.length > 0
      ? interactionMetrics.reduce((sum, m) => sum + m.value, 0) / interactionMetrics.length
      : null,
    totalSamples: mobileMetrics.length
  };
}

/**
 * Check for performance alerts
 */
function checkPerformanceAlerts(analysis: any): string[] {
  const alerts: string[] = [];

  // Core Web Vitals alerts
  if (analysis.webVitals.scores.lcp === 'poor') {
    alerts.push('LCP (Largest Contentful Paint) is poor - consider optimizing images and server response time');
  }
  
  if (analysis.webVitals.scores.fid === 'poor') {
    alerts.push('FID (First Input Delay) is poor - consider reducing JavaScript execution time');
  }
  
  if (analysis.webVitals.scores.cls === 'poor') {
    alerts.push('CLS (Cumulative Layout Shift) is poor - consider fixing layout shifts');
  }

  // API performance alerts
  if (analysis.categories.api && analysis.categories.api.avg > 1000) {
    alerts.push('API response times averaging over 1 second - investigate server performance');
  }

  // Page load alerts
  if (analysis.categories.page_load && analysis.categories.page_load.avg > 3000) {
    alerts.push('Page load times averaging over 3 seconds - optimize critical rendering path');
  }

  // Mobile performance alerts
  if (analysis.mobile.available && analysis.mobile.pageLoadAvg > 5000) {
    alerts.push('Mobile page load times over 5 seconds - optimize for mobile networks');
  }

  return alerts;
}

/**
 * Store metrics for monitoring and analysis
 */
async function storeMetrics(data: any): Promise<void> {
  // In production, this would store to:
  // - Vercel Analytics
  // - Application monitoring service (DataDog, New Relic, etc.)
  // - Custom metrics database
  
  console.log('📊 Performance metrics stored:', {
    metricCount: data.metrics.length,
    sessionId: data.sessionInfo.sessionId,
    alerts: data.analysis?.alerts?.length || 0
  });
  
  // For now, we'll just log critical performance issues
  if (data.analysis?.alerts?.length > 0) {
    console.warn('🚨 Performance alerts detected:', data.analysis.alerts);
  }
}

/**
 * Calculate percentile value
 */
function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown';
}
