import { Router } from 'express';

import { router as userRouter } from './users.routes.js';
import { router as favoriteRouter } from './favorite.routes.js';
import { router as orderRouter } from './order.routes.js';
import { router as reviewRouter } from './reviews.routes.js';
import { router as couponRouter } from './coupons.routes.js';

export const router = Router();

router.use('/users', userRouter);
router.use('/favorites', favoriteRouter);
router.use('/orders', orderRouter);
router.use('reviews', reviewRouter);
router.use('/coupons', couponRouter);
