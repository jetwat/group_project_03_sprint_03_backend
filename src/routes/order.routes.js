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

router.get('/', authUser, authorizeAdmin, getOrders);

router.get('/:user_id', authUser, getUserOrders);

router.post('/', authUser, createOrder);

router.patch('/:id', authUser, authorizeAdmin, updateOrder);

router.delete('/:id', authUser, authorizeAdmin, deleteOrder);
