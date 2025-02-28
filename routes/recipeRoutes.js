import express from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  deleteRecipe,
  createRecipeWithImage,
  updateRecipe,
  getRecipeById,
} from "../controllers/recipeController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ ตั้งค่าการอัปโหลดไฟล์ไปยังโฟลเดอร์ `/uploads`
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ ดึงรายการสูตรอาหาร
router.get("/", async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { author: true },
    });
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

// ✅ เส้นทาง API ที่ถูกต้อง
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  createRecipeWithImage
); // ✅ อัปโหลดรูป + บันทึกสูตรอาหาร
router.get("/:id", getRecipeById);
router.put("/:id", authenticateToken, upload.single("image"), updateRecipe);
router.delete("/:id", authenticateToken, deleteRecipe);

export default router;
