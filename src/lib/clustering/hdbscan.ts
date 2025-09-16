/**
 * Simplified HDBSCAN Clustering Implementation
 * 
 * JavaScript implementation optimized for FAEVision V2 MVP scale (50-500 signals).
 * Provides density-based clustering for signal hotspot identification.
 * 
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Alex Thompson (Lead Developer)
 * 
 * Note: This is a simplified implementation suitable for MVP scale.
 * For production scale >10K signals, consider switching to pgvector + external clustering.
 */

export interface ClusteringOptions {
  minClusterSize: number;
  minSamples: number;
  metric: 'euclidean' | 'cosine';
  epsilon?: number;
}

export interface Cluster {
  id: number;
  points: number[];
  centroid: number[];
  membershipStrengths: number[];
  threshold: number;
  confidence: number;
}

export interface ClusteringResult {
  clusters: Cluster[];
  outliers: number[];
  totalPoints: number;
}

/**
 * Main HDBSCAN clustering function
 */
export async function clusterSignalsHDBSCAN(
  embeddings: number[][],
  options: ClusteringOptions
): Promise<Cluster[]> {
  
  console.log(`  🔬 Starting HDBSCAN clustering: ${embeddings.length} points`);
  
  if (embeddings.length < options.minClusterSize) {
    console.log('    ⚠️ Insufficient points for clustering');
    return [];
  }

  const startTime = Date.now();
  
  try {
    // Step 1: Build distance matrix
    const distanceMatrix = buildDistanceMatrix(embeddings, options.metric);
    
    // Step 2: Find core points based on density
    const corePoints = findCorePoints(distanceMatrix, options);
    
    // Step 3: Build clusters from core points
    const clusters = buildClusters(embeddings, distanceMatrix, corePoints, options);
    
    // Step 4: Calculate membership strengths
    const clustersWithStrengths = calculateMembershipStrengths(clusters, distanceMatrix);
    
    const duration = Date.now() - startTime;
    console.log(`    ✅ Clustering complete: ${clustersWithStrengths.length} clusters in ${duration}ms`);
    
    return clustersWithStrengths;
    
  } catch (error) {
    console.error('    ❌ HDBSCAN clustering failed:', error);
    return [];
  }
}

/**
 * Build distance matrix between all points
 */
function buildDistanceMatrix(embeddings: number[][], metric: string): number[][] {
  const n = embeddings.length;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        const distance = metric === 'cosine' 
          ? 1 - cosineSimilarity(embeddings[i], embeddings[j])
          : euclideanDistance(embeddings[i], embeddings[j]);
        
        matrix[i][j] = distance;
        matrix[j][i] = distance;
      }
    }
  }
  
  return matrix;
}

/**
 * Find core points based on density
 */
function findCorePoints(distanceMatrix: number[][], options: ClusteringOptions): Set<number> {
  const n = distanceMatrix.length;
  const corePoints = new Set<number>();
  
  // Calculate core distance for each point
  for (let i = 0; i < n; i++) {
    const distances = distanceMatrix[i]
      .map((dist, index) => ({ dist, index }))
      .filter(item => item.index !== i)
      .sort((a, b) => a.dist - b.dist);
    
    // Core distance is distance to k-th nearest neighbor
    const kthDistance = distances[Math.min(options.minSamples - 1, distances.length - 1)]?.dist || Infinity;
    
    // Count neighbors within core distance
    const neighbors = distances.filter(item => item.dist <= kthDistance).length;
    
    if (neighbors >= options.minSamples - 1) {
      corePoints.add(i);
    }
  }
  
  return corePoints;
}

/**
 * Build clusters from core points
 */
function buildClusters(
  embeddings: number[][],
  distanceMatrix: number[][],
  corePoints: Set<number>,
  options: ClusteringOptions
): Cluster[] {
  
  const visited = new Set<number>();
  const clusters: Cluster[] = [];
  let clusterId = 0;
  
  for (const corePoint of Array.from(corePoints)) {
    if (visited.has(corePoint)) continue;
    
    // Start new cluster from this core point
    const clusterPoints = new Set<number>();
    const queue = [corePoint];
    
    while (queue.length > 0) {
      const point = queue.shift()!;
      
      if (visited.has(point)) continue;
      visited.add(point);
      clusterPoints.add(point);
      
      // Find reachable points
      const reachablePoints = findReachablePoints(point, distanceMatrix, corePoints, options);
      
      for (const reachablePoint of reachablePoints) {
        if (!visited.has(reachablePoint)) {
          queue.push(reachablePoint);
        }
      }
    }
    
    // Only create cluster if it meets minimum size requirement
    if (clusterPoints.size >= options.minClusterSize) {
      const pointsArray = Array.from(clusterPoints);
      const centroid = calculateCentroid(pointsArray.map(i => embeddings[i]));
      
      clusters.push({
        id: clusterId++,
        points: pointsArray,
        centroid,
        membershipStrengths: [], // Will be calculated later
        threshold: calculateClusterThreshold(pointsArray, distanceMatrix),
        confidence: calculateClusterConfidence(pointsArray, distanceMatrix)
      });
    }
  }
  
  return clusters;
}

