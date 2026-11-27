import crypto from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { projectImagesDirectory, profilePhotosDirectory } from '../config/uploads.js';
import { AppError } from '../utils/app-error.js';

const extensionByMimeType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

function createStorage(directory) {
  return multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, directory),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${extensionByMimeType[file.mimetype] || '.img'}`),
  });
}

function imageFilter(_req, file, callback) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const validExtension = ['.jpg', '.jpeg', '.png', '.webp'].includes(extension);
  const validMimeType = Object.hasOwn(extensionByMimeType, file.mimetype);

  if (!validExtension || !validMimeType) {
    return callback(new AppError('Only JPG, PNG, and WebP images are allowed.', 400));
  }
  return callback(null, true);
}

function createImageUpload(directory, maxFiles = 1) {
  return multer({
    storage: createStorage(directory),
    fileFilter: imageFilter,
    limits: { files: maxFiles, fileSize: 5 * 1024 * 1024 },
  });
}

export const projectImageUpload = createImageUpload(projectImagesDirectory, 10);
export const profilePhotoUpload = createImageUpload(profilePhotosDirectory);
