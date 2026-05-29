import { Router } from 'express';
import { authUser } from '../../middlewares/auth.js';
import {
  getABookReview,
  createUserReview,
  UpdateUserReview,
  DeleteUserReview
} from '../modules/reviews/review.controller.js';

export const router = Router();

router.get('/:book_id', authUser, getABookReview);
router.post('/', authUser, createUserReview);
router.put('/:id', authUser, UpdateUserReview);
router.delete('/:id', authUser, DeleteUserReview);
