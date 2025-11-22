import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/recipes - Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id - Get a single recipe
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes - Create a new recipe
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, steps, imageUrl, duration } = req.body;
    
    if (!title || !ingredients || !steps) {
      return res.status(400).json({ error: 'Title, ingredients, and steps are required' });
    }
    
    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        steps,
        imageUrl,
        duration: duration ? parseInt(duration) : null
      }
    });
    
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// PUT /api/recipes/:id - Update a recipe
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, steps, imageUrl, duration } = req.body;
    
    const recipe = await prisma.recipe.update({
      where: { id: parseInt(id) },
      data: {
        title,
        ingredients,
        steps,
        imageUrl,
        duration: duration ? parseInt(duration) : null
      }
    });
    
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE /api/recipes/:id - Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.recipe.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
