import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    book_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [0.5, 'Rating must be at least 0.5'],
      max: [5, 'Rating cannot be more than 5']
    },
    img_link: {
      type: String,
      required: true,
      trim: true
    },
    page: {
      type: Number,
      required: true
    },
    language: {
      type: String,
      required: true,
      trim: true
    },
    publisher: {
      type: String,
      required: true,
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    is_highlighted: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
