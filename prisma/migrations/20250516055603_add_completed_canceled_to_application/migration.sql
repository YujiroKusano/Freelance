-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3);
