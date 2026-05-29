// import โมเดล Cart เพื่อใช้ติดต่อ collection ของ cart ใน database
import { Cart } from './cart.model.js';
// import mongoose เพื่อใช้ฟังก์ชันช่วยตรวจสอบ ObjectId
import mongoose from 'mongoose';

// สร้าง controller สำหรับดึงข้อมูล cart ทั้งหมด
export const getCart = async (req, res, next) => {
  // ใช้ try/catch เพื่อดัก error ตอนทำงานกับ database
  try {
    // ดึง user_id(คนหนึ่ง) จาก params ใน URL
    const user_id = req.params.user_id;

    // ค้นหา cart ทั้งหมดที่เป็นของ user_id นี้จาก database
    //(บรรทัดนี้คือสั่ง Mongoose ไปค้นหา cart ใน database โดยหา document ที่มี field user_id ตรงกับ user_id ที่รับมาจาก URL)
    const cart = await Cart.find({ user_id: user_id }).exec();

    // ส่ง response กลับไปพร้อม status 200 และข้อมูล cart
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    // return res.status(400).json({ success: false, error: error });
    // ส่ง error ไปให้ error middleware จัดการต่อ
    next(err);
  }
};

// สร้าง controller สำหรับเพิ่ม cart ใหม่
export const createCart = async (req, res, next) => {
  // ดึงข้อมูลที่ต้องใช้จาก body ของ request ถ้า req.body ไม่มีค่าให้ใช้ object ว่างแทน
  const { user_id, total_amount, status, cart_item } = req.body || {};

  // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาครบหรือไม่
  if (!user_id || !total_amount || !status || !cart_item) {
    // สร้าง error ใหม่เพื่อบอกว่าข้อมูลไม่ครบ
    const err = new Error(
      'user_id, total_amount, status, cart_item are required'
    );
    // ตั้งชื่อ error เป็น ValidationError
    err.name = 'ValidationError';
    // ตั้ง status code เป็น 400 เพราะเป็น request ที่ข้อมูลไม่ถูกต้อง
    err.status = 400;
    // ส่ง error ไปให้ error middleware และหยุดการทำงานของฟังก์ชัน
    return next(err);
  }

  // ใช้ try/catch เพื่อดัก error ตอนสร้างข้อมูลใน database
  try {
    // สร้าง document cart ใหม่ใน database ด้วยข้อมูลจาก request body
    const doc = await Cart.create({
      // กำหนด user_id ให้กับ cart
      user_id,
      // กำหนดยอดรวมของ cart
      total_amount,
      // กำหนดสถานะของ cart
      status,
      // กำหนดรายการสินค้าใน cart
      cart_item
    });
    // ส่ง response กลับไปพร้อม status 201 และข้อมูล cart ที่สร้างสำเร็จ
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    // ส่ง error ไปให้ error middleware จัดการต่อ
    next(err);
  }
};

// สร้าง controller สำหรับแก้ไข cart ตาม id
export const updateCart = async (req, res, next) => {
  // ใช้ try/catch เพื่อดัก error ตอนอัปเดตข้อมูล
  try {
    // ตรวจสอบว่า id ที่ส่งมาใน params เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      // ถ้า id ไม่ถูกต้อง ให้ส่ง response status 400 กลับไป
      return res.status(400).json({
        // บอกว่า request ไม่สำเร็จ
        success: false,
        // ส่งข้อความ error กลับไป
        error: 'Invalid Cart id'
      });
    }

    // ค้นหา cart จาก id แล้วอัปเดตด้วยข้อมูลจาก req.body
    const doc = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      // ให้ mongoose ส่ง document หลังอัปเดตแล้วกลับมา
      new: true,
      // ให้ mongoose ตรวจสอบ validation ตาม schema ตอนอัปเดต
      runValidators: true
    });

    // ถ้าไม่พบ cart ตาม id ที่ส่งมา
    if (!doc) {
      // ส่ง response status 404 ว่าไม่พบข้อมูล
      return res.status(404).json({
        // บอกว่า request ไม่สำเร็จ
        success: false,
        // ส่งข้อความ error กลับไป
        error: 'Cart not found'
      });
    }

    // ถ้าอัปเดตสำเร็จ ให้ส่ง response status 200 กลับไป
    return res.status(200).json({
      // บอกว่า request สำเร็จ
      success: true,
      // ส่งข้อมูล cart ที่ถูกอัปเดตแล้วกลับไป
      data: doc
    });
  } catch (err) {
    // ส่ง error ไปให้ error middleware จัดการต่อ
    next(err);
  }
};

// สร้าง controller สำหรับลบ cart ตาม id
export const deleteCart = async (req, res, next) => {
  // ใช้ try/catch เพื่อดัก error ตอนลบข้อมูล
  try {
    // ค้นหา cart ตาม id แล้วลบออกจาก database
    const doc = await Cart.findByIdAndDelete(req.params.id);
    // ถ้าไม่พบ cart ตาม id ที่ส่งมา
    if (!doc) {
      // ส่ง response status 404 ว่าไม่พบข้อมูล
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    // ถ้าลบสำเร็จ ให้ส่ง response status 200 พร้อมข้อมูลที่ถูกลบกลับไป
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    // ส่ง error ไปให้ error middleware จัดการต่อ
    next(err);
  }
};
