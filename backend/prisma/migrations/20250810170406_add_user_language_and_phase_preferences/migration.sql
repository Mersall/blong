-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentPhase" TEXT DEFAULT 'single',
ADD COLUMN     "preferredLanguage" TEXT DEFAULT 'en';
