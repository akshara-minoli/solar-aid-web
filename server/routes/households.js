import express from 'express';
import {
  addHousehold,
  getUserHouseholds,
  getHousehold,
  updateHousehold,
  deleteHousehold
} from '../controllers/householdController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, addHousehold)
  .get(protect, getUserHouseholds);

router.route('/:id')
  .get(protect, getHousehold)
  .put(protect, updateHousehold)
  .delete(protect, deleteHousehold);

export default router;