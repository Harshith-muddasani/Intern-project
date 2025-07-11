import express from 'express';
import { listAltarStyles, createAltarStyle, deleteAltarStyle } from '../controllers/altarStyleController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', auth, listAltarStyles);
router.post('/', auth, createAltarStyle);
router.delete('/:id', auth, deleteAltarStyle);

export default router; 