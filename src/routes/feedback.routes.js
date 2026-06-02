import express from 'express';
import { authUser } from '../middlewares/auth.js';
import { createFeedback } from '../modules/setting/feedback.controller.js';

export const router = express.Router();

router.get('/', authUser, createFeedback);
router.post('/', authUser, createFeedback);
