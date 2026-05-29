import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    favorite_items: [
      {
        book_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        book_name: {
          type: String,
          required: true,
          trim: true
        },
        author: {
          type: String,
          required: true,
          trim: true
        },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true
        },
        img_link: {
          type: String,
          required: true,
          trim: true
        },
        isDiscount: {
          type: Boolean,
          default: false
        },
        discountPercent: {
          type: Number,
          default: 0,
          min: 0,
          max: 100
        }
      }
    ]
  },
  { timestamps: true }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
