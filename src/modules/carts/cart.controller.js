// import à¹‚à¸¡à¹€à¸”à¸¥ Cart à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸Šà¹‰à¸•à¸´à¸”à¸•à¹ˆà¸­ collection à¸‚à¸­à¸‡ cart à¹ƒà¸™ database
import { Cart } from './cart.model.js';
// import mongoose à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸Šà¹‰à¸Ÿà¸±à¸‡à¸à¹Œà¸Šà¸±à¸™à¸Šà¹ˆà¸§à¸¢à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸š ObjectId
import mongoose from 'mongoose';

// à¸ªà¸£à¹‰à¸²à¸‡ controller à¸ªà¸³à¸«à¸£à¸±à¸šà¸”à¸¶à¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ cart à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”
export const getCart = async (req, res, next) => {
  // à¹ƒà¸Šà¹‰ try/catch à¹€à¸žà¸·à¹ˆà¸­à¸”à¸±à¸ error à¸•à¸­à¸™à¸—à¸³à¸‡à¸²à¸™à¸à¸±à¸š database
  try {
    // à¸”à¸¶à¸‡ user_id(à¸„à¸™à¸«à¸™à¸¶à¹ˆà¸‡) à¸ˆà¸²à¸ params à¹ƒà¸™ URL
    const user_id = req.params.user_id;

    // à¸„à¹‰à¸™à¸«à¸² cart à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”à¸—à¸µà¹ˆà¹€à¸›à¹‡à¸™à¸‚à¸­à¸‡ user_id à¸™à¸µà¹‰à¸ˆà¸²à¸ database
    //(à¸šà¸£à¸£à¸—à¸±à¸”à¸™à¸µà¹‰à¸„à¸·à¸­à¸ªà¸±à¹ˆà¸‡ Mongoose à¹„à¸›à¸„à¹‰à¸™à¸«à¸² cart à¹ƒà¸™ database à¹‚à¸”à¸¢à¸«à¸² document à¸—à¸µà¹ˆà¸¡à¸µ field user_id à¸•à¸£à¸‡à¸à¸±à¸š user_id à¸—à¸µà¹ˆà¸£à¸±à¸šà¸¡à¸²à¸ˆà¸²à¸ URL)
    const cart = await Cart.find({ user_id: user_id }).exec();

    // à¸ªà¹ˆà¸‡ response à¸à¸¥à¸±à¸šà¹„à¸›à¸žà¸£à¹‰à¸­à¸¡ status 200 à¹à¸¥à¸°à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ cart
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    // return res.status(400).json({ success: false, error: error });
    // à¸ªà¹ˆà¸‡ error à¹„à¸›à¹ƒà¸«à¹‰ error middleware à¸ˆà¸±à¸”à¸à¸²à¸£à¸•à¹ˆà¸­
    next(err);
  }
};