/**
 * Find points reachable from a core point
 */
function findReachablePoints(
  corePoint: number,
  distanceMatrix: number[][],
  corePoints: Set<number>,
  options: ClusteringOptions
): number[] {
  
  const reachable: number[] = [];
  const coreDistances = distanceMatrix[corePoint];
  
  // Calculate epsilon if not provided
  const epsilon = options.epsilon || calculateDynamicEpsilon(coreDistances, options.minSamples);
  
  for (let i = 0; i < coreDistances.length; i++) {
    if (i === corePoint) continue;
    
    const distance = coreDistances[i];
    
    // Point is reachable if within epsilon distance
    if (distance <= epsilon) {
      reachable.push(i);
    }
  }
  
  return reachable;
}

/**
 * Calculate membership strengths for all points in clusters
 */
function calculateMembershipStrengths(clusters: Cluster[], distanceMatrix: number[][]): Cluster[] {
  return clusters.map(cluster => {
    const membershipStrengths = cluster.points.map(pointIndex => {
      // Calculate average distance to all other points in cluster
      const otherPoints = cluster.points.filter(p => p !== pointIndex);
      
      if (otherPoints.length === 0) return 1.0;
      
      const avgDistance = otherPoints.reduce((sum, otherPoint) => 
        sum + distanceMatrix[pointIndex][otherPoint], 0) / otherPoints.length;
      
      // Convert distance to membership strength (0-1, where 1 is strongest)
      const maxDistance = Math.max(...otherPoints.map(p => distanceMatrix[pointIndex][p]));
      const strength = maxDistance > 0 ? 1 - (avgDistance / maxDistance) : 1.0;
      
      return Math.max(0.1, Math.min(1.0, strength)); // Clamp between 0.1 and 1.0
    });
    
    return {
      ...cluster,
      membershipStrengths
    };
  });
}

/**
 * Calculate centroid of a set of points
 */
function calculateCentroid(points: number[][]): number[] {
  if (points.length === 0) return [];
  
  const dimensions = points[0].length;
  const centroid = new Array(dimensions).fill(0);
  
  for (const point of points) {
    for (let i = 0; i < dimensions; i++) {
      centroid[i] += point[i];
    }
  }
  
  for (let i = 0; i < dimensions; i++) {
    centroid[i] /= points.length;
  }
  
  return centroid;
}

/**
 * Calculate cluster threshold (average intra-cluster distance)
 */
function calculateClusterThreshold(pointIndices: number[], distanceMatrix: number[][]): number {
  if (pointIndices.length < 2) return 0;
  
  let totalDistance = 0;
  let pairCount = 0;
  
  for (let i = 0; i < pointIndices.length; i++) {
    for (let j = i + 1; j < pointIndices.length; j++) {
      totalDistance += distanceMatrix[pointIndices[i]][pointIndices[j]];
      pairCount++;
    }
  }
  
  return pairCount > 0 ? totalDistance / pairCount : 0;
}

/**
 * Calculate cluster confidence based on cohesion
 */
function calculateClusterConfidence(pointIndices: number[], distanceMatrix: number[][]): number {
  if (pointIndices.length < 2) return 0.5;
  
  const threshold = calculateClusterThreshold(pointIndices, distanceMatrix);
  const avgDistance = threshold;
  
  // Lower average distance = higher confidence
  // Normalize to 0.3-0.95 range
  const maxExpectedDistance = 2.0; // Adjust based on embedding space
  const normalizedDistance = Math.min(avgDistance / maxExpectedDistance, 1.0);
  const confidence = 0.95 - (normalizedDistance * 0.65);
  
  return Math.max(0.3, confidence);
}

/**
 * Calculate dynamic epsilon based on k-distance
 */
function calculateDynamicEpsilon(distances: number[], k: number): number {
  const sortedDistances = [...distances].sort((a, b) => a - b);
  const kDistance = sortedDistances[Math.min(k, sortedDistances.length - 1)];
  return kDistance * 1.5; // Add some tolerance
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (normA * normB);
}

/**
 * Calculate Euclidean distance between two vectors
 */
function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Infinity;
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}
