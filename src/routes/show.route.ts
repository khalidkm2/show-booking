import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import createShow, { getAllShow, getShow } from "../controllers/show.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();
// showRouter.ts
router.get("/", getAllShow);           // GET /api/v1/shows
router.get("/:id", getShow);           // GET /api/v1/shows/:id
router.post("/", verifyJwt, verifyAdmin, createShow); // POST /api/v1/shows

export default router;