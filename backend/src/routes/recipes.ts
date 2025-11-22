import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/images');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, steps, duration } = req.body;
    
    if (!title || !ingredients || !steps) {
      return res.status(400).json({ error: 'Title, ingredients, and steps are required' });
    }
    
    // If an image was uploaded, store its path
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = `/uploads/images/${req.file.filename}`;
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
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, steps, duration, keepExistingImage } = req.body;
    
    // Get the existing recipe to potentially delete old image
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) }
    });
    
    let imageUrl = existingRecipe?.imageUrl;
    
    // If a new image was uploaded, use it and delete the old one
    if (req.file) {
      imageUrl = `/uploads/images/${req.file.filename}`;
      
      // Delete old image if it exists and is a local file
      if (existingRecipe?.imageUrl && existingRecipe.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '../..', existingRecipe.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (keepExistingImage === 'false') {
      // User wants to remove the image
      if (existingRecipe?.imageUrl && existingRecipe.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '../..', existingRecipe.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = null;
    }
    
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
    
    // Get the recipe to check if it has an image
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) }
    });
    
    // Delete the recipe from database
    await prisma.recipe.delete({
      where: { id: parseInt(id) }
    });
    
    // Delete associated image file if it exists and is local
    if (recipe?.imageUrl && recipe.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../..', recipe.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
