import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for image uploads (store in memory for Cloudinary upload)
const storage = multer.memoryStorage();

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

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'recipes',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    uploadStream.end(file.buffer);
  });
}

// Helper function to delete image from Cloudinary
async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const fileWithExt = urlParts[urlParts.length - 1];
    const publicId = 'recipes/' + fileWithExt.split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
}

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
    
    // If an image was uploaded, upload it to Cloudinary
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
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
      imageUrl = await uploadToCloudinary(req.file);
      
      // Delete old image from Cloudinary if it exists
      if (existingRecipe?.imageUrl && existingRecipe.imageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(existingRecipe.imageUrl);
      }
    } else if (keepExistingImage === 'false') {
      // User wants to remove the image
      if (existingRecipe?.imageUrl && existingRecipe.imageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(existingRecipe.imageUrl);
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
    
    // Delete associated image from Cloudinary if it exists
    if (recipe?.imageUrl && recipe.imageUrl.includes('cloudinary.com')) {
      await deleteFromCloudinary(recipe.imageUrl);
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
