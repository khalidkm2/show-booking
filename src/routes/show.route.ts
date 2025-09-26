import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import  { getAllShow, getShow, removeShow, createShow } from "../controllers/show.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();
// showRouter.ts
router.get("/", getAllShow);           // GET /api/v1/shows
router.get("/:showId", getShow);           // GET /api/v1/shows/:id
router.post("/", verifyJwt, verifyAdmin, createShow); // POST /api/v1/shows
router.delete("/remove/:showId",verifyJwt,verifyAdmin,removeShow);

export default router;