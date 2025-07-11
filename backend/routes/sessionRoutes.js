import express from 'express';
import { listSessions, saveSession, deleteSession } from '../controllers/sessionController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', auth, listSessions);
router.post('/', auth, saveSession);
router.delete('/:name', auth, deleteSession);

export default router; 