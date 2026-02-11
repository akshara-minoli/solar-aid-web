import express from 'express';
import multer from 'multer';
import path from 'path';
import { adminLogin, getProducts, createProduct, deleteProduct } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// multer setup - store uploads in /uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const name = `${Date.now()}-${Math.random().toString(36).substring(2,8)}${ext}`;
		cb(null, name);
	}
});
const upload = multer({ storage });

router.post('/login', adminLogin);
router.get('/products', getProducts);
router.post('/products', adminAuth, upload.single('image'), createProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

export default router;
