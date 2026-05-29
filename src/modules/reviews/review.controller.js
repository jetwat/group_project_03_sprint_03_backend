import { Review } from './review.model.js';
import { Product } from '../products/product.model.js';

export const getABookReview = async (req, res, next) => {
  try {
    const book_id = req.params.book_id;
    const book = await Product.findById(book_id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    }
    const reviews = await Review.find({ book_id: book_id }).exec();
    if (!reviews) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }
    return res.status(200).json({ success: true, message: reviews });
  } catch (err) {
    next(err);
  }
};

export const createUserReview = async (req, res, next) => {
  try {
    const { rating, review, user_id, book_id } = req.body || {};
    const book = await Product.findById(book_id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    }
    if (!rating || !review || !user_id || !book_id) {
      res.status(400).json({ success: false, message: 'Data missing' });
    }
    const data = await Review.create({ rating, review, user_id, book_id });
    return res.status(201).json({ success: true, data: data });
  } catch (err) {
    next(err);
  }
};

export const UpdateUserReview = async (req, res, next) => {
  try {
    const { rating, review, user_id, book_id } = req.body || {};
    const book = await Product.findById(book_id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    }
    if (!rating || !review || !user_id || !book_id) {
      res.status(400).json({ success: false, message: 'Data missing' });
    }

    const updates = {};

    if (rating !== undefined) updates.rating = rating;
    if (review !== undefined) updates.review = review;
    if (user_id !== undefined) updates.user_id = user_id;
    if (book_id !== undefined) updates.book_id = book_id;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one field is required to update'
      });
    }

    const doc = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, error: 'Review not found' });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const DeleteUserReview = async (req, res, next) => {
  try {
    const doc = await Review.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, error: 'REview not found' });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};
