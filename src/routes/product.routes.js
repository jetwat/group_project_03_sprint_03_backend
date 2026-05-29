import { Router } from 'express';
import { authUser } from '../middlewares/auth.js';
import { getProducts,getProductById,createProduct,updateProduct,deleteProduct } from '../modules/products/product.controller.js';
import { authorizeAdmin } from '../middlewares/author.js';

export const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authUser,authorizeAdmin, createProduct);
router.put('/:id', authUser,authorizeAdmin, updateProduct);
router.delete('/:id', authUser,authorizeAdmin, deleteProduct);