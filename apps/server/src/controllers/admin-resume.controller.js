import path from 'node:path';
import { open, unlink } from 'node:fs/promises';
import { env } from '../config/env.js';
import { resumeUploadsDirectory } from '../config/uploads.js';
import { PortfolioContent } from '../models/index.js';
import { AppError } from '../utils/app-error.js';
import { importResumeFile } from '../services/resume-importer.js';

async function isPdfFile(filePath) {
  const handle = await open(filePath, 'r');
  try {
    const header = Buffer.alloc(5);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    return bytesRead === 5 && header.toString('ascii') === '%PDF-';
  } finally {
    await handle.close();
  }
}

function publicResumeUrl(req, filename) {
  const baseUrl = (env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
  return new URL(`/uploads/resumes/${encodeURIComponent(filename)}`, `${baseUrl}/`).toString();
}

function localResumePath(resumeUrl) {
  if (!resumeUrl) return null;

  try {
    const pathname = new URL(resumeUrl).pathname;
    if (!pathname.startsWith('/uploads/resumes/')) return null;
    const filename = path.basename(pathname);
    const candidate = path.resolve(resumeUploadsDirectory, filename);
    return candidate.startsWith(`${path.resolve(resumeUploadsDirectory)}${path.sep}`) ? candidate : null;
  } catch {
    return null;
  }
}

export async function uploadResumeFile(req, res) {
  if (!req.file) {
    throw new AppError('Please choose a PDF resume file to upload.', 400);
  }

  let validPdf = false;
  try {
    validPdf = await isPdfFile(req.file.path);
  } catch {
    validPdf = false;
  }

  if (!validPdf) {
    await unlink(req.file.path).catch(() => {});
    throw new AppError('The selected file is not a valid PDF.', 400);
  }

  const previousContent = await PortfolioContent.findOne({ key: 'main' }).lean();
  const resumeUrl = publicResumeUrl(req, req.file.filename);

  try {
    const { content, imported } = await importResumeFile(req.file.path, resumeUrl);

    const previousFile = localResumePath(previousContent?.resumeUrl);
    if (previousFile && previousFile !== req.file.path) {
      await unlink(previousFile).catch(() => {});
    }

    return res.json({ success: true, data: content, imported });
  } catch (error) {
    await unlink(req.file.path).catch(() => {});
    throw error;
  }
}
