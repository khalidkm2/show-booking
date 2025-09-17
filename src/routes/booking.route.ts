import express from "express";
import { bookSeat } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/shows/:showId/reserve",bookSeat);

export default router;