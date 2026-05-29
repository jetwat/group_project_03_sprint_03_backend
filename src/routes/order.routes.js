import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder
} from '../controllers/order.controllers.js';

import { authUser } from '../../middlewares/auth.js';

export const router = Router();

//##use controller

router.get('/', getOrders);

router.post('/', createOrder);

router.patch('/:id', updateOrder);

router.delete('/:id', deleteOrder);
