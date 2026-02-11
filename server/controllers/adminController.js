import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';

// Generate JWT token for admin
const generateAdminToken = () => {
  return jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc Admin login (simple env-based)
// @route POST /api/admin/login
// @access Public (only works with correct env creds)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Provide email and password' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateAdminToken();
    res.status(200).json({ success: true, message: 'Admin login successful', token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Error during admin login' });
  }
};

// @desc Return a simple list of products (placeholder)
// @route GET /api/admin/products
// @access Public (should be protected in production)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

// @desc Create a new product (with image upload)
// @route POST /api/admin/products
// @access Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await Product.create({ name, price: parseFloat(price), imagePath });
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Error creating product' });
  }
};

// @desc Delete a product by id
// @route DELETE /api/admin/products/:id
// @access Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // remove image file if present
    if (product.imagePath) {
      try {
        const filePath = path.join(process.cwd(), product.imagePath);
        fs.unlink(filePath, (err) => {
          if (err) console.warn('Failed to unlink product image:', err);
        });
      } catch (err) {
        console.warn('Error while deleting product image:', err);
      }
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
};
