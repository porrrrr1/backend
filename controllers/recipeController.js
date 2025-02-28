import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRecipeWithImage = async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    if (!req.user || !req.user.userId) {  // ✅ ตรวจสอบว่ามี req.user หรือไม่
      return res.status(401).json({ error: "Unauthorized" });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        content,
        imageUrl,
        author: { connect: { id: req.user.userId } },
      },
      include: { 
        author: { 
          select: { name: true } // ✅ ดึงชื่อผู้เขียนกลับไปด้วย
        } 
      }
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Create Recipe Error:", error);
    res.status(500).json({ error: "Error creating recipe" });
  }
};


export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id) },
      include: { 
        author: { 
          select: { name: true } // ✅ ดึงเฉพาะชื่อผู้เขียน
        } 
      }
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Get Recipe Error:", error);
    res.status(500).json({ error: "Error fetching recipe" });
  }
};


export const createRecipe = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User ID:", req.user?.userId);

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        content,
        author: { connect: { id: req.user.userId } }, // ✅ เชื่อมกับผู้ใช้ที่ล็อกอิน
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Create Recipe Error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // ✅ ตรวจสอบว่ามี Recipe นี้อยู่จริงหรือไม่
    const recipe = await prisma.recipe.findUnique({ where: { id: Number(id) } });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // ✅ อัปเดต Recipe
    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    res.json(updatedRecipe);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Error updating recipe" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ✅ ตรวจสอบว่ามี Recipe นี้อยู่จริงหรือไม่
    const recipe = await prisma.recipe.findUnique({ where: { id: Number(id) } });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // ✅ ลบ Recipe
    await prisma.recipe.delete({ where: { id: Number(id) } });

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Error deleting recipe" });
  }
  
};
