import { Feedback } from './feedback.model.js';
import mongoose from 'mongoose';


export const getFeedback = async (req,res,next) => {
  const feedbacks = await Feedback.find();
  return res.status(200).json({success:true,data:feedbacks})
}

export const createFeedback = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const feedback = await Feedback.create({
      user_id: req.user.users._id,
      message
    });

    return res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (err) {
    next(err);
  }
};
