import express from 'express';
import {
  getSharingSettings,
  updateSharingSettings,
  deleteSharingSettings,
  getPublicAltar,
  getPublicAltarStories,
  addPublicAltarStory
} from '../controllers/sharingController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.get('/sessions/:sessionId/sharing', auth, getSharingSettings);
router.put('/sessions/:sessionId/sharing', auth, updateSharingSettings);
router.delete('/sessions/:sessionId/sharing', auth, deleteSharingSettings);

// Public routes (no authentication required)
router.get('/public/altar/:shareId', getPublicAltar);
router.get('/public/altar/:shareId/stories', getPublicAltarStories);
router.post('/public/altar/:shareId/stories', addPublicAltarStory);

export default router;