import express from 'express';
import {
    getStudentReadiness,
    getDetailedMetrics
} from '../controllers/Readiness.controller.js';
import {verifyStudent} from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get student readiness index
router.get('/score', verifyStudent, getStudentReadiness);

// Get detailed metrics breakdown
router.get('/metrics', verifyStudent, getDetailedMetrics);

export default router;
