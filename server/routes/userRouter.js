import express from 'express';
import { getUserById, loginUser, logoutUser, signupUser } from '../controller/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/me', getUserById);
router.post('/login', loginUser);
router.post('/logout', requireAuth, logoutUser);

router.post('/signup', signupUser);

export { router };
