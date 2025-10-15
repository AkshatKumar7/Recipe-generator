import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import recognitionController from '../controllers/recognitionController.js';

const router = express.Router();

// Accept imageUrl in body. If the user is authenticated, their userId will be attached.
router.post('/upload', authMiddleware, recognitionController.recognizeFromImage);

// FatSecret image recognition endpoint
router.post('/fatsecret', authMiddleware, recognitionController.recognizeFromFatSecret);

export default router;
