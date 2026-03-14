-- AlterEnum
ALTER TYPE "public"."MediaType" ADD VALUE 'video';

-- CreateTable
CREATE TABLE "public"."LessonReference" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "sourceName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "verificationNote" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonReference_lessonId_sortOrder_idx" ON "public"."LessonReference"("lessonId", "sortOrder");

-- AddForeignKey
ALTER TABLE "public"."LessonReference" ADD CONSTRAINT "LessonReference_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
