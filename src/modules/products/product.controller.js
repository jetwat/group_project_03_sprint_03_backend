// import Product model เข้ามาเพื่อใช้คุยกับ MongoDB
import { Product } from './product.model.js';

// ดึงสินค้าทั้งหมด
export const getProducts = async (req, res, next) => {
  try {
    // ใช้ Product.find() เพื่อดึงข้อมูลทุก document ใน collection products
    const products = await Product.find();

    // ส่งข้อมูลกลับไปพร้อม status 200
    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    // ถ้ามี error ให้ส่งต่อไปที่ error middleware ของ Express
    next(error);
  }
};

// ดึงสินค้าตาม id
export const getProductById = async (req, res, next) => {
  try {
    // ดึง id ออกจาก URL params เช่น /products/123
    const { id } = req.params;

    // หา product จาก _id ใน MongoDB
    const product = await Product.findById(id);

    // ถ้าไม่เจอ product ให้ตอบกลับว่าไม่พบข้อมูล
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // ถ้าเจอ product ให้ส่งกลับไป
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // ถ้า id format ไม่ถูก หรือ query พัง จะมาจบตรงนี้
    next(error);
  }
};

// สร้างสินค้าใหม่
export const createProduct = async (req, res, next) => {
  try {
    // รับข้อมูลจาก req.body ที่ frontend หรือ Postman ส่งมา
    const {
      book_name,
      title,
      isbn,
      price,
      rating,
      img_link,
      page,
      language,
      publisher,
      stock,
      is_highlighted,
      category,
      author,
      isDiscount,
      discountPercent
    } = req.body;

    // เช็กเฉพาะ field ที่จำเป็นจริง ๆ สำหรับการสร้างสินค้าใหม่
    // field ที่เป็น number หรือ boolean ควรเช็กด้วย === undefined
    // เพื่อไม่ให้ค่า 0 หรือ false ถูกมองว่าเป็นค่าว่าง
    if (
      !book_name ||
      !title ||
      !isbn ||
      price === undefined ||
      rating === undefined ||
      !img_link ||
      page === undefined ||
      !language ||
      !publisher ||
      stock === undefined ||
      is_highlighted === undefined ||
      !category ||
      !author
    ) {
      const err = new Error(
        'All book information must be provided completely.'
      );
      err.name = 'ValidationError';
      err.status = 400;
      return next(err);
    }

    // ถ้าบอกว่าสินค้าลดราคา ต้องมีเปอร์เซ็นต์ส่วนลดมากกว่า 0
    if (
      isDiscount === true &&
      (discountPercent === undefined || discountPercent <= 0)
    ) {
      const err = new Error(
        'discountPercent must be more than 0 when isDiscount is true.'
      );
      err.name = 'ValidationError';
      err.status = 400;
      return next(err);
    }

    // ถ้าบอกว่าสินค้าไม่ได้ลดราคา ไม่ควรส่งเปอร์เซ็นต์ส่วนลดที่มากกว่า 0 มา
    if (isDiscount === false && discountPercent > 0) {
      const err = new Error(
        'discountPercent should be 0 when isDiscount is false.'
      );
      err.name = 'ValidationError';
      err.status = 400;
      return next(err);
    }

    // สร้าง product ใหม่ในฐานข้อมูล
    const product = await Product.create({
      book_name,
      title,
      isbn,
      price,
      rating,
      img_link,
      page,
      language,
      publisher,
      stock,
      is_highlighted,
      category,
      author,
      isDiscount,
      discountPercent
    });

    // ส่งข้อมูลที่สร้างสำเร็จกลับไป ใช้ status 201 เพราะเป็นการ create
    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // ถ้าข้อมูลไม่ผ่าน validation เช่น isbn ซ้ำ หรือ field ไม่ครบ จะเข้า catch
    next(error);
  }
};

// อัปเดตสินค้า
export const updateProduct = async (req, res, next) => {
  try {
    // ดึง id จาก params
    const { id } = req.params;

    // ดึง field ส่วนลดออกมาเพื่อเช็กความสัมพันธ์ของข้อมูล
    const { isDiscount, discountPercent } = req.body;

    // ถ้าผู้ใช้เปิดสถานะลดราคา ต้องส่งเปอร์เซ็นต์ลดมาด้วย
    if (
      isDiscount === true &&
      (discountPercent === undefined || discountPercent <= 0)
    ) {
      const err = new Error(
        'discountPercent must be more than 0 when isDiscount is true.'
      );
      err.status = 400;
      return next(err);
    }

    // ถ้าผู้ใช้ปิดสถานะลดราคา แต่ยังใส่เปอร์เซ็นต์ลดอยู่ ข้อมูลจะขัดกัน
    if (isDiscount === false && discountPercent > 0) {
      const err = new Error(
        'discountPercent should be 0 when isDiscount is false.'
      );
      err.status = 400;
      return next(err);
    }

    // ใช้ findByIdAndUpdate เพื่อแก้ไขข้อมูลตาม id
    const product = await Product.findByIdAndUpdate(id, req.body, {
      // new: true หมายถึงให้คืนค่าหลัง update แล้ว
      new: true,
      // runValidators: true ให้เช็ก schema ตอน update ด้วย
      runValidators: true
    });

    // ถ้าไม่เจอสินค้าที่จะอัปเดต
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // ถ้าอัปเดตสำเร็จส่งข้อมูลใหม่กลับไป
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // ถ้า update ไม่ผ่าน validation หรือ id ผิด format จะมาตรงนี้
    next(error);
  }
};

// ลบสินค้า
export const deleteProduct = async (req, res, next) => {
  try {
    // ดึง id จาก params
    const { id } = req.params;

    // ลบข้อมูลตาม id
    const product = await Product.findByIdAndDelete(id);

    // ถ้าไม่เจอ product ที่จะลบ
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // ถ้าลบสำเร็จตอบกลับข้อความยืนยัน
    return res.status(200).json({
      success: true,
      message: 'Deleted successfully'
    });
  } catch (error) {
    // ส่ง error ต่อให้ middleware
    next(error);
  }
};
