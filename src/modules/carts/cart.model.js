import mongoose from 'mongoose';

const cart_ItemSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    total_amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      trim: true
    },
    cart_item: [
      {
        book_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        book_name: {
          type: String,
          required: true,
          unique: true,
          trim: true
        },
        author: {
          type: String,
          required: true,
          unique: true,
          trim: true
        },
        quantity: {
          type: Number,
          required: true,
          trim: true
        },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          trim: true
        },
        img_link: {
          type: String,
          required: true,
          trim: true
        },
      }
    ]
  },
  { timestamps: true }
);
export const Cart = mongoose.model('cart', cart_ItemSchema);
