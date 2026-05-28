import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [0.5, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    review: {
      type: String,
      required: [true, "Please provide a review text"],
      trim: true,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ book_id: 1, user_id: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
