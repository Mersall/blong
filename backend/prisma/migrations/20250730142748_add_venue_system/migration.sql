-- CreateEnum
CREATE TYPE "PriceRange" AS ENUM ('BUDGET', 'MODERATE', 'UPSCALE', 'LUXURY');

-- AlterTable
ALTER TABLE "date_schedules" ADD COLUMN     "venueId" TEXT;

-- CreateTable
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "type" "VenueType" NOT NULL,
    "priceRange" "PriceRange" NOT NULL DEFAULT 'MODERATE',
    "rating" DOUBLE PRECISION DEFAULT 4.0,
    "capacity" INTEGER,
    "amenities" JSONB,
    "openingHours" JSONB,
    "contactInfo" JSONB,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "date_schedules" ADD CONSTRAINT "date_schedules_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
