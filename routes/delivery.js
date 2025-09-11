import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  deliverViaEmail,
  deliverViaWhatsApp,
  downloadMaterial
} from '../controllers/deliveryController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

/**
 * @route   POST /api/materials/:id/deliver/email
 * @desc    Deliver study material via email
 * @access  Private (Teacher, Admin)
 */
router.post(
  '/:id/deliver/email',
  authorize('teacher', 'admin'),
  deliverViaEmail
);

/**
 * @route   POST /api/materials/:id/deliver/whatsapp
 * @desc    Deliver study material via WhatsApp
 * @access  Private (Teacher, Admin)
 */
router.post(
  '/:id/deliver/whatsapp',
  authorize('teacher', 'admin'),
  deliverViaWhatsApp
);

/**
 * @route   GET /api/materials/:id/download
 * @desc    Download study material with token
 * @access  Public (with valid token)
 */
router.get(
  '/:id/download',
  downloadMaterial
);

export default router;
