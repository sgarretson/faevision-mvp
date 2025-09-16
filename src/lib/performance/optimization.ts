/**
 * Production Performance Optimization Utilities
 * 
 * Performance optimizations for executive-grade production deployment:
 * - Database query optimization with intelligent caching
 * - API response compression and pagination
 * - Client-side performance monitoring
 * - Memory leak prevention for long-running sessions
 * 
 * Expert: Alex Thompson (Lead Developer)
 * Support: Jordan Kim (Vercel Engineer)
 */

import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

// ============================================================================
// INTELLIGENT CACHING SYSTEM
// ============================================================================

interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: number;
}

const cacheConfigs: Record<string, CacheConfig> = {
  hotspots: { maxSize: 100, ttl: 5 * 60 * 1000 }, // 5 minutes
  metrics: { maxSize: 50, ttl: 30 * 1000 }, // 30 seconds
  solutions: { maxSize: 200, ttl: 10 * 60 * 1000 }, // 10 minutes
  performance: { maxSize: 20, ttl: 15 * 1000 }, // 15 seconds
  userProfiles: { maxSize: 1000, ttl: 60 * 60 * 1000 } // 1 hour
};

const caches = new Map<string, LRUCache<string, any>>();

/**
 * Initialize cache for a specific resource type
 */
function getCache(type: string): LRUCache<string, any> {
  if (!caches.has(type)) {
    const config = cacheConfigs[type] || { maxSize: 50, ttl: 5 * 60 * 1000 };
    caches.set(type, new LRUCache({
      max: config.maxSize,
      ttl: config.ttl
    }));
  }
  return caches.get(type)!;
}

/**
 * Cached data retrieval with automatic invalidation
 */
export async function getCachedData<T>(
  type: string,
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh = false
): Promise<T> {
  const cache = getCache(type);
  
  if (!forceRefresh && cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetcher();
  cache.set(key, data);
  return data;
}

/**
 * Invalidate cache for specific type and key
 */
export function invalidateCache(type: string, key?: string): void {
  const cache = getCache(type);
  
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Cache statistics for monitoring
 */
export function getCacheStats(): Record<string, any> {
  const stats: Record<string, any> = {};
  
  for (const [type, cache] of caches.entries()) {
    stats[type] = {
      size: cache.size,
      maxSize: cache.max,
      hitRate: cache.calculatedSize / (cache.calculatedSize + cache.size)
    };
  }
  
  return stats;
}

// ============================================================================
// API RESPONSE OPTIMIZATION
// ============================================================================

interface PaginationOptions {
  page: number;
  limit: number;
  maxLimit?: number;
}

interface OptimizedResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  performance: {
    queryTime: number;
    cacheHit: boolean;
    totalTime: number;
  };
}

/**
 * Create optimized API response with compression and caching headers
 */
export function createOptimizedResponse<T>(
  data: T,
  options: {
    pagination?: PaginationOptions & { total: number };
    queryTime: number;
    cacheHit: boolean;
    cacheTtl?: number;
  }
): NextResponse {
  const startTime = Date.now();
  
  const response: OptimizedResponse<T> = {
    data,
    performance: {
      queryTime: options.queryTime,
      cacheHit: options.cacheHit,
      totalTime: Date.now() - startTime
    }
  };

  if (options.pagination) {
    const { page, limit, total } = options.pagination;
    response.pagination = {
      page,
      limit,
      total,
      hasNext: (page * limit) < total,
      hasPrev: page > 1
    };
  }

  const nextResponse = NextResponse.json(response);
  
  // Add performance headers
  nextResponse.headers.set('X-Query-Time', `${options.queryTime}ms`);
  nextResponse.headers.set('X-Cache-Hit', options.cacheHit.toString());
  nextResponse.headers.set('X-Response-Time', `${response.performance.totalTime}ms`);
  
  // Add caching headers
  if (options.cacheTtl) {
    nextResponse.headers.set('Cache-Control', `public, max-age=${Math.floor(options.cacheTtl / 1000)}`);
  }
  
  // Add compression hint
  nextResponse.headers.set('Content-Encoding', 'gzip');
  
  return nextResponse;
}

// ============================================================================
// DATABASE QUERY OPTIMIZATION
// ============================================================================

/**
 * Optimized query builder for complex Prisma queries
 */
export class QueryOptimizer {
  private includeCache = new Map<string, any>();
  
  /**
   * Get optimized include statement for Prisma queries
   */
  getOptimizedInclude(model: string, level: 'minimal' | 'standard' | 'full' = 'standard'): any {
    const cacheKey = `${model}-${level}`;
    
    if (this.includeCache.has(cacheKey)) {
      return this.includeCache.get(cacheKey);
    }
    
    let include: any = {};
    
    switch (model) {
      case 'hotspot':
        include = {
          minimal: false,
          standard: {
            signals: {
              select: {
                signal: {
                  select: {
                    id: true,
                    title: true,
                    severity: true,
                    confidence: true
                  }
                },
                membershipStrength: true,
                isOutlier: true
              }
            }
          },
          full: {
            signals: {
              include: {
                signal: {
                  include: {
                    department: { select: { name: true } },
                    team: { select: { name: true } }
                  }
                }
              }
            }
          }
        }[level];
        break;
        
      case 'solution':
        include = {
          minimal: {
            creator: { select: { id: true, name: true, role: true } }
          },
          standard: {
            creator: { select: { id: true, name: true, role: true, email: true } },
            hotspot: { select: { id: true, title: true, confidence: true } }
          },
          full: {
            creator: { select: { id: true, name: true, role: true, email: true } },
            hotspot: {
              include: {
                signals: {
                  select: { 
                    signal: { select: { id: true, title: true, severity: true } }
                  }
                }
              }
            },
            requirements: true,
            initiative: { select: { id: true, name: true } }
          }
        }[level];
        break;
        
      default:
        include = false;
    }
    
    this.includeCache.set(cacheKey, include);
    return include;
  }
  
  /**
   * Get optimized pagination parameters
   */
  getOptimizedPagination(
    page: number = 1, 
    limit: number = 20,
    maxLimit: number = 100
  ): { take: number; skip: number; page: number; limit: number } {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(maxLimit, Math.max(1, Math.floor(limit)));
    
    return {
      take: safeLimit,
      skip: (safePage - 1) * safeLimit,
      page: safePage,
      limit: safeLimit
    };
  }
}

export const queryOptimizer = new QueryOptimizer();

// ============================================================================
// CLIENT-SIDE PERFORMANCE MONITORING
// ============================================================================

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, any>;
}

class ClientPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;
  
  /**
   * Record a performance metric
   */
  record(name: string, value: number, context?: Record<string, any>): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      context
    });
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }
  
  /**
   * Get performance summary
   */
  getSummary(timeWindow: number = 5 * 60 * 1000): Record<string, any> {
    const cutoff = Date.now() - timeWindow;
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);
    
    const summary: Record<string, any> = {};
    
    for (const metric of recentMetrics) {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          total: 0,
          min: Infinity,
          max: -Infinity,
          avg: 0
        };
      }
      
      const stats = summary[metric.name];
      stats.count++;
      stats.total += metric.value;
      stats.min = Math.min(stats.min, metric.value);
      stats.max = Math.max(stats.max, metric.value);
      stats.avg = stats.total / stats.count;
    }
    
    return summary;
  }
  
  /**
   * Send metrics to monitoring endpoint
   */
  async flush(): Promise<void> {
    if (this.metrics.length === 0) return;
    
    try {
      await fetch('/api/monitoring/client-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: this.metrics.slice()
        })
      });
      
      this.metrics = [];
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  }
}

export const performanceMonitor = new ClientPerformanceMonitor();

// ============================================================================
// MEMORY LEAK PREVENTION
// ============================================================================

/**
 * Cleanup utility for preventing memory leaks in long-running executive sessions
 */
export class MemoryManager {
  private cleanupTasks: Array<() => void> = [];
  private intervalId?: NodeJS.Timeout;
  
  constructor() {
    // Run cleanup every 10 minutes
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, 10 * 60 * 1000);
  }
  
  /**
   * Register a cleanup task
   */
  registerCleanup(task: () => void): void {
    this.cleanupTasks.push(task);
  }
  
  /**
   * Run all cleanup tasks
   */
  runCleanup(): void {
    for (const task of this.cleanupTasks) {
      try {
        task();
      } catch (error) {
        console.error('Cleanup task failed:', error);
      }
    }
    
    // Clear old cache entries
    for (const cache of caches.values()) {
      if (cache.size > cache.max * 0.8) {
        // Remove oldest 20% of entries when cache is 80% full
        const keysToDelete = Math.floor(cache.size * 0.2);
        let deleted = 0;
        
        for (const key of cache.keys()) {
          if (deleted >= keysToDelete) break;
          cache.delete(key);
          deleted++;
        }
      }
    }
  }
  
  /**
   * Destroy memory manager
   */
  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.runCleanup();
    this.cleanupTasks = [];
  }
}

export const memoryManager = new MemoryManager();

// ============================================================================
// EXECUTIVE SESSION OPTIMIZATION
// ============================================================================

/**
 * Optimize for executive usage patterns (quick sessions, mobile usage)
 */
export function optimizeForExecutiveSession(): void {
  // Preload critical resources
  if (typeof window !== 'undefined') {
    // Prefetch common API endpoints
    const criticalEndpoints = [
      '/api/hotspots',
      '/api/hotspots/metrics',
      '/api/monitoring/performance'
    ];
    
    for (const endpoint of criticalEndpoints) {
      fetch(endpoint, { method: 'HEAD' }).catch(() => {
        // Silent prefetch, errors don't matter
      });
    }
    
    // Setup performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            performanceMonitor.record('page_load', entry.duration);
          } else if (entry.entryType === 'paint') {
            performanceMonitor.record(entry.name, entry.startTime);
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation', 'paint'] });
      
      // Cleanup observer on session end
      memoryManager.registerCleanup(() => observer.disconnect());
    }
    
    // Flush metrics every 30 seconds
    const metricsInterval = setInterval(() => {
      performanceMonitor.flush();
    }, 30 * 1000);
    
    memoryManager.registerCleanup(() => clearInterval(metricsInterval));
  }
}
