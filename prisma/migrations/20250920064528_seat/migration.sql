/*
  Warnings:

  - A unique constraint covering the columns `[showId,seatNo]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `column` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `row` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Seat" ADD COLUMN     "column" INTEGER NOT NULL,
ADD COLUMN     "row" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_showId_seatNo_key" ON "public"."Seat"("showId", "seatNo");
