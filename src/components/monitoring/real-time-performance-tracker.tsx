'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

/**
 * Sprint 3 Story 3: Real-Time Performance Tracker
 * Expert Lead: Jordan Kim (Vercel Engineer)
 *
 * Real-time client-side performance monitoring for executive workflows
 */

interface PerformanceEntry {
  name: string;
  duration: number;
  timestamp: number;
  type: 'navigation' | 'api' | 'clustering' | 'database';
}

interface PerformanceStats {
  pageLoad: number;
  apiCalls: PerformanceEntry[];
  averageApiTime: number;
  slowestApi: PerformanceEntry | null;
  totalRequests: number;
  errorCount: number;
}

export function RealTimePerformanceTracker() {
  const [stats, setStats] = useState<PerformanceStats>({
    pageLoad: 0,
    apiCalls: [],
    averageApiTime: 0,
    slowestApi: null,
    totalRequests: 0,
    errorCount: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const apiInterceptor = useRef<any>(null);

  const trackPageLoadPerformance = useCallback(() => {
    // Use Navigation Timing API to get page load time
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
        setStats(prev => ({ ...prev, pageLoad: pageLoadTime }));
      }
    }
  }, []);

  const trackAPIPerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Store original fetch
    const originalFetch = window.fetch;
    apiInterceptor.current = originalFetch;

    // Intercept fetch calls to track API performance
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const startTime = performance.now();
      const url = args[0].toString();

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Only track internal API calls
        if (url.startsWith('/api/')) {
          const entry: PerformanceEntry = {
            name: url,
            duration,
            timestamp: Date.now(),
            type: getAPIType(url),
          };

          setStats(prev => {
            const newApiCalls = [...prev.apiCalls, entry].slice(-20); // Keep last 20 calls
            const avgTime =
              newApiCalls.reduce((acc, call) => acc + call.duration, 0) /
              newApiCalls.length;
            const slowest = newApiCalls.reduce((prev, current) =>
              prev.duration > current.duration ? prev : current
            );

            return {
              ...prev,
              apiCalls: newApiCalls,
              averageApiTime: avgTime,
              slowestApi: slowest,
              totalRequests: prev.totalRequests + 1,
              errorCount: response.ok ? prev.errorCount : prev.errorCount + 1,
            };
          });

          // Send performance data to monitoring endpoint
          sendPerformanceData(entry);
        }

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        setStats(prev => ({
          ...prev,
          totalRequests: prev.totalRequests + 1,
          errorCount: prev.errorCount + 1,
        }));

        throw error;
      }
    };
  }, []);

  const setupPerformanceObserver = useCallback(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();

        entries.forEach(entry => {
          // Track resource loading times
          if (entry.entryType === 'resource' && entry.name.includes('/api/')) {
            const perfEntry: PerformanceEntry = {
              name: entry.name,
              duration: entry.duration,
              timestamp: Date.now(),
              type: entry.name.includes('/clustering/')
                ? 'clustering'
                : entry.name.includes('/signals/') ||
                    entry.name.includes('/hotspots/')
                  ? 'database'
                  : 'api',
            };

            // Update stats without duplicating fetch tracking
            console.log('Resource performance:', perfEntry);
          }
        });
      });

      observer.observe({ entryTypes: ['resource', 'navigation'] });
      performanceObserver.current = observer;
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }, []);

  const initializePerformanceTracking = useCallback(() => {
    // Track page load performance
    trackPageLoadPerformance();

    // Track API call performance
    trackAPIPerformance();

    // Set up performance observer for real-time monitoring
    setupPerformanceObserver();
  }, [trackPageLoadPerformance, trackAPIPerformance, setupPerformanceObserver]);

  useEffect(() => {
    // Initialize performance tracking
    initializePerformanceTracking();

    // Clean up on unmount
    return () => {
      if (performanceObserver.current) {
        performanceObserver.current.disconnect();
      }
      if (apiInterceptor.current) {
        // Restore original fetch
        window.fetch = apiInterceptor.current;
      }
    };
  }, [initializePerformanceTracking]);

  const getAPIType = (url: string): PerformanceEntry['type'] => {
    if (url.includes('/clustering/')) return 'clustering';
    if (url.includes('/signals/') || url.includes('/hotspots/'))
      return 'database';
    return 'api';
  };

  const sendPerformanceData = async (entry: PerformanceEntry) => {
    try {
      // Send to monitoring endpoint (fire and forget)
      fetch('/api/monitoring/client-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'api_performance',
          data: entry,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      }).catch(() => {
        // Ignore errors to avoid infinite loops
      });
    } catch (error) {
      // Ignore monitoring errors
    }
  };

  const getPerformanceColor = (
    duration: number,
    type: PerformanceEntry['type']
  ) => {
    const thresholds = {
      navigation: 2000, // 2 seconds
      api: 500, // 500ms
      clustering: 2000, // 2 seconds
      database: 200, // 200ms
    };

    const threshold = thresholds[type];
    if (duration < threshold * 0.5) return 'text-green-600';
    if (duration < threshold) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
        title="Show Performance Monitor"
      >
        <Activity className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            Performance Monitor
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 p-3">
        {/* Page Load Performance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Page Load</span>
          </div>
          <span
            className={`text-xs font-medium ${getPerformanceColor(stats.pageLoad, 'navigation')}`}
          >
            {stats.pageLoad > 0
              ? `${Math.round(stats.pageLoad)}ms`
              : 'Loading...'}
          </span>
        </div>

        {/* API Performance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Avg API Time</span>
          </div>
          <span
            className={`text-xs font-medium ${getPerformanceColor(stats.averageApiTime, 'api')}`}
          >
            {stats.averageApiTime > 0
              ? `${Math.round(stats.averageApiTime)}ms`
              : '0ms'}
          </span>
        </div>

        {/* Request Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Requests</span>
          </div>
          <span className="text-xs font-medium text-gray-900">
            {stats.totalRequests} ({stats.errorCount} errors)
          </span>
        </div>

        {/* Slowest API */}
        {stats.slowestApi && (
          <div className="border-t border-gray-100 pt-2">
            <div className="mb-1 text-xs text-gray-500">Slowest API:</div>
            <div className="rounded bg-gray-50 p-1 font-mono text-xs">
              {stats.slowestApi.name.replace('/api/', '')}
            </div>
            <div
              className={`text-xs font-medium ${getPerformanceColor(stats.slowestApi.duration, stats.slowestApi.type)}`}
            >
              {Math.round(stats.slowestApi.duration)}ms
            </div>
          </div>
        )}

        {/* Recent API Calls */}
        {stats.apiCalls.length > 0 && (
          <div className="border-t border-gray-100 pt-2">
            <div className="mb-1 text-xs text-gray-500">Recent API Calls:</div>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {stats.apiCalls
                .slice(-5)
                .reverse()
                .map((call, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="truncate font-mono text-gray-600">
                      {call.name.replace('/api/', '').substring(0, 20)}
                    </span>
                    <span
                      className={`font-medium ${getPerformanceColor(call.duration, call.type)}`}
                    >
                      {Math.round(call.duration)}ms
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Performance Indicators */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
          <span className="text-gray-500">Status:</span>
          <div className="flex items-center space-x-2">
            {stats.averageApiTime < 500 ? (
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-green-600">Excellent</span>
              </div>
            ) : stats.averageApiTime < 1000 ? (
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-yellow-600">Good</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-red-600">Needs Optimization</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
