import { Order } from './order.model.js';
import mongoose from 'mongoose';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    // return res.status(400).json({ success: false, error: error });
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  const { user_id, total_amount, status, order_item } = req.body || {};

  if (!user_id || !total_amount || !status || !order_item) {
    const err = new Error(
      'user_id, total_amount, status, order_item are required'
    );
    err.name = 'ValidationError';
    err.status = 400;
    return next(err);
  }

  try {
    const doc = await Order.create({
      user_id,
      total_amount,
      status,
      order_item
    });
    return res.status(201).json({ success: true, data: userResponse(doc) });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order id'
      });
    }

    const doc = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: doc
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const doc = await Order.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};
