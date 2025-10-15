import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/preferences', authMiddleware, userController.getPreferences);
router.put('/preferences', authMiddleware, userController.updatePreferences);

router.post('/favourites', authMiddleware, userController.addFavourite);
router.delete('/favourites', authMiddleware, userController.removeFavourite);

router.get('/history', authMiddleware, userController.getHistory);

export default router;
