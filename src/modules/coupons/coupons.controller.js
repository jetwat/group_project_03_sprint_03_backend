import { Coupon } from './coupon.model.js';

// [Admin] GET /coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json({ success: true, data: coupons });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// [Admin] POST /coupons
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// POST /coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: 'Coupon not found' });
    }

    if (coupon.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ${coupon.minOrderAmount}`
      });
    }

    let discountAmount =
      coupon.discountType === 'percentage'
        ? (orderAmount * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.discountType === 'percentage' && coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }

    return res.json({
      success: true,
      data: {
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        finalPrice: orderAmount - discountAmount,
        couponId: coupon._id
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// [Admin] PATCH /coupons/:id
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: 'Coupon not found' });
    }

    return res.json({ success: true, data: coupon });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// [Admin] DELETE /coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: 'Coupon not found' });
    }

    return res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
