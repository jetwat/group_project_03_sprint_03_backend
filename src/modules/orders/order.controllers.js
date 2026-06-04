import { Order } from './order.model.js';
import { Product } from '../products/product.model.js';
import { Cart } from '../carts/cart.model.js';
import mongoose from 'mongoose';

function createValidationError(message) {
  const err = new Error(message);
  err.name = 'ValidationError';
  err.status = 400;
  return err;
}

//Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    // return res.status(400).json({ success: false, error: error });
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  const { total_amount, status, order_item } = req.body || {};

  if (
    total_amount === undefined ||
    !status ||
    !Array.isArray(order_item) ||
    order_item.length === 0
  ) {
    return next(
      createValidationError('user_id, total_amount, status, order_item are required')
    );
  }

  const stockRequests = new Map();

  for (const item of order_item) {
    const quantity = Number(item.quantity);
    const bookId = item.book_id;

    if (!mongoose.Types.ObjectId.isValid(bookId) || quantity < 1) {
      return next(createValidationError('Valid book_id and quantity are required'));
    }

    stockRequests.set(bookId, (stockRequests.get(bookId) || 0) + quantity);
  }

  const decrementedStock = [];

  try {
    for (const [bookId, quantity] of stockRequests) {
      const result = await Product.updateOne(
        { _id: bookId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } }
      );

      if (result.modifiedCount === 0) {
        const product = await Product.findById(bookId).select('book_name stock');
        const bookName = product?.book_name || bookId;
        const availableStock = product?.stock ?? 0;

        throw createValidationError(
          `${bookName} has only ${availableStock} item(s) in stock`
        );
      }

      decrementedStock.push({ bookId, quantity });
    }

    const doc = await Order.create({
      user_id: req.user.users._id,
      total_amount,
      status,
      order_item
    });

    await Cart.deleteMany({ user_id: req.user.users._id });

    return res.status(201).json({
      success: true,
      data: doc
    });
  } catch (err) {
    if (decrementedStock.length > 0) {
      await Promise.allSettled(
        decrementedStock.map(({ bookId, quantity }) =>
          Product.updateOne({ _id: bookId }, { $inc: { stock: quantity } })
        )
      );
    }

    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order id'
      });
    }

    const { status } = req.body;

    const doc = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

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

//User
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user_id: req.user.users._id
    });

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};
