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
          ref: 'Product',
          required: true
        },
        book_name: {
          type: string,
          required: true,
          unique: true,
          trim: true
        },
        author: {
          type: string,
          required: true,
          unique: true,
          trim: true
        },

        price: {
          type: Decimal128,
          required: true,
          trim: true
        },
        img_link: {
          type: string,
          required: true,
          trim: true
        }
      }
    ]
  },
  { timestamps: true }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
