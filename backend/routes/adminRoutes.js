import express from 'express';
import { getAllUsersAndSessions } from '../controllers/adminController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', auth, getAllUsersAndSessions);

export default router; 