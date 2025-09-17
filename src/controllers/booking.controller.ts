import { RequestHandler } from "express";
import { prisma } from "../config.js";


const bookSeat:RequestHandler = async (req, res) => {
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


export {
    bookSeat,
}