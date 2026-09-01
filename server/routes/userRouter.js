import express from 'express';
import { getUserById, loginUser, logoutUser, signupUser } from '../controller/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { csrfVerification } from '../middleware/csrfMiddleware.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, signupSchema } from '../schema/auth.js';
const router = express.Router();

router.get('/me', requireAuth, getUserById);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', requireAuth, csrfVerification, logoutUser);

router.post('/signup', validate(signupSchema), signupUser);

export { router };
