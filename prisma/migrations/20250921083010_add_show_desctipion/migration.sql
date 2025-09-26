/*
  Warnings:

  - Added the required column `category` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Show" ADD COLUMN     "ageLimit" TEXT,
ADD COLUMN     "backgroundImage" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
