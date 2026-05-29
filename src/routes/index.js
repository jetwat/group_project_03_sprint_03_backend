import { Router } from 'express';

import { router as userRouter } from './users.routes.js';
import { router as favoriteRouter } from './favorite.routes.js';
import { router as orderRouter } from './order.routes.js';
import { router as ReviewRouter } from './reviews.routes.js';

export const router = Router();

router.use('/users', userRouter);
router.use('/favorites', favoriteRouter);
router.use('/orders', orderRouter);
router.use('reviews', reviewRouter);
