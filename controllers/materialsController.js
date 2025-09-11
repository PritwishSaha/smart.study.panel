import Material from '../models/Material.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import path from 'path';

// @desc    Get all materials
// @route   GET /api/v1/materials
// @access  Public
export const getMaterials = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single material
// @route   GET /api/v1/materials/:id
// @access  Public
export const getMaterial = asyncHandler(async (req, res, next) => {
  const material = await Material.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['id', 'name']
      }
    ]
  });

  if (!material) {
    return next(
      new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: material
  });
});

// @desc    Create new material
// @route   POST /api/v1/materials
// @access  Private
export const createMaterial = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;

  const material = await Material.create(req.body);

  res.status(201).json({
    success: true,
    data: material
  });
});

// @desc    Update material
// @route   PUT /api/v1/materials/:id
// @access  Private
export const updateMaterial = asyncHandler(async (req, res, next) => {
  let material = await Material.findByPk(req.params.id);

  if (!material) {
    return next(
      new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is material owner or admin
  if (material.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this material`,
        401
      )
    );
  }

  material = await material.update(req.body);

  res.status(200).json({
    success: true,
    data: material
  });
});

// @desc    Delete material
// @route   DELETE /api/v1/materials/:id
// @access  Private
export const deleteMaterial = asyncHandler(async (req, res, next) => {
  const material = await Material.findByPk(req.params.id);

  if (!material) {
    return next(
      new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is material owner or admin
  if (material.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this material`,
        401
      )
    );
  }

  await material.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload material file
// @route   PUT /api/v1/materials/:id/file
// @access  Private
export const materialFileUpload = asyncHandler(async (req, res, next) => {
  const material = await Material.findByPk(req.params.id);

  if (!material) {
    return next(
      new ErrorResponse(`Material not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is material owner or admin
  if (material.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this material`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Check file type
  if (!file.mimetype.startsWith('application')) {
    return next(new ErrorResponse(`Please upload a valid file`, 400));
  }

  // Check file size
  const maxSize = process.env.MAX_FILE_UPLOAD || 10000000; // 10MB default
  if (file.size > maxSize) {
    return next(
      new ErrorResponse(
        `Please upload a file less than ${maxSize / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `material_${material.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await material.update({
      fileUrl: `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
      fileType: path.parse(file.name).ext.substring(1)
    });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
