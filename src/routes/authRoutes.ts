import express from "express";
import { login, register, logout, auth, verify } from "../controllers/authController.ts";
const router = express.Router();

router.get("/login", auth);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/verify", verify);

export default router;