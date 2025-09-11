import { sendMaterialByEmail, sendDownloadLinkByEmail } from '../utils/emailService.js';
import { sendMaterialByWhatsApp } from '../utils/whatsappService.js';
import Material from '../models/Material.js';
import Delivery from '../models/Delivery.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Generate a secure download token with expiration
const generateDownloadToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration
  
  return {
    token,
    expiresAt
  };
};

/**
 * @desc    Deliver study material via email
 * @route   POST /api/materials/:id/deliver/email
 * @access  Private
 */
export const deliverViaEmail = asyncHandler(async (req, res, next) => {
  const material = await Material.findById(req.params.id);
  
  if (!material) {
    return next(new ErrorResponse(`Material not found with id of ${req.params.id}`, 404));
  }

  // Check if user is authorized to access this material
  if (material.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to deliver this material`, 403));
  }

  const { email, name = 'Student' } = req.body;
  
  if (!email) {
    return next(new ErrorResponse('Please provide a recipient email', 400));
  }

  try {
    // Generate a download token
    const { token, expiresAt } = generateDownloadToken();
    
    // Create a new delivery
    const delivery = await Delivery.create({
      materialId: material._id,
      userId: req.user.id,
      email,
      token,
      expiresAt,
      deliveryMethod: 'email'
    });
    
    // Create download link
    const downloadLink = `${process.env.FRONTEND_URL}/download/${material._id}?token=${token}`;
    
    // Send email with download link
    await sendDownloadLinkByEmail(email, name, material.title, downloadLink);
    
    res.status(200).json({
      success: true,
      message: 'Study material sent successfully via email',
      data: {
        materialId: material._id,
        email,
        downloadLink,
        expiresAt
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Error sending material via email: ${error.message}`, 500));
  }
});

/**
 * @desc    Deliver study material via WhatsApp
 * @route   POST /api/materials/:id/deliver/whatsapp
 * @access  Private
 */
export const deliverViaWhatsApp = asyncHandler(async (req, res, next) => {
  const material = await Material.findById(req.params.id);
  
  if (!material) {
    return next(new ErrorResponse(`Material not found with id of ${req.params.id}`, 404));
  }

  // Check if user is authorized to access this material
  if (material.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to deliver this material`, 403));
  }

  const { phone, name = 'Student' } = req.body;
  
  if (!phone) {
    return next(new ErrorResponse('Please provide a recipient phone number', 400));
  }

  try {
    // Generate a download token
    const { token, expiresAt } = generateDownloadToken();
    
    // Create a new delivery
    const delivery = await Delivery.create({
      materialId: material._id,
      userId: req.user.id,
      phone,
      token,
      expiresAt,
      deliveryMethod: 'whatsapp'
    });
    
    // Create download link
    const downloadLink = `${process.env.FRONTEND_URL}/download/${material._id}?token=${token}`;
    
    // Send WhatsApp message with download link
    await sendMaterialByWhatsApp(phone, name, material.title, downloadLink);
    
    res.status(200).json({
      success: true,
      message: 'Study material sent successfully via WhatsApp',
      data: {
        materialId: material._id,
        phone,
        expiresAt
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Error sending material via WhatsApp: ${error.message}`, 500));
  }
});

/**
 * @desc    Download study material with token
 * @route   GET /api/materials/:id/download
 * @access  Public (with token)
 */
export const downloadMaterial = asyncHandler(async (req, res, next) => {
  const material = await Material.findById(req.params.id);
  
  if (!material) {
    return next(new ErrorResponse(`Material not found with id of ${req.params.id}`, 404));
  }

  const { token } = req.query;
  
  if (!token) {
    return next(new ErrorResponse('Download token is required', 400));
  }
  
  // Find the delivery with the token
  const delivery = await Delivery.findOne({
    where: {
      materialId: material._id,
      token
    }
  });
  
  if (!delivery) {
    return next(new ErrorResponse('Invalid download token', 401));
  }
  
  // Check if token is expired
  if (new Date() > new Date(delivery.expiresAt)) {
    return next(new ErrorResponse('Download link has expired', 401));
  }
  
  try {
    // Increment download count
    material.downloads += 1;
    
    await material.save();
    
    // Update delivery status
    delivery.status = 'downloaded';
    await delivery.save();
    
    // If the file is stored locally
    if (material.filePath && fs.existsSync(material.filePath)) {
      const file = material.filePath;
      const fileName = path.basename(file);
      
      res.download(file, fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          return next(new ErrorResponse('Error downloading file', 500));
        }
      });
    } 
    // If the file is stored in Cloudinary
    else if (material.cloudinary && material.cloudinary.secure_url) {
      res.redirect(material.cloudinary.secure_url);
    } else {
      return next(new ErrorResponse('File not found', 404));
    }
  } catch (error) {
    return next(new ErrorResponse(`Error downloading material: ${error.message}`, 500));
  }
});

// @desc    Get all deliveries
// @route   GET /api/v1/deliveries
// @route   GET /api/v1/materials/:materialId/deliveries
// @access  Private/Admin

export const getDeliveries = asyncHandler(async (req, res, next) => {
  if (req.params.materialId) {
    const deliveries = await Delivery.findAll({
      where: { materialId: req.params.materialId },
      include: [
        {
          model: Material,
          attributes: ['id', 'title']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single delivery
// @route   GET /api/v1/deliveries/:id
// @access  Private
export const getDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findByPk(req.params.id, {
    include: [
      {
        model: Material,
        attributes: ['id', 'title', 'userId']
      }
    ]
  });

  if (!delivery) {
    return next(
      new ErrorResponse(`No delivery with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is delivery recipient, material owner or admin
  if (
    delivery.userId.toString() !== req.user.id &&
    delivery.Material.userId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this delivery`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: delivery
  });
});

// @desc    Add delivery
// @route   POST /api/v1/materials/:materialId/deliveries
// @access  Private
export const addDelivery = asyncHandler(async (req, res, next) => {
  req.body.materialId = req.params.materialId;
  req.body.userId = req.user.id;

  const material = await Material.findByPk(req.params.materialId);

  if (!material) {
    return next(
      new ErrorResponse(
        `No material with the id of ${req.params.materialId}`,
        404
      )
    );
  }

  // Make sure user is not the material owner
  if (material.userId.toString() === req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} cannot request delivery of their own material`,
        400
      )
    );
  }

  // Check if delivery already exists for this user and material
  const existingDelivery = await Delivery.findOne({
    where: {
      materialId: req.params.materialId,
      userId: req.user.id
    }
  });

  if (existingDelivery) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} has already requested delivery for this material`,
        400
      )
    );
  }

  const delivery = await Delivery.create(req.body);

  res.status(201).json({
    success: true,
    data: delivery
  });
});

// @desc    Update delivery
// @route   PUT /api/v1/deliveries/:id
// @access  Private
export const updateDelivery = asyncHandler(async (req, res, next) => {
  let delivery = await Delivery.findByPk(req.params.id, {
    include: [
      {
        model: Material,
        attributes: ['id', 'userId']
      }
    ]
  });

  if (!delivery) {
    return next(
      new ErrorResponse(`No delivery with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is delivery recipient, material owner or admin
  if (
    delivery.userId.toString() !== req.user.id &&
    delivery.Material.userId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this delivery`,
        401
      )
    );
  }

  // Only allow updating status and tracking info
  const { status, trackingNumber, trackingCompany } = req.body;
  
  delivery = await delivery.update({
    status,
    trackingNumber: trackingNumber || delivery.trackingNumber,
    trackingCompany: trackingCompany || delivery.trackingCompany
  });

  res.status(200).json({
    success: true,
    data: delivery
  });
});

// @desc    Delete delivery
// @route   DELETE /api/v1/deliveries/:id
// @access  Private
export const deleteDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findByPk(req.params.id, {
    include: [
      {
        model: Material,
        attributes: ['id', 'userId']
      }
    ]
  });

  if (!delivery) {
    return next(
      new ErrorResponse(`No delivery with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is delivery recipient, material owner or admin
  if (
    delivery.userId.toString() !== req.user.id &&
    delivery.Material.userId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this delivery`,
        401
      )
    );
  }

  await delivery.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

export default {
  deliverViaEmail,
  deliverViaWhatsApp,
  downloadMaterial,
  getDeliveries,
  getDelivery,
  addDelivery,
  updateDelivery,
  deleteDelivery
};
