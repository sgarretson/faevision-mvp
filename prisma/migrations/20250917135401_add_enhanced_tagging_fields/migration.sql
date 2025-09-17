-- AlterTable
ALTER TABLE "public"."signals" ADD COLUMN     "domainClassification" JSONB,
ADD COLUMN     "enhancedTagsJson" JSONB,
ADD COLUMN     "lastTaggedAt" TIMESTAMP(3),
ADD COLUMN     "tagGenerationMeta" JSONB,
ADD COLUMN     "tagModelVersion" TEXT;
