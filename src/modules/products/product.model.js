import mongoose from "mongoose";
import bcrypt from "bcrypt";

const productSchema = new mongoose.Schema(
  {
    book_name: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 0,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 0,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Decimal128,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [0.5, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    img_link: {
      type: String,
      required: true,
      trim: true,
    },
    Page: {
      type: Number,
      required: true,
    },
    Language: {
      type: String,
      required: true,
    },
    Publisher: {
      type: String,
      required: true,
    },
    stock: {
      type: Integer,
      required: true,
      trim: true,
    },
    is_highlighted: { type: String, required: true },
    img_link: {
      type: String,
      required: true,
      trim: true,
    },
    category: { type: String, required: true, unique: true, trim: true },
    author: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
