-- FAEVision Preview Database - Quick Fix for Missing Fields
-- Database Architect: Morgan Smith
-- Target: Preview environment only (Vercel Prisma Postgres)

-- Add missing title field to users table (critical for login)
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "title" TEXT;

-- Add other essential missing fields for immediate functionality
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "managerId" TEXT;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "billableRate" DOUBLE PRECISION;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "costCenter" TEXT;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "profileJson" JSONB;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "targetUtilization" DOUBLE PRECISION;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "utilizationRate" DOUBLE PRECISION;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "departmentObjId" TEXT;

-- Add missing manager relationship (self-referential)
ALTER TABLE "public"."users" ADD CONSTRAINT "users_managerId_fkey" 
  FOREIGN KEY ("managerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
