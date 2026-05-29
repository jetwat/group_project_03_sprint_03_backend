import { Router } from 'express';
import {
  getUserLikes,
  toggleLike,
  updateFavorite,
  deleteFavorite
} from '../modules/favorites/favorite.controller.js';
import { authUser } from '../middlewares/auth.js';

export const router = Router();

// Get all favorite items of logged-in user
router.get('/', authUser, getUserLikes);

// Toggle (add/remove) book to/from favorites
router.post('/:id', authUser, toggleLike);

// Update favorite item
router.patch('/:id', authUser, updateFavorite);

// Delete book from favorites
router.delete('/:id', authUser, deleteFavorite);
