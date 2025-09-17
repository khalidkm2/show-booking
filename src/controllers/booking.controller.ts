import { RequestHandler } from "express";
import { prisma } from "../config.js";


const bookSeat: RequestHandler = async (req, res) => {
    try {
        const { showId } = req.params;
        console.log(showId)
        console.log(req.body)
        const intShowId = Number.parseInt(showId);
        const { seatId, userId } = req.body.data;
        console.log(showId, seatId, userId)
        if (!showId || !seatId || !userId) {
            return res.status(400).json({ message: "all fields are required" });
        }

        //checking show if it is available or not
        const show = await prisma.show.findFirst({
            where: { id: intShowId }
        })
        if (!show) {
            return res.status(400).json({ message: "show is not available" })
        }

        //transaction
        const reservation = await prisma.$transaction(async (tx) => {
            // check seat availibility
            const seat = await tx.seat.findUnique({
                where: {
                    id: seatId
                }
            })
            if (!seat || seat.isBooked) {
                throw new Error("Seat is already booked")
            }

            //update seat
            const updatedSeat = await tx.seat.updateMany({
                where: {
                    id: seatId,
                    isBooked: false,
                },
                data: {
                    isBooked: true,
                }
            })

            if (updatedSeat.count === 0) {
                throw new Error("Seat is already booked");
            }

            //create reservation
            const reservation = await tx.reservation.create({
                data: {
                    status: "CONFIRMED", userId, seatId, showId: intShowId
                }
            })

            if (!reservation) {
                throw new Error("faild to create reservation")
            }

            return reservation;



        })
        console.log("booking", reservation)
        return res.status(200).json({ data: reservation })
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({ message: error.message })
    }
}

const getAllSeats: RequestHandler = async (req, res) => {
    try {
        const { showId } = req.params;
        if (!showId) {
            return res.status(400).json({ message: "showid is required" })
        }
        const intShowId = parseInt(showId);
        const seats = await prisma.seat.findMany({
            where: { showId: intShowId },
            select:{id:true,seatNo:true,isBooked:true}
        });
        return res.status(200).json({ data: seats })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "failed to get data" })
    }
}

const cancelBooking: RequestHandler = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { userId } = req.body;
        if (!reservationId) {
            return res.status(400).json({ message: "invalid seat id" })
        }
        const intReservationId = parseInt(reservationId)

        const reservation = await prisma.reservation.findFirst({
            where: {
                userId: userId,
                seatId: intReservationId
            }
        })

        if (!reservation) {
            return res.status(404).json({ message: "failed to found the reservation" })
        }

        if (reservation.status === "CANCELLED") {
            return res.status(400).json({ message: "This reservation has already been cancelled." });
        }

        const [updatedReservation, updatedSeat] = await prisma.$transaction([
            //updating reservation
            prisma.reservation.update({
                where: {
                    id: reservation.id,
                },
                data: {
                    status: "CANCELLED"
                }
            }),

            // updating seats
            prisma.seat.update({
                where: {
                    id: intReservationId
                },
                data: {
                    isBooked: false
                }
            })

        ])

        return res.status(200).json({ message: "Successfully cancelled the booking." });




    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "failed to cancel . plz try again" })
    }
}

export {
    bookSeat,
    getAllSeats,
    cancelBooking,
}