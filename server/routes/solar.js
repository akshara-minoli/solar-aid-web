import express from 'express';
import { 
  calculateSolarProduction, 
  estimateSystemSize,
  getAvailableDistricts 
} from '../controllers/solarController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/districts', getAvailableDistricts);

// Protected routes (require authentication)
router.post('/calculate/:householdId', protect, calculateSolarProduction);
router.get('/estimate-size/:householdId', protect, estimateSystemSize);

export default router;
