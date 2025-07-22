import express from 'express';
import { getAllUsersAndSessions, sendNewsletterToAll, getAllUsers } from '../controllers/adminController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users/all', auth, getAllUsers); // New route to get all users
router.get('/users', auth, getAllUsersAndSessions);
router.post('/newsletter', auth, sendNewsletterToAll);

export default router; 