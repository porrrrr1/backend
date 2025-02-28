import express from "express";

const router = express.Router();

// 🟢 ดึงคอมเมนต์ทั้งหมด
router.get("/", (req, res) => {
  res.json({ message: "ดึงคอมเมนต์ทั้งหมด" });
});

// 🟢 เพิ่มคอมเมนต์ใหม่
router.post("/", (req, res) => {
  res.json({ message: "เพิ่มคอมเมนต์ใหม่", data: req.body });
});

// 🟢 แก้ไขคอมเมนต์
router.put("/:id", (req, res) => {
  res.json({ message: `แก้ไขคอมเมนต์ ID ${req.params.id}`, data: req.body });
});

// 🟢 ลบคอมเมนต์
router.delete("/:id", (req, res) => {
  res.json({ message: `ลบคอมเมนต์ ID ${req.params.id}` });
});

export default router;
