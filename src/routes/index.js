import { Router } from "express";
import { router as userRouter } from "./users.routes.js";

export const router = Router();

router.use("/users", userRouter);
