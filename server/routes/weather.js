import express from 'express';
import { getWeatherInsights } from '../controllers/weatherController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Publicly accessible but we can protect it if needed. 
// The requirement didn't specify, but usually dashboard data is protected.
router.get('/', protect, getWeatherInsights);

export default router;
