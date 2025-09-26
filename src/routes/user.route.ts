import express from "express";
import { checkUser, signIn, signUp } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sign-up",signUp);
router.post("/sign-in",signIn);
router.get("/me",verifyJwt,checkUser)

export default router;