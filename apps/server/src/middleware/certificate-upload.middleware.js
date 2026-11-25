import crypto from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { certificationAttachmentsDirectory } from '../config/uploads.js';
import { AppError } from '../utils/app-error.js';

const extensionByMimeType = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, certificationAttachmentsDirectory),
  filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${extensionByMimeType[file.mimetype] || '.attachment'}`),
});

function fileFilter(_req, file, callback) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  if (!allowedExtensions.includes(extension) || !Object.hasOwn(extensionByMimeType, file.mimetype)) {
    return callback(new AppError('Only PDF, JPG, PNG, and WebP certificate files are allowed.', 400));
  }
  return callback(null, true);
}

export const certificateUpload = multer({
  storage,
  fileFilter,
  limits: { files: 1, fileSize: 5 * 1024 * 1024 },
});
