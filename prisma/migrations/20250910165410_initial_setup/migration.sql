-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'EXECUTIVE', 'CONTRIBUTOR');

-- CreateEnum
CREATE TYPE "public"."InputType" AS ENUM ('PROBLEM', 'OPPORTUNITY', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."InputStatus" AS ENUM ('NEW', 'DISCUSSING', 'ORGANIZED', 'IN_SOLUTION', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."IssueType" AS ENUM ('PROCESS', 'TECHNOLOGY', 'COMMUNICATION', 'RESOURCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."GroupStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'CONVERTED_TO_SOLUTION');

-- CreateEnum
CREATE TYPE "public"."SolutionStatus" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."RequirementStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'REJECTED', 'REVISED');

-- CreateEnum
CREATE TYPE "public"."FRDStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('COMMENT', 'VOTE', 'STATUS_CHANGE', 'ASSIGNMENT', 'DEADLINE', 'SYSTEM');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CONTRIBUTOR',
    "department" TEXT,
    "avatar" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inputs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."InputType" NOT NULL,
    "status" "public"."InputStatus" NOT NULL DEFAULT 'NEW',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "department" TEXT,
    "issueType" "public"."IssueType",
    "rootCause" TEXT,
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "aiProcessed" BOOLEAN NOT NULL DEFAULT false,
    "aiTags" JSONB,
    "aiSuggestions" JSONB,

    CONSTRAINT "inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inputId" TEXT,
    "solutionId" TEXT,
    "requirementId" TEXT,
    "parentId" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inputId" TEXT,
    "solutionId" TEXT,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."input_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "status" "public"."GroupStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiSuggested" BOOLEAN NOT NULL DEFAULT false,
    "aiSimilarity" DOUBLE PRECISION,
    "aiTheme" TEXT,

    CONSTRAINT "input_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."solutions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "public"."SolutionStatus" NOT NULL DEFAULT 'PLANNING',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estimatedEffort" TEXT,
    "targetCompletion" TIMESTAMP(3),
    "actualCompletion" TIMESTAMP(3),
    "successCriteria" JSONB,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "solutionId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "dueDate" TIMESTAMP(3),
    "dependencies" JSONB,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."requirements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "acceptanceCriteria" JSONB NOT NULL,
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "public"."RequirementStatus" NOT NULL DEFAULT 'DRAFT',
    "estimatedEffort" TEXT,
    "dependencies" JSONB,
    "businessValue" TEXT,
    "riskAssessment" TEXT,
    "stakeholders" JSONB,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "solutionId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."frd_documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DOUBLE PRECISION,
    "aiPromptUsed" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "public"."FRDStatus" NOT NULL DEFAULT 'DRAFT',
    "executiveApproved" BOOLEAN NOT NULL DEFAULT false,
    "exportFormats" JSONB,
    "templateUsed" TEXT,
    "generationTime" DOUBLE PRECISION,
    "wordCount" INTEGER,
    "lastExportedAt" TIMESTAMP(3),
    "solutionId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frd_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_InputToSolution" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InputToSolution_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_InputToInputGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InputToInputGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "inputs_createdBy_idx" ON "public"."inputs"("createdBy");

-- CreateIndex
CREATE INDEX "inputs_status_idx" ON "public"."inputs"("status");

-- CreateIndex
CREATE INDEX "inputs_type_idx" ON "public"."inputs"("type");

-- CreateIndex
CREATE INDEX "inputs_department_idx" ON "public"."inputs"("department");

-- CreateIndex
CREATE INDEX "inputs_issueType_idx" ON "public"."inputs"("issueType");

-- CreateIndex
CREATE INDEX "inputs_priority_idx" ON "public"."inputs"("priority");

-- CreateIndex
CREATE INDEX "inputs_aiProcessed_idx" ON "public"."inputs"("aiProcessed");

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "public"."comments"("authorId");

-- CreateIndex
CREATE INDEX "comments_inputId_idx" ON "public"."comments"("inputId");

-- CreateIndex
CREATE INDEX "comments_solutionId_idx" ON "public"."comments"("solutionId");

-- CreateIndex
CREATE INDEX "comments_requirementId_idx" ON "public"."comments"("requirementId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "public"."comments"("parentId");

-- CreateIndex
CREATE INDEX "votes_userId_idx" ON "public"."votes"("userId");

-- CreateIndex
CREATE INDEX "votes_inputId_idx" ON "public"."votes"("inputId");

-- CreateIndex
CREATE INDEX "votes_solutionId_idx" ON "public"."votes"("solutionId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_inputId_key" ON "public"."votes"("userId", "inputId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_solutionId_key" ON "public"."votes"("userId", "solutionId");

-- CreateIndex
CREATE INDEX "input_groups_ownerId_idx" ON "public"."input_groups"("ownerId");

-- CreateIndex
CREATE INDEX "input_groups_status_idx" ON "public"."input_groups"("status");

-- CreateIndex
CREATE INDEX "input_groups_aiSuggested_idx" ON "public"."input_groups"("aiSuggested");

-- CreateIndex
CREATE INDEX "solutions_ownerId_idx" ON "public"."solutions"("ownerId");

-- CreateIndex
CREATE INDEX "solutions_status_idx" ON "public"."solutions"("status");

-- CreateIndex
CREATE INDEX "solutions_priority_idx" ON "public"."solutions"("priority");

-- CreateIndex
CREATE INDEX "tasks_solutionId_idx" ON "public"."tasks"("solutionId");

-- CreateIndex
CREATE INDEX "tasks_assigneeId_idx" ON "public"."tasks"("assigneeId");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "public"."tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_priority_idx" ON "public"."tasks"("priority");

-- CreateIndex
CREATE INDEX "tasks_dueDate_idx" ON "public"."tasks"("dueDate");

-- CreateIndex
CREATE INDEX "requirements_solutionId_idx" ON "public"."requirements"("solutionId");

-- CreateIndex
CREATE INDEX "requirements_createdBy_idx" ON "public"."requirements"("createdBy");

-- CreateIndex
CREATE INDEX "requirements_status_idx" ON "public"."requirements"("status");

-- CreateIndex
CREATE INDEX "requirements_priority_idx" ON "public"."requirements"("priority");

-- CreateIndex
CREATE INDEX "frd_documents_solutionId_idx" ON "public"."frd_documents"("solutionId");

-- CreateIndex
CREATE INDEX "frd_documents_createdBy_idx" ON "public"."frd_documents"("createdBy");

-- CreateIndex
CREATE INDEX "frd_documents_status_idx" ON "public"."frd_documents"("status");

-- CreateIndex
CREATE INDEX "frd_documents_aiGenerated_idx" ON "public"."frd_documents"("aiGenerated");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "public"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_idx" ON "public"."audit_logs"("entityType");

-- CreateIndex
CREATE INDEX "audit_logs_entityId_idx" ON "public"."audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "public"."notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_readAt_idx" ON "public"."notifications"("readAt");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "public"."notifications"("createdAt");

-- CreateIndex
CREATE INDEX "_InputToSolution_B_index" ON "public"."_InputToSolution"("B");

-- CreateIndex
CREATE INDEX "_InputToInputGroup_B_index" ON "public"."_InputToInputGroup"("B");

-- AddForeignKey
ALTER TABLE "public"."inputs" ADD CONSTRAINT "inputs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "public"."inputs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "public"."solutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "public"."requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "public"."inputs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "public"."solutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."input_groups" ADD CONSTRAINT "input_groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solutions" ADD CONSTRAINT "solutions_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "public"."solutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."requirements" ADD CONSTRAINT "requirements_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "public"."solutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."requirements" ADD CONSTRAINT "requirements_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."frd_documents" ADD CONSTRAINT "frd_documents_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "public"."solutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."frd_documents" ADD CONSTRAINT "frd_documents_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."frd_documents" ADD CONSTRAINT "frd_documents_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InputToSolution" ADD CONSTRAINT "_InputToSolution_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."inputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InputToSolution" ADD CONSTRAINT "_InputToSolution_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InputToInputGroup" ADD CONSTRAINT "_InputToInputGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."inputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InputToInputGroup" ADD CONSTRAINT "_InputToInputGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."input_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
