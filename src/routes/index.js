import { Router } from 'express';
import { router as userRouter } from './users.routes.js';
import { router as couponRouter } from './coupons.routes.js';

export const router = Router();

router.use('/users', userRouter);
router.use('/coupons', couponRouter);
