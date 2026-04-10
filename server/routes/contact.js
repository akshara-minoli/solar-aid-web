import express from 'express';
import { body } from 'express-validator';
import {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
];

// Public route - submit contact form
router.post('/', contactValidation, submitContactForm);

// Public debug route - temporarily remove protection to check data
router.get('/debug', getAllContacts);

// Protected routes - for admin/authenticated users
router.get('/', protect, getAllContacts);
router.get('/:id', protect, getContactById);
router.put('/:id', protect, updateContactStatus);

export default router;
