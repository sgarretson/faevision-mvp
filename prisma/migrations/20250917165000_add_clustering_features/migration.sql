-- Add clustering features to Signal model
ALTER TABLE "public"."signals" 
ADD COLUMN IF NOT EXISTS "clusteringFeaturesJson" JSONB,
ADD COLUMN IF NOT EXISTS "lastFeaturesGeneratedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "featuresVersion" TEXT,
ADD COLUMN IF NOT EXISTS "featuresQualityScore" DOUBLE PRECISION;

-- Add clustering results to Hotspot model  
ALTER TABLE "public"."hotspots"
ADD COLUMN IF NOT EXISTS "clusteringResults" JSONB,
ADD COLUMN IF NOT EXISTS "lastClusteredAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "clusteringVersion" TEXT,
ADD COLUMN IF NOT EXISTS "clusteringQualityScore" DOUBLE PRECISION;
