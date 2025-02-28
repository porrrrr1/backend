import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticateToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, name: true, email: true, role: true, banned: true }
      });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user data' });
    }
  });
  
export default router;
