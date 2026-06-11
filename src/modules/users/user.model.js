import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 72,
      select: false
    },

    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    phone: { type: String, trim: true },

    address: {
      building: { type: String, trim: true },
      road: { type: String, trim: true },
      province: { type: String, trim: true },
      district: { type: String, trim: true },
      subdistrict: { type: String, trim: true },
      postcode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'Thailand' }
    },

    card: {
      cardholder: { type: String, trim: true },
      cardNumber: { type: String, trim: true, minlength: 13, maxlength: 19 },
      expiry: {
        type: String,
        trim: true,
        match: [
          /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
          'Invalid expiry format (MM/YY)'
        ]
      },
      cvv: {
        type: String,
        select: false,
        validate: {
          validator: function (v) {
            return !v || v.length === 3;
          },
          message: 'CVV must be exactly 3 digits'
        }
      }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre('save', async function () {
  if (!this.isModified('card.cvv')) return;

  if (this.card && this.card.cvv) {
    this.card.cvv = await bcrypt.hash(this.card.cvv, 12);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
