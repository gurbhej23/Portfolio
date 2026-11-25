import crypto from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { resumeUploadsDirectory } from '../config/uploads.js';
import { AppError } from '../utils/app-error.js';

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, resumeUploadsDirectory),
  filename: (_req, _file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}.pdf`),
});

function fileFilter(_req, file, callback) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  if (extension !== '.pdf' || file.mimetype !== 'application/pdf') {
    return callback(new AppError('Only PDF resume files are allowed.', 400));
  }
  return callback(null, true);
}

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { files: 1, fileSize: 5 * 1024 * 1024 },
});
