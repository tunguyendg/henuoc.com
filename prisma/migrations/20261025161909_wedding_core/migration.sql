-- CreateEnum
CREATE TYPE "WeddingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'EDITOR');

-- CreateTable
CREATE TABLE "wedding" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "WeddingStatus" NOT NULL DEFAULT 'DRAFT',
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "themeSlug" TEXT NOT NULL,
    "themeVersion" INTEGER NOT NULL DEFAULT 1,
    "themeOptions" JSONB NOT NULL DEFAULT '{}',
    "brideName" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "brideShortName" TEXT,
    "groomShortName" TEXT,
    "brideFirst" BOOLEAN NOT NULL DEFAULT true,
    "brideParents" TEXT,
    "groomParents" TEXT,
    "brideFamilyAddr" TEXT,
    "groomFamilyAddr" TEXT,
    "inviteMessage" TEXT,
    "sections" JSONB NOT NULL DEFAULT '{}',
    "musicTrackId" TEXT,
    "rsvpDeadline" TIMESTAMP(3),
    "allowWalkInRsvp" BOOLEAN NOT NULL DEFAULT false,
    "tableSize" INTEGER NOT NULL DEFAULT 10,
    "weddingDate" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_member" (
    "weddingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_member_pkey" PRIMARY KEY ("weddingId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "wedding_slug_key" ON "wedding"("slug");

-- CreateIndex
CREATE INDEX "wedding_member_userId_idx" ON "wedding_member"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "wedding_member" ADD CONSTRAINT "wedding_member_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_member" ADD CONSTRAINT "wedding_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
