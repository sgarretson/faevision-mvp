/*
  Warnings:

  - The values [PUBLISHED] on the enum `FRDStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [NEW,DISCUSSING,ORGANIZED,IN_SOLUTION] on the enum `InputStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DEADLINE,SYSTEM] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [REVISED] on the enum `RequirementStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PLANNING,ACTIVE,COMPLETED] on the enum `SolutionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `metadata` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `inputId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `requirementId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `solutionId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `aiSimilarity` on the `input_groups` table. All the data in the column will be lost.
  - You are about to drop the column `aiTheme` on the `input_groups` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `input_groups` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `input_groups` table. All the data in the column will be lost.
  - You are about to drop the column `aiProcessed` on the `inputs` table. All the data in the column will be lost.
  - The `issueType` column on the `inputs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `inputs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `data` on the `notifications` table. All the data in the column will be lost.
  - The `priority` column on the `requirements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `actualCompletion` on the `solutions` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `solutions` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `solutions` table. All the data in the column will be lost.
  - You are about to drop the column `successCriteria` on the `solutions` table. All the data in the column will be lost.
  - You are about to drop the column `targetCompletion` on the `solutions` table. All the data in the column will be lost.
  - You are about to drop the column `inputId` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the column `solutionId` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `votes` table. All the data in the column will be lost.
  - You are about to drop the `_InputToSolution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ideaId]` on the table `solutions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entityType,entityId,createdBy]` on the table `votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `input_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `solutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `votes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `value` on the `votes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."initiative_status" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."risk_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('INPUT', 'SIGNAL', 'HOTSPOT', 'IDEA', 'SOLUTION', 'REQUIREMENT', 'FRD_DOCUMENT');

-- CreateEnum
CREATE TYPE "public"."VoteValue" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "public"."Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."HotspotStatus" AS ENUM ('OPEN', 'APPROVED', 'HANDED_OFF', 'MONITORING', 'RESOLVED', 'CLOSED_NO_ACTION');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."FRDStatus_new" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'DELIVERED', 'ARCHIVED');
ALTER TABLE "public"."frd_documents" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."frd_documents" ALTER COLUMN "status" TYPE "public"."FRDStatus_new" USING ("status"::text::"public"."FRDStatus_new");
ALTER TYPE "public"."FRDStatus" RENAME TO "FRDStatus_old";
ALTER TYPE "public"."FRDStatus_new" RENAME TO "FRDStatus";
DROP TYPE "public"."FRDStatus_old";
ALTER TABLE "public"."frd_documents" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."InputStatus_new" AS ENUM ('ACTIVE', 'RESOLVED', 'ARCHIVED', 'DUPLICATE');
ALTER TABLE "public"."inputs" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."inputs" ALTER COLUMN "status" TYPE "public"."InputStatus_new" USING ("status"::text::"public"."InputStatus_new");
ALTER TYPE "public"."InputStatus" RENAME TO "InputStatus_old";
ALTER TYPE "public"."InputStatus_new" RENAME TO "InputStatus";
DROP TYPE "public"."InputStatus_old";
ALTER TABLE "public"."inputs" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."NotificationType_new" AS ENUM ('MENTION', 'VOTE', 'COMMENT', 'STATUS_CHANGE', 'APPROVAL_REQUEST', 'ASSIGNMENT', 'DEADLINE_REMINDER');
ALTER TABLE "public"."notifications" ALTER COLUMN "type" TYPE "public"."NotificationType_new" USING ("type"::text::"public"."NotificationType_new");
ALTER TYPE "public"."NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "public"."NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."RequirementStatus_new" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'OBSOLETE');
ALTER TABLE "public"."requirements" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."requirements" ALTER COLUMN "status" TYPE "public"."RequirementStatus_new" USING ("status"::text::"public"."RequirementStatus_new");
ALTER TYPE "public"."RequirementStatus" RENAME TO "RequirementStatus_old";
ALTER TYPE "public"."RequirementStatus_new" RENAME TO "RequirementStatus";
DROP TYPE "public"."RequirementStatus_old";
ALTER TABLE "public"."requirements" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."SolutionStatus_new" AS ENUM ('DRAFT', 'IN_PROGRESS', 'REVIEW', 'APPROVED', 'IMPLEMENTED', 'CANCELLED', 'ON_HOLD');
ALTER TABLE "public"."solutions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."solutions" ALTER COLUMN "status" TYPE "public"."SolutionStatus_new" USING ("status"::text::"public"."SolutionStatus_new");
ALTER TYPE "public"."SolutionStatus" RENAME TO "SolutionStatus_old";
ALTER TYPE "public"."SolutionStatus_new" RENAME TO "SolutionStatus";
DROP TYPE "public"."SolutionStatus_old";
ALTER TABLE "public"."solutions" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."_InputToSolution" DROP CONSTRAINT "_InputToSolution_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_InputToSolution" DROP CONSTRAINT "_InputToSolution_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_inputId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_solutionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."input_groups" DROP CONSTRAINT "input_groups_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."solutions" DROP CONSTRAINT "solutions_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_solutionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_inputId_fkey";

-- DropForeignKey
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_solutionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."votes" DROP CONSTRAINT "votes_userId_fkey";

-- DropIndex
DROP INDEX "public"."audit_logs_entityId_idx";

-- DropIndex
DROP INDEX "public"."audit_logs_entityType_idx";

-- DropIndex
DROP INDEX "public"."comments_authorId_idx";

-- DropIndex
DROP INDEX "public"."comments_inputId_idx";

-- DropIndex
DROP INDEX "public"."comments_requirementId_idx";

-- DropIndex
DROP INDEX "public"."comments_solutionId_idx";

-- DropIndex
DROP INDEX "public"."input_groups_ownerId_idx";

-- DropIndex
DROP INDEX "public"."input_groups_status_idx";

-- DropIndex
DROP INDEX "public"."inputs_aiProcessed_idx";

-- DropIndex
DROP INDEX "public"."inputs_issueType_idx";

-- DropIndex
DROP INDEX "public"."inputs_type_idx";

-- DropIndex
DROP INDEX "public"."notifications_readAt_idx";

-- DropIndex
DROP INDEX "public"."notifications_userId_idx";

-- DropIndex
DROP INDEX "public"."solutions_ownerId_idx";

-- DropIndex
DROP INDEX "public"."solutions_priority_idx";

-- DropIndex
DROP INDEX "public"."votes_inputId_idx";

-- DropIndex
DROP INDEX "public"."votes_solutionId_idx";

-- DropIndex
DROP INDEX "public"."votes_userId_idx";

-- DropIndex
DROP INDEX "public"."votes_userId_inputId_key";

-- DropIndex
DROP INDEX "public"."votes_userId_solutionId_key";

-- AlterTable
ALTER TABLE "public"."audit_logs" DROP COLUMN "metadata",
ADD COLUMN     "sessionId" TEXT;

-- AlterTable
ALTER TABLE "public"."comments" DROP COLUMN "authorId",
DROP COLUMN "inputId",
DROP COLUMN "requirementId",
DROP COLUMN "solutionId",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "editedAt" TIMESTAMP(3),
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "entityType" "public"."EntityType" NOT NULL,
ADD COLUMN     "mentions" JSONB;

-- AlterTable
ALTER TABLE "public"."input_groups" DROP COLUMN "aiSimilarity",
DROP COLUMN "aiTheme",
DROP COLUMN "ownerId",
DROP COLUMN "status",
ADD COLUMN     "aiConfidence" DOUBLE PRECISION,
ADD COLUMN     "aiReasoning" TEXT,
ADD COLUMN     "avgPriority" DOUBLE PRECISION,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "inputCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActivity" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."inputs" DROP COLUMN "aiProcessed",
ADD COLUMN     "aiConfidence" DOUBLE PRECISION,
ALTER COLUMN "type" SET DEFAULT 'GENERAL',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
DROP COLUMN "issueType",
ADD COLUMN     "issueType" TEXT,
DROP COLUMN "priority",
ADD COLUMN     "priority" "public"."priority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "data",
ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" "public"."EntityType",
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."requirements" DROP COLUMN "priority",
ADD COLUMN     "priority" "public"."priority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "public"."solutions" DROP COLUMN "actualCompletion",
DROP COLUMN "ownerId",
DROP COLUMN "priority",
DROP COLUMN "successCriteria",
DROP COLUMN "targetCompletion",
ADD COLUMN     "actualCompletionDate" TIMESTAMP(3),
ADD COLUMN     "actualImpactJson" JSONB,
ADD COLUMN     "businessValue" TEXT,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "expectedImpactJson" JSONB,
ADD COLUMN     "hotspotId" TEXT,
ADD COLUMN     "ideaId" TEXT,
ADD COLUMN     "initiativeId" TEXT,
ADD COLUMN     "inputId" TEXT,
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "successMetrics" JSONB,
ADD COLUMN     "targetDate" TIMESTAMP(3),
ADD COLUMN     "tasks" JSONB,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."votes" DROP COLUMN "inputId",
DROP COLUMN "solutionId",
DROP COLUMN "userId",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "entityType" "public"."EntityType" NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" "public"."VoteValue" NOT NULL;

-- DropTable
DROP TABLE "public"."_InputToSolution";

-- DropTable
DROP TABLE "public"."tasks";

-- DropEnum
DROP TYPE "public"."GroupStatus";

-- DropEnum
DROP TYPE "public"."IssueType";

-- DropEnum
DROP TYPE "public"."Priority";

-- DropEnum
DROP TYPE "public"."TaskStatus";

-- CreateTable
CREATE TABLE "public"."departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "headCount" INTEGER NOT NULL DEFAULT 0,
    "budgetAllocation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "managerId" TEXT,
    "costCenter" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "utilizationTarget" DOUBLE PRECISION,
    "actualUtilization" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "departmentId" TEXT,
    "leaderId" TEXT,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "maxCapacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "teamType" TEXT,
    "currentProjects" INTEGER NOT NULL DEFAULT 0,
    "budgetAllocation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilizationRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."initiatives" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."initiative_status" NOT NULL DEFAULT 'PLANNING',
    "priority" "public"."priority" NOT NULL DEFAULT 'MEDIUM',
    "ownerId" TEXT,
    "budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "actualSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "expectedROI" DOUBLE PRECISION,
    "actualROI" DOUBLE PRECISION,
    "riskLevel" "public"."risk_level" NOT NULL DEFAULT 'MEDIUM',
    "goalJson" JSONB,
    "roiJson" JSONB,
    "milestonesJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "initiatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "parentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."signals" (
    "id" TEXT NOT NULL,
    "inputId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schemaVersion" TEXT NOT NULL DEFAULT '1.0',
    "sourceJson" JSONB,
    "confidence" DOUBLE PRECISION,
    "attachmentsJson" JSONB,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "systemName" TEXT,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "severity" "public"."Severity" NOT NULL,
    "severityScore" INTEGER NOT NULL DEFAULT 0,
    "departmentId" TEXT,
    "teamId" TEXT,
    "categoryId" TEXT,
    "metricsJson" JSONB,
    "baselineJson" JSONB,
    "impactJson" JSONB,
    "tagsJson" JSONB,
    "entitiesJson" JSONB,
    "privacyLevel" TEXT,
    "dedupeKey" TEXT,
    "embedding" BYTEA,
    "aiProcessed" BOOLEAN NOT NULL DEFAULT false,
    "aiTagsJson" JSONB,
    "lineageJson" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hotspots" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "public"."HotspotStatus" NOT NULL DEFAULT 'OPEN',
    "rankScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "primaryCategoryId" TEXT,
    "linkedEntitiesJson" JSONB,
    "clusteringMethod" TEXT,
    "similarityThreshold" DOUBLE PRECISION,
    "rcaBreakdownJson" JSONB,
    "solutionSuggestionsJson" JSONB,
    "decisionMatrixJson" JSONB,
    "crossFunctionalImpactJson" JSONB,
    "lastAnalysisAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotspots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hotspot_signals" (
    "hotspotId" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "membershipStrength" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isOutlier" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotspot_signals_pkey" PRIMARY KEY ("hotspotId","signalId")
);

-- CreateTable
CREATE TABLE "public"."ideas" (
    "id" TEXT NOT NULL,
    "hotspotId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "evidenceJson" JSONB,
    "tagsJson" JSONB,
    "confidence" DOUBLE PRECISION,
    "createdById" TEXT,
    "initiativeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_analysis_audit" (
    "id" TEXT NOT NULL,
    "hotspotId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestData" JSONB,
    "responseData" JSONB,
    "processingTime" INTEGER,
    "confidence" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analysis_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "public"."departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "initiatives_name_key" ON "public"."initiatives"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "signals_inputId_key" ON "public"."signals"("inputId");

-- CreateIndex
CREATE UNIQUE INDEX "signals_dedupeKey_key" ON "public"."signals"("dedupeKey");

-- CreateIndex
CREATE INDEX "signals_timestamp_idx" ON "public"."signals"("timestamp");

-- CreateIndex
CREATE INDEX "signals_receivedAt_idx" ON "public"."signals"("receivedAt");

-- CreateIndex
CREATE INDEX "signals_sourceType_idx" ON "public"."signals"("sourceType");

-- CreateIndex
CREATE INDEX "signals_severity_idx" ON "public"."signals"("severity");

-- CreateIndex
CREATE INDEX "signals_departmentId_idx" ON "public"."signals"("departmentId");

-- CreateIndex
CREATE INDEX "signals_teamId_idx" ON "public"."signals"("teamId");

-- CreateIndex
CREATE INDEX "signals_aiProcessed_idx" ON "public"."signals"("aiProcessed");

-- CreateIndex
CREATE INDEX "signals_createdById_idx" ON "public"."signals"("createdById");

-- CreateIndex
CREATE INDEX "hotspots_status_idx" ON "public"."hotspots"("status");

-- CreateIndex
CREATE INDEX "hotspots_rankScore_idx" ON "public"."hotspots"("rankScore");

-- CreateIndex
CREATE INDEX "hotspots_confidence_idx" ON "public"."hotspots"("confidence");

-- CreateIndex
CREATE INDEX "hotspots_primaryCategoryId_idx" ON "public"."hotspots"("primaryCategoryId");

-- CreateIndex
CREATE INDEX "hotspots_lastAnalysisAt_idx" ON "public"."hotspots"("lastAnalysisAt");

-- CreateIndex
CREATE INDEX "ideas_hotspotId_idx" ON "public"."ideas"("hotspotId");

-- CreateIndex
CREATE INDEX "ideas_origin_idx" ON "public"."ideas"("origin");

-- CreateIndex
CREATE INDEX "ideas_status_idx" ON "public"."ideas"("status");

-- CreateIndex
CREATE INDEX "ideas_createdById_idx" ON "public"."ideas"("createdById");

-- CreateIndex
CREATE INDEX "ai_analysis_audit_hotspotId_idx" ON "public"."ai_analysis_audit"("hotspotId");

-- CreateIndex
CREATE INDEX "ai_analysis_audit_analysisType_idx" ON "public"."ai_analysis_audit"("analysisType");

-- CreateIndex
CREATE INDEX "ai_analysis_audit_userId_idx" ON "public"."ai_analysis_audit"("userId");

-- CreateIndex
CREATE INDEX "ai_analysis_audit_createdAt_idx" ON "public"."ai_analysis_audit"("createdAt");

-- CreateIndex
CREATE INDEX "ai_analysis_audit_status_idx" ON "public"."ai_analysis_audit"("status");

-- CreateIndex
CREATE INDEX "_TeamMembers_B_index" ON "public"."_TeamMembers"("B");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "public"."audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "comments_entityType_entityId_idx" ON "public"."comments"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "comments_createdBy_idx" ON "public"."comments"("createdBy");

-- CreateIndex
CREATE INDEX "comments_createdAt_idx" ON "public"."comments"("createdAt");

-- CreateIndex
CREATE INDEX "input_groups_createdBy_idx" ON "public"."input_groups"("createdBy");

-- CreateIndex
CREATE INDEX "input_groups_lastActivity_idx" ON "public"."input_groups"("lastActivity");

-- CreateIndex
CREATE INDEX "inputs_priority_idx" ON "public"."inputs"("priority");

-- CreateIndex
CREATE INDEX "inputs_createdAt_idx" ON "public"."inputs"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "public"."notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "public"."notifications"("type");

-- CreateIndex
CREATE INDEX "requirements_priority_idx" ON "public"."requirements"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "solutions_ideaId_key" ON "public"."solutions"("ideaId");

-- CreateIndex
CREATE INDEX "solutions_inputId_idx" ON "public"."solutions"("inputId");

-- CreateIndex
CREATE INDEX "solutions_createdBy_idx" ON "public"."solutions"("createdBy");

-- CreateIndex
CREATE INDEX "solutions_targetDate_idx" ON "public"."solutions"("targetDate");

-- CreateIndex
CREATE INDEX "votes_entityType_entityId_idx" ON "public"."votes"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "votes_createdBy_idx" ON "public"."votes"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "votes_entityType_entityId_createdBy_key" ON "public"."votes"("entityType", "entityId", "createdBy");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_departmentObjId_fkey" FOREIGN KEY ("departmentObjId") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departments" ADD CONSTRAINT "departments_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teams" ADD CONSTRAINT "teams_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teams" ADD CONSTRAINT "teams_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."initiatives" ADD CONSTRAINT "initiatives_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."signals" ADD CONSTRAINT "signals_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."signals" ADD CONSTRAINT "signals_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."signals" ADD CONSTRAINT "signals_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."signals" ADD CONSTRAINT "signals_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hotspot_signals" ADD CONSTRAINT "hotspot_signals_hotspotId_fkey" FOREIGN KEY ("hotspotId") REFERENCES "public"."hotspots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hotspot_signals" ADD CONSTRAINT "hotspot_signals_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "public"."signals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ideas" ADD CONSTRAINT "ideas_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ideas" ADD CONSTRAINT "ideas_hotspotId_fkey" FOREIGN KEY ("hotspotId") REFERENCES "public"."hotspots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ideas" ADD CONSTRAINT "ideas_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "public"."initiatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_hotspotId_fkey" FOREIGN KEY ("hotspotId") REFERENCES "public"."hotspots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "public"."initiatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."ideas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "public"."inputs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."input_groups" ADD CONSTRAINT "input_groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_analysis_audit" ADD CONSTRAINT "ai_analysis_audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
