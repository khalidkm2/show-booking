-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."Show" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "startingTime" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Seat" (
    "id" SERIAL NOT NULL,
    "seatNo" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL,
    "showId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Show_id_key" ON "public"."Show"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_id_key" ON "public"."Reservation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_id_key" ON "public"."Seat"("id");

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "public"."Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
