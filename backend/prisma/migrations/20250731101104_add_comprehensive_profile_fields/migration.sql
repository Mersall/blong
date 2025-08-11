-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "ethnicity" TEXT,
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "weight" INTEGER;
