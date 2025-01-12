import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { searchStocks } from '../controllers/appController';

const router = express.Router();

//Protected route only accessible to logged in users
router.route('/search').get(protect, searchStocks);

export default router;