import express from "express";
import { bookSeat, cancelBooking, getAllSeats, myBooking } from "../controllers/booking.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/shows/:showId/reserve",verifyJwt, bookSeat);
router.get("/shows/:showId/seats", getAllSeats);
router.patch("/reservations/:reservationId/cancel",verifyJwt, cancelBooking);
router.get("/reservations",verifyJwt,myBooking);

export default router;