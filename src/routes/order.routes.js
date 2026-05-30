import { Router } from 'express';

import {
  getAllOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
} from '../modules/orders/order.controllers.js';

import { authUser } from '../middlewares/auth.js';
import { authorizeAdmin } from '../middlewares/author.js';

export const router = Router();

//##use controller

router.get('/', authUser, authorizeAdmin, getAllOrders);

router.get('/me', authUser, getMyOrders);

router.post('/', authUser, createOrder);

router.patch('/:id', authUser, authorizeAdmin, updateOrderStatus);

router.delete('/:id', authUser, authorizeAdmin, deleteOrder);
