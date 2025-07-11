import express from 'express';
import { listOfferings, createOffering, deleteOffering } from '../controllers/offeringController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', auth, listOfferings);
router.post('/', auth, createOffering);
router.delete('/:id', auth, deleteOffering);

export default router; 