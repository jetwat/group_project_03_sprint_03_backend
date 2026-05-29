import { Router } from 'express';

import {
  createCoupon,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupons
} from '../modules/coupons/coupons.controller.js';
import { authUser } from '../middlewares/auth.js';

export const router = Router();

// Admin only
router.post('/', authUser, createCoupon);
router.patch('/:id', authUser, updateCoupon);
router.delete('/:id', authUser, deleteCoupon);
router.get('/', authUser, getCoupons);

// Logged-in user
router.post('/validate', authUser, validateCoupon);
