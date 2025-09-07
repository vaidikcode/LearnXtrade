import express from 'express';
import {
    purchaseCredits,
    completeCreditPurchase,
    purchaseCourseWithCredits,
    getCreditBalance
} from '../controllers/Credit.controller.js';
import verifyStudent from '../middlewares/auth.middleware.js';

const router = express.Router();

// Credit purchase routes
router.post('/purchase', verifyStudent, purchaseCredits);
router.post('/complete-purchase', completeCreditPurchase); 
router.post('/purchase-course', verifyStudent, purchaseCourseWithCredits);
router.get('/balance', verifyStudent, getCreditBalance);

export default router;