import express from 'express';
import { register, login, profile, updatePassword, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);
router.post('/update-password', auth, updatePassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router; 