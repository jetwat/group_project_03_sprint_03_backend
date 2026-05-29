import Favorite from './favorite.model.js';
import { Product } from '../products/product.model.js';

// getUserLikes
export const getUserLikes = async (req, res, next) => {
  try {
    const userId = req.user.users._id;
    const favorites = await Favorite.findOne({ user_id: userId });
    if (!favorites) {
      return res
        .status(404)
        .json({ success: false, message: 'No favorites found' });
    }
    return res.status(200).json({ success: true, data: favorites });
  } catch (err) {
    next(err);
  }
};

// toggleLike
export const toggleLike = async (req, res, next) => {
  try {
    const userId = req.user.users._id;
    const bookId = req.params.id;

    const book = await Product.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    }

    let favorites = await Favorite.findOne({ user_id: userId });

    if (!favorites) {
      favorites = await Favorite.create({
        user_id: userId,
        favorite_items: [
          {
            book_id: book._id,
            book_name: book.book_name,
            author: book.author,
            price: book.price,
            img_link: book.img_link,
            isDiscount: book.isDiscount || false,
            discountPercent: book.discountPercent || 0
          }
        ]
      });
      return res.status(201).json({
        success: true,
        message: 'Added to favorites',
        data: favorites
      });
    }

    const existingIndex = favorites.favorite_items.findIndex(
      (item) => item.book_id.toString() === bookId
    );

    if (existingIndex > -1) {
      favorites.favorite_items.splice(existingIndex, 1);
      await favorites.save();
      return res.status(200).json({
        success: true,
        message: 'Removed from favorites',
        data: favorites
      });
    } else {
      favorites.favorite_items.push({
        book_id: book._id,
        book_name: book.book_name,
        author: book.author,
        price: book.price,
        img_link: book.img_link,
        isDiscount: book.isDiscount || false,
        discountPercent: book.discountPercent || 0
      });
      await favorites.save();
      return res.status(200).json({
        success: true,
        message: 'Added to favorites',
        data: favorites
      });
    }
  } catch (err) {
    next(err);
  }
};

// updateFavorite (PATCH) เราทุกอย่างไว้ที่ post แล้ว (ซ้ำกัน)
export const updateFavorite = async (req, res, next) => {
  try {
    const userId = req.user.users._id;
    const bookId = req.params.id;
    const updateData = req.body;

    let favorites = await Favorite.findOne({ user_id: userId });
    if (!favorites) {
      return res
        .status(404)
        .json({ success: false, message: 'No favorites found' });
    }

    const existingIndex = favorites.favorite_items.findIndex(
      (item) => item.book_id.toString() === bookId
    );

    if (existingIndex > -1) {
      Object.assign(favorites.favorite_items[existingIndex], updateData);

      await favorites.save();
      return res.status(200).json({
        success: true,
        message: 'Favorite updated successfully',
        data: favorites
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found in favorites' });
    }
  } catch (err) {
    next(err);
  }
};

// deleteFavorite (DELETE) ซ้ำกับ togglelike แล้ว แต่ก็เรียกใช้ได้
export const deleteFavorite = async (req, res, next) => {
  try {
    const userId = req.user.users._id;
    const bookId = req.params.id;

    let favorites = await Favorite.findOne({ user_id: userId });
    if (!favorites) {
      return res
        .status(404)
        .json({ success: false, message: 'No favorites found' });
    }

    const existingIndex = favorites.favorite_items.findIndex(
      (item) => item.book_id.toString() === bookId
    );

    if (existingIndex > -1) {
      favorites.favorite_items.splice(existingIndex, 1);
      await favorites.save();
      return res.status(200).json({
        success: true,
        message: 'Favorite deleted successfully',
        data: favorites
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found in favorites' });
    }
  } catch (err) {
    next(err);
  }
};
