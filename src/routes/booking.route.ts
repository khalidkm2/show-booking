import express from "express";
import { bookSeat, cancelBooking, getAllSeats } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/shows/:showId/reserve",bookSeat);
router.get("/shows/:showId/seats",getAllSeats);
router.patch("/reservations/:reservationId/cancel",cancelBooking);

export default router;