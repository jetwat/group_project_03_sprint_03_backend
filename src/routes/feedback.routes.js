import express from 'express';
import { authUser } from '../middlewares/auth.js';
import { getFeedback, createFeedback } from '../modules/setting/feedback.controller.js';

export const router = express.Router();

router.get('/', authUser, getFeedback);
router.post('/', authUser, createFeedback);
