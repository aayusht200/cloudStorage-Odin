import express from 'express';
import { signupUser, getUserById, loginUser, logoutUser } from '../controller/userController.js';

const router = express.Router();

router.get('/me', getUserById);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.post('/signup', signupUser);

export { router };
