import { RequestHandler } from "express";
import { prisma } from "../config.js";


const bookSeat: RequestHandler = async (req, res) => {
  try {
    const { showId } = req.params;
    const intShowId = Number.parseInt(showId);
    const { seatIds, userId } = req.body.data; // seatIds is now an array

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0 || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if show exists
    const show = await prisma.show.findUnique({
      where: { id: intShowId },
    });
    if (!show) {
      return res.status(400).json({ message: "Show is not available" });
    }

    // Transaction to book multiple seats
    const reservations = await prisma.$transaction(async (tx) => {
      // 1️⃣ Check availability of all seats
      const seats = await tx.seat.findMany({
        where: { id: { in: seatIds } },
      });

      const unavailableSeats = seats.filter((s) => s.isBooked);
      if (unavailableSeats.length > 0) {
        throw new Error(
          `Seats already booked: ${unavailableSeats.map((s) => s.seatNo).join(", ")}`
        );
      }

      // 2️⃣ Update all seats to booked
      await tx.seat.updateMany({
        where: { id: { in: seatIds }, isBooked: false },
        data: { isBooked: true },
      });

      // 3️⃣ Create reservations for each seat
      const createdReservations = await Promise.all(
        seatIds.map((seatId) =>
          tx.reservation.create({
            data: {
              status: "CONFIRMED",
              userId,
              seatId,
              showId: intShowId,
            },
          })
        )
      );

      return createdReservations;
    });

    return res.status(200).json({ data: reservations });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

const getAllSeats: RequestHandler = async (req, res) => {
  try {
    console.log("getAllSeats")
    const { showId } = req.params;
    if (!showId) {
      return res.status(400).json({ message: "showid is required" })
    }
    const intShowId = parseInt(showId);
    const seats = await prisma.seat.findMany({
      where: { showId: intShowId },
      orderBy:{
        id:"asc"
      },
      select: { id: true, seatNo: true, isBooked: true }
    });
    return res.status(200).json({ data: seats })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to get data" })
  }
}

const cancelBooking: RequestHandler = async (req, res) => {
  try {
    const { reservationId } = req.params; // this should be any reservation id from the group
    const { userId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ message: "Invalid reservation id" });
    }

    const intReservationId = parseInt(reservationId);

    // Find the reservation to get the showId
    const reservation = await prisma.reservation.findUnique({
      where: { id: intReservationId },
    });

    if (!reservation || reservation.userId !== userId) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status === "CANCELLED") {
      return res.status(400).json({ message: "This reservation has already been cancelled." });
    }

    const showId = reservation.showId;

    // Find all reservations of this user for this show
    const userReservations = await prisma.reservation.findMany({
      where: {
        userId,
        showId,
        status: "CONFIRMED",
      },
    });

    if (!userReservations.length) {
      return res.status(404).json({ message: "No active reservations found to cancel." });
    }

    // Cancel all reservations and free up seats in a transaction
    await prisma.$transaction([
      prisma.reservation.updateMany({
        where: { id: { in: userReservations.map(r => r.id) } },
        data: { status: "CANCELLED" },
      }),
      prisma.seat.updateMany({
        where: { id: { in: userReservations.map(r => r.seatId) } },
        data: { isBooked: false },
      }),
    ]);

    return res.status(200).json({
      message: "Successfully cancelled all bookings for this show.",
      cancelledIds: userReservations.map(r => r.id),
    });


  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to cancel. Please try again." });
  }
};


const myBooking: RequestHandler = async (req, res) => {
  try {
    const id = req.user?.id;
    if(!id) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: id,
        status: "CONFIRMED", // ✅ only active ones
      },
      include: {
        show: true,
        seat: true,
      },
    });

    if (!reservations.length) {
      return res.status(200).json({ data: [], message: "No active reservations found" });
    }

    return res.status(200).json({ data: reservations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch reservations" });
  }
};


export {
  bookSeat,
  getAllSeats,
  cancelBooking,
  myBooking,
}