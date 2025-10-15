import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import recipeController from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', recipeController.listRecipes);
router.post('/generate', authMiddleware, recipeController.generateRecipe);
router.post('/', authMiddleware, recipeController.createRecipe);
router.get('/:id', recipeController.getRecipeById);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

export default router;
