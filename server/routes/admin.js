import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Consultation from '../models/Consultation.js';
import Product from '../models/Product.js';

const router = express.Router();

// Setup multer storage
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ---------- User Management ----------
// GET all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password -passwordResetToken -passwordResetExpires');
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update user
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { fullName, email, phone, role } = req.body;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role && ['user', 'admin'].includes(role)) user.role = role;

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE user
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- Consultation Management ----------
// GET all consultations
router.get('/consultations', protect, admin, async (req, res) => {
  try {
    const consultations = await Consultation.find().populate('userId', 'fullName email phone').sort('-createdAt');
    // Map to requested fields
    const data = consultations.map(c => ({
      id: c._id,
      userName: c.fullName || (c.userId ? c.userId.fullName : ''),
      contactInfo: c.phoneNumber || (c.userId ? c.userId.phone : ''),
      message: c.description,
      date: c.scheduledDate || c.createdAt,
      status: c.status
    }));
    res.json({ success: true, count: data.length, consultations: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update consultation
router.put('/consultations/:id', protect, admin, async (req, res) => {
  try {
    const { status, description, scheduledDate, userName, contactInfo } = req.body;
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ success: false, message: 'Consultation not found' });

    if (status) consultation.status = status;
    if (description) consultation.description = description;
    if (scheduledDate) consultation.scheduledDate = scheduledDate;
    if (userName) consultation.fullName = userName;
    if (contactInfo) consultation.phoneNumber = contactInfo;

    await consultation.save();
    res.json({ success: true, consultation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE consultation
router.delete('/consultations/:id', protect, admin, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ success: false, message: 'Consultation not found' });
    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Consultation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- Product Management ----------
// POST create product (with image upload)
router.post('/products', protect, admin, upload.single('productPicture'), async (req, res) => {
  try {
    const { productName, productBrand, productPrice, productCategory } = req.body;
    const productPicture = req.file ? path.join('uploads', path.basename(req.file.path)) : undefined;

    if (!productName || !productPrice) {
      return res.status(400).json({ success: false, message: 'productName and productPrice are required' });
    }

    const product = await Product.create({ productName, productBrand, productPrice, productCategory, productPicture });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all products — accessible by any logged-in user (read-only for catalog view)
router.get('/products/catalog', protect, async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all products — admin only (for management)
router.get('/products', protect, admin, async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update product
router.put('/products/:id', protect, admin, upload.single('productPicture'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { productName, productBrand, productPrice, productCategory } = req.body;
    if (productName) product.productName = productName;
    if (productBrand) product.productBrand = productBrand;
    if (productPrice) product.productPrice = productPrice;
    if (productCategory) product.productCategory = productCategory;

    if (req.file) {
      // delete old file if exists
      if (product.productPicture) {
        try { fs.unlinkSync(path.join(process.cwd(), product.productPicture)); } catch (e) { }
      }
      product.productPicture = path.join('uploads', path.basename(req.file.path));
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product
router.delete('/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.productPicture) {
      try { fs.unlinkSync(path.join(process.cwd(), product.productPicture)); } catch (e) { }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
