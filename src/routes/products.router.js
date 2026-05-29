import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../modules/products/product.controller.js";

// สร้าง router สำหรับจัดการเส้นทางของสินค้า
export const router = Router();

// ดึงสินค้าทั้งหมด
// GET /api/products
router.get("/", getProducts);

// ดึงสินค้าตาม id
// GET /api/products/:id
router.get("/:id", getProductById);

// สร้างสินค้าใหม่
// POST /api/products
router.post("/", createProduct);

// อัปเดตสินค้าตาม id
// PUT /api/products/:id
router.put("/:id", updateProduct);

// ลบสินค้าตาม id
// DELETE /api/products/:id
router.delete("/:id", deleteProduct);
