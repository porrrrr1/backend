import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "./middleware/authMiddleware.js"; 
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient(); // ✅ สร้าง instance ของ Prisma
dotenv.config();
const app = express();

// ✅ แก้ไข __dirname ให้ใช้ได้ใน ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ เปิดใช้งาน Middleware
app.use(cors());
app.use(express.json());

// ✅ เสิร์ฟไฟล์อัปโหลดจากโฟลเดอร์ /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ตั้งค่า API Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

// ✅ แก้ไข API /api/profile ให้ใช้งานได้
app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId }, // ✅ ใช้ userId ที่มาจาก Token
        select: { id: true, name: true, email: true, role: true }, // ✅ ดึง role ด้วย
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // ✅ ตรวจสอบว่ามี email ซ้ำหรือไม่
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ error: "อีเมลนี้ถูกใช้แล้ว" });
      }
  
      // ✅ แฮชรหัสผ่าน
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // ✅ บันทึกผู้ใช้ใหม่
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "user", // ค่าเริ่มต้นเป็น user
        },
      });
  
      res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" });
    }
  });
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      }
  
      const token = jwt.sign(
        { userId: user.id, role: user.role }, // ✅ รวม role เข้าไปใน token
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
