import express from "express";

const router = express.Router();

// 🟢 ดึงรายชื่อผู้ใช้ทั้งหมด
router.get("/users", (req, res) => {
  res.json({ message: "ดึงรายชื่อผู้ใช้ทั้งหมด" });
});

// 🟢 แบนผู้ใช้
router.put("/ban/:id", (req, res) => {
  res.json({ message: `แบนผู้ใช้ ID ${req.params.id}` });
});

// 🟢 อนุมัติโพสต์
router.put("/approve/:postId", (req, res) => {
  res.json({ message: `อนุมัติโพสต์ ID ${req.params.postId}` });
});

// 🟢 ลบโพสต์
router.delete("/delete/:postId", (req, res) => {
  res.json({ message: `ลบโพสต์ ID ${req.params.postId}` });
});

export default router;