// à¸ªà¸£à¹‰à¸²à¸‡ controller à¸ªà¸³à¸«à¸£à¸±à¸šà¹€à¸žà¸´à¹ˆà¸¡ cart à¹ƒà¸«à¸¡à¹ˆ
export const createCart = async (req, res, next) => {
  const { user_id, total_amount, cart_item } = req.body || {};

  if (!user_id || !cart_item || !Array.isArray(cart_item) || cart_item.length === 0) {
    const err = new Error('user_id and cart_item are required');
    err.name = 'ValidationError';
    err.status = 400;
    return next(err);
  }

  try {
    let cart = await Cart.findOne({ user_id }).exec();

    if (!cart) {
      const doc = await Cart.create({
        user_id,
        total_amount,
        cart_item
      });

      return res.status(201).json({ success: true, data: doc });
    }

    cart_item.forEach((nextItem) => {
      const existingItem = cart.cart_item.find(
        (item) => item.book_id.toString() === nextItem.book_id.toString()
      );

      if (existingItem) {
        existingItem.quantity += nextItem.quantity || 1;
      } else {
        cart.cart_item.push(nextItem);
      }
    });

    cart.total_amount = cart.cart_item.reduce(
      (sum, item) => sum + Number(item.price.toString()) * item.quantity,
      0
    );

    const doc = await cart.save();

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};
export const updateCart = async (req, res, next) => {
  // à¹ƒà¸Šà¹‰ try/catch à¹€à¸žà¸·à¹ˆà¸­à¸”à¸±à¸ error à¸•à¸­à¸™à¸­à¸±à¸›à¹€à¸”à¸•à¸‚à¹‰à¸­à¸¡à¸¹à¸¥
  try {
    // à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¸§à¹ˆà¸² id à¸—à¸µà¹ˆà¸ªà¹ˆà¸‡à¸¡à¸²à¹ƒà¸™ params à¹€à¸›à¹‡à¸™ ObjectId à¸—à¸µà¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      // à¸–à¹‰à¸² id à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡ à¹ƒà¸«à¹‰à¸ªà¹ˆà¸‡ response status 400 à¸à¸¥à¸±à¸šà¹„à¸›
      return res.status(400).json({
        // à¸šà¸­à¸à¸§à¹ˆà¸² request à¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ
        success: false,
        // à¸ªà¹ˆà¸‡à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡ error à¸à¸¥à¸±à¸šà¹„à¸›
        error: 'Invalid Cart id'
      });
    }

    // à¸„à¹‰à¸™à¸«à¸² cart à¸ˆà¸²à¸ id à¹à¸¥à¹‰à¸§à¸­à¸±à¸›à¹€à¸”à¸•à¸”à¹‰à¸§à¸¢à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸ˆà¸²à¸ req.body
    const doc = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      // à¹ƒà¸«à¹‰ mongoose à¸ªà¹ˆà¸‡ document à¸«à¸¥à¸±à¸‡à¸­à¸±à¸›à¹€à¸”à¸•à¹à¸¥à¹‰à¸§à¸à¸¥à¸±à¸šà¸¡à¸²
      new: true,
      // à¹ƒà¸«à¹‰ mongoose à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸š validation à¸•à¸²à¸¡ schema à¸•à¸­à¸™à¸­à¸±à¸›à¹€à¸”à¸•
      runValidators: true
    });

    // à¸–à¹‰à¸²à¹„à¸¡à¹ˆà¸žà¸š cart à¸•à¸²à¸¡ id à¸—à¸µà¹ˆà¸ªà¹ˆà¸‡à¸¡à¸²
    if (!doc) {
      // à¸ªà¹ˆà¸‡ response status 404 à¸§à¹ˆà¸²à¹„à¸¡à¹ˆà¸žà¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥
      return res.status(404).json({
        // à¸šà¸­à¸à¸§à¹ˆà¸² request à¹„à¸¡à¹ˆà¸ªà¸³à¹€à¸£à¹‡à¸ˆ
        success: false,
        // à¸ªà¹ˆà¸‡à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡ error à¸à¸¥à¸±à¸šà¹„à¸›
        error: 'Cart not found'
      });
    }

    // à¸–à¹‰à¸²à¸­à¸±à¸›à¹€à¸”à¸•à¸ªà¸³à¹€à¸£à¹‡à¸ˆ à¹ƒà¸«à¹‰à¸ªà¹ˆà¸‡ response status 200 à¸à¸¥à¸±à¸šà¹„à¸›
    return res.status(200).json({
      // à¸šà¸­à¸à¸§à¹ˆà¸² request à¸ªà¸³à¹€à¸£à¹‡à¸ˆ
      success: true,
      // à¸ªà¹ˆà¸‡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥ cart à¸—à¸µà¹ˆà¸–à¸¹à¸à¸­à¸±à¸›à¹€à¸”à¸•à¹à¸¥à¹‰à¸§à¸à¸¥à¸±à¸šà¹„à¸›
      data: doc
    });
  } catch (err) {
    // à¸ªà¹ˆà¸‡ error à¹„à¸›à¹ƒà¸«à¹‰ error middleware à¸ˆà¸±à¸”à¸à¸²à¸£à¸•à¹ˆà¸­
    next(err);
  }
};

// à¸ªà¸£à¹‰à¸²à¸‡ controller à¸ªà¸³à¸«à¸£à¸±à¸šà¸¥à¸š cart à¸•à¸²à¸¡ id
export const deleteCart = async (req, res, next) => {
  // à¹ƒà¸Šà¹‰ try/catch à¹€à¸žà¸·à¹ˆà¸­à¸”à¸±à¸ error à¸•à¸­à¸™à¸¥à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥
  try {
    // à¸„à¹‰à¸™à¸«à¸² cart à¸•à¸²à¸¡ id à¹à¸¥à¹‰à¸§à¸¥à¸šà¸­à¸­à¸à¸ˆà¸²à¸ database
    const doc = await Cart.findByIdAndDelete(req.params.id);
    // à¸–à¹‰à¸²à¹„à¸¡à¹ˆà¸žà¸š cart à¸•à¸²à¸¡ id à¸—à¸µà¹ˆà¸ªà¹ˆà¸‡à¸¡à¸²
    if (!doc) {
      // à¸ªà¹ˆà¸‡ response status 404 à¸§à¹ˆà¸²à¹„à¸¡à¹ˆà¸žà¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    // à¸–à¹‰à¸²à¸¥à¸šà¸ªà¸³à¹€à¸£à¹‡à¸ˆ à¹ƒà¸«à¹‰à¸ªà¹ˆà¸‡ response status 200 à¸žà¸£à¹‰à¸­à¸¡à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸—à¸µà¹ˆà¸–à¸¹à¸à¸¥à¸šà¸à¸¥à¸±à¸šà¹„à¸›
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    // à¸ªà¹ˆà¸‡ error à¹„à¸›à¹ƒà¸«à¹‰ error middleware à¸ˆà¸±à¸”à¸à¸²à¸£à¸•à¹ˆà¸­
    next(err);
  }
};

