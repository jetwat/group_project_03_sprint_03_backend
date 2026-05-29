// import Router จาก express เพื่อใช้สร้าง route ย่อยของ cart
import { Router } from 'express';
// import bcrypt สำหรับเข้ารหัส password ถ้าต้องใช้ในไฟล์นี้
import bcrypt from 'bcrypt';
// import jwt สำหรับจัดการ token ถ้าต้องใช้ในไฟล์นี้
import jwt from 'jsonwebtoken';

// import controller ของ cart เพื่อนำมาใช้กับ route แต่ละเส้น
import {
  // ฟังก์ชันสำหรับดึงข้อมูล cart
  getCart,
  // ฟังก์ชันสำหรับสร้าง cart ใหม่
  createCart,
  // ฟังก์ชันสำหรับแก้ไข cart ตาม id
  updateCart,
  // ฟังก์ชันสำหรับลบ cart ตาม id
  deleteCart
} from '../modules/carts/cart.controller.js';

// import middleware สำหรับตรวจสอบ user ก่อนเข้าใช้งาน route ที่ต้อง login
import { authUser } from '../../middlewares/auth.js';

// สร้าง router ของ cart เพื่อ export ไปใช้ในไฟล์ routes หลัก
export const router = Router();

//##use controller

// เมื่อเรียก GET / จะให้ getCart ไปดึงข้อมูล cart
router.get('/:user_id', authUser, getCart);

// เมื่อเรียก POST / จะตรวจสอบ user ด้วย authUser ก่อน แล้วให้ createCart สร้าง cart ใหม่
router.post('/', authUser, createCart);

// เมื่อเรียก PATCH /:id จะให้ updateCart แก้ไข cart ตาม id ที่ส่งมา
router.patch('/:id', authUser, updateCart);

// เมื่อเรียก DELETE /:id จะให้ deleteCart ลบ cart ตาม id ที่ส่งมา
router.delete('/:id', authUser, deleteCart);
