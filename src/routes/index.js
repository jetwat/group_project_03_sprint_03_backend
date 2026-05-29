import { Router } from 'express';
import { router as orderRouter } from './order.routes.js';

export const router = Router();

router.use('/orders', orderRouter);
