import { Router } from 'express';

import {
  createCoupon,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupons
} from '../modules/coupons/coupons.controller.js';
import { authUser } from '../middlewares/auth.js';
import { authorizeAdmin } from '../middlewares/author.js';

export const router = Router();

// Admin only
router.post('/', authUser,authorizeAdmin, createCoupon);
router.patch('/:id', authUser,authorizeAdmin, updateCoupon);
router.delete('/:id', authUser,authorizeAdmin, deleteCoupon);
router.get('/', authUser,authorizeAdmin, getCoupons);

// Logged-in user
router.post('/validate', authUser, validateCoupon);
