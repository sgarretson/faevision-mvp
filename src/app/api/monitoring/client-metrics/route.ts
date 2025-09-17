/**
 * Client-Side Performance Metrics Collection API
 * Sprint 3 Story 3: Performance Monitoring & Optimization
 * Expert: Jordan Kim (Vercel Engineer) + Alex Thompson (Lead Developer)
 *
 * Collect real-time performance data from client-side monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Force dynamic rendering for this route since it uses auth() which requires headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/monitoring/client-metrics
 * Collect performance metrics from client-side tracking
 */
export async function POST(request: NextRequest) {
  try {
    // Optional authentication - allow anonymous performance data
    const session = await auth();

    const body = await request.json();
    const { type, data, userAgent, timestamp } = body;

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, data' },
        { status: 400 }
      );
    }

    // Process different types of performance data
    let processedData;

    switch (type) {
      case 'api_performance':
        processedData = processAPIPerformanceData(data);
        break;
      case 'page_load':
        processedData = processPageLoadData(data);
        break;
      case 'user_interaction':
        processedData = processUserInteractionData(data);
        break;
      case 'error_tracking':
        processedData = processErrorData(data);
        break;
      default:
        processedData = data;
    }

    // In production, this would be sent to a metrics collection service
    // For now, we'll log it and store basic analytics
    console.log('📊 Client Performance Metric:', {
      type,
      processedData,
      userAgent: userAgent?.substring(0, 100), // Truncate user agent
      timestamp,
      userId: session?.user?.id,
      sessionId: generateSessionId(request),
    });

    // Store performance data for trend analysis
    await storePerformanceMetric({
      type,
      data: processedData,
      userAgent,
      timestamp,
      userId: session?.user?.id,
      ip: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      message: 'Performance metric recorded',
      type,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Failed to record client metric:', error);

    return NextResponse.json(
      {
        error: 'Failed to record metric',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Process API performance data
 */
function processAPIPerformanceData(data: any) {
  const { name, duration, type } = data;

  // Extract useful information from API call
  const endpoint = name.replace('/api/', '');
  const isSlowCall = duration > 1000; // Calls over 1 second
  const isCriticalEndpoint =
    endpoint.includes('clustering') || endpoint.includes('ai-insights');

  return {
    endpoint,
    duration: Math.round(duration),
    type,
    isSlowCall,
    isCriticalEndpoint,
    performanceCategory:
      duration < 200
        ? 'excellent'
        : duration < 500
          ? 'good'
          : duration < 1000
            ? 'acceptable'
            : 'poor',
  };
}

/**
 * Process page load performance data
 */
function processPageLoadData(data: any) {
  const {
    loadEventEnd,
    navigationStart,
    domContentLoadedEventEnd,
    firstContentfulPaint,
    largestContentfulPaint,
  } = data;

  const totalLoadTime = loadEventEnd - navigationStart;
  const domLoadTime = domContentLoadedEventEnd - navigationStart;

  return {
    totalLoadTime: Math.round(totalLoadTime),
    domLoadTime: Math.round(domLoadTime),
    firstContentfulPaint: firstContentfulPaint
      ? Math.round(firstContentfulPaint)
      : null,
    largestContentfulPaint: largestContentfulPaint
      ? Math.round(largestContentfulPaint)
      : null,
    performanceCategory:
      totalLoadTime < 1000
        ? 'excellent'
        : totalLoadTime < 2000
          ? 'good'
          : totalLoadTime < 3000
            ? 'acceptable'
            : 'poor',
  };
}

/**
 * Process user interaction data
 */
function processUserInteractionData(data: any) {
  const { action, target, duration, timestamp } = data;

  return {
    action,
    target: target?.substring(0, 100), // Truncate target info
    duration: duration ? Math.round(duration) : null,
    timestamp,
    interactionType: action.includes('click')
      ? 'click'
      : action.includes('scroll')
        ? 'scroll'
        : action.includes('input')
          ? 'input'
          : 'other',
  };
}

/**
 * Process error tracking data
 */
function processErrorData(data: any) {
  const { message, stack, url, line, column } = data;

  return {
    message: message?.substring(0, 200), // Truncate error message
    url,
    line,
    column,
    errorType: message?.includes('Network')
      ? 'network'
      : message?.includes('TypeError')
        ? 'type'
        : message?.includes('ReferenceError')
          ? 'reference'
          : 'other',
    stackTrace: stack?.substring(0, 500), // Truncate stack trace
  };
}

/**
 * Store performance metric for trend analysis
 */
async function storePerformanceMetric(metric: any) {
  try {
    // In a production environment, this would:
    // 1. Send to a metrics aggregation service (e.g., DataDog, New Relic)
    // 2. Store in a time-series database
    // 3. Update real-time dashboards

    // For now, we'll simulate storage by logging structured data
    const metricData = {
      ...metric,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development',
    };

    // Log in a format that could be easily ingested by log aggregation services
    console.log('PERFORMANCE_METRIC:', JSON.stringify(metricData));

    // TODO: Integrate with actual metrics storage service
    // await metricsService.store(metricData);
  } catch (error) {
    console.error('Failed to store performance metric:', error);
    // Don't fail the main request if metric storage fails
  }
}

/**
 * Generate a session ID for tracking user sessions
 */
function generateSessionId(request: NextRequest): string {
  // In production, this would be more sophisticated
  const userAgent = request.headers.get('user-agent') || '';
  const ip = getClientIP(request);
  const timestamp = Date.now();

  // Create a simple hash for session identification
  const sessionData = `${ip}-${userAgent}-${Math.floor(timestamp / 3600000)}`; // Group by hour

  // Simple hash function (in production, use a proper hashing library)
  let hash = 0;
  for (let i = 0; i < sessionData.length; i++) {
    const char = sessionData.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Extract client IP address
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (clientIP) {
    return clientIP;
  }

  // Fallback to connection remote address
  return 'unknown';
}

/**
 * GET /api/monitoring/client-metrics
 * Get aggregated client performance metrics (for admin/monitoring purposes)
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication for reading metrics
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // In production, this would query the metrics database
    // For now, return simulated aggregated data
    const aggregatedMetrics = {
      summary: {
        totalSessions: 150,
        averagePageLoad: 1200,
        averageApiResponse: 350,
        errorRate: 0.5,
        topPerformingPages: [
          { page: '/dashboard', avgLoadTime: 800 },
          { page: '/hotspots', avgLoadTime: 1100 },
          { page: '/inputs', avgLoadTime: 900 },
        ],
        slowestAPIs: [
          { endpoint: 'clustering/generate', avgDuration: 2500 },
          { endpoint: 'signals/ai-insights', avgDuration: 800 },
          { endpoint: 'hotspots/analyze', avgDuration: 1200 },
        ],
      },
      trends: {
        last24Hours: {
          pageLoadTrend: 'improving',
          apiResponseTrend: 'stable',
          errorTrend: 'decreasing',
        },
      },
      alerts: [
        // Active performance alerts would be listed here
      ],
    };

    return NextResponse.json({
      success: true,
      metrics: aggregatedMetrics,
      collectedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to get client metrics:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve metrics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
