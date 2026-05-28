import mongoose from "mongoose";

const cart_ItemSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_amount: {
      type: Decimal128,
      required: true,
      trim: true,
    },
    cart_item: [
      {
        book_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        book_name: {
          type: string,
          required: true,
          unique: true,
          trim: true,
        },
        author: {
          type: string,
          required: true,
          unique: true,
          trim: true,
        },
        quantity: {
          type: integer,
          required: true,
          trim: true,
        },
        price: {
          type: Decimal128,
          required: true,
          trim: true,
        },
        img_link: {
          type: string,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true },
);
export const User = mongoose.model("user", userSchema);
