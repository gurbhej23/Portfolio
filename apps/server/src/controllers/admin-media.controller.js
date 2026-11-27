import path from 'node:path';
import { open, unlink } from 'node:fs/promises';
import { env } from '../config/env.js';
import { certificationAttachmentsDirectory, projectImagesDirectory, profilePhotosDirectory } from '../config/uploads.js';
import { Certification, PortfolioContent, Project } from '../models/index.js';
import { AppError } from '../utils/app-error.js';

async function hasValidImageSignature(filePath, mimeType) {
  const handle = await open(filePath, 'r');
  try {
    const header = Buffer.alloc(12);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    if (bytesRead < 8) return false;

    if (mimeType === 'image/jpeg') return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    if (mimeType === 'image/png') return header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (mimeType === 'image/webp') return header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP';
    return false;
  } finally {
    await handle.close();
  }
}

async function hasValidPdfSignature(filePath) {
  const handle = await open(filePath, 'r');
  try {
    const header = Buffer.alloc(5);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    return bytesRead === 5 && header.toString('ascii') === '%PDF-';
  } finally {
    await handle.close();
  }
}

function publicMediaUrl(req, directoryName, filename) {
  const requestBaseUrl = `${req.protocol}://${req.get('host')}`.replace(/\/+$/, '');
  const configuredBaseUrl = (env.PUBLIC_API_URL || '').replace(/\/api\/?$/i, '').replace(/\/+$/, '');
  const configuredUrlIsLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/i.test(configuredBaseUrl);
  const baseUrl = configuredBaseUrl && !(env.NODE_ENV === 'production' && configuredUrlIsLocal)
    ? configuredBaseUrl
    : requestBaseUrl;
  return new URL(`/uploads/${directoryName}/${encodeURIComponent(filename)}`, `${baseUrl}/`).toString();
}

function localMediaPath(mediaUrl, directoryName, directory) {
  if (!mediaUrl) return null;

  try {
    const pathname = new URL(mediaUrl).pathname;
    const prefix = `/uploads/${directoryName}/`;
    if (!pathname.startsWith(prefix)) return null;
    const filename = path.basename(pathname);
    const candidate = path.resolve(directory, filename);
    return candidate.startsWith(`${path.resolve(directory)}${path.sep}`) ? candidate : null;
  } catch {
    return null;
  }
}

async function validateUploadedImage(file) {
  let valid = false;
  try {
    valid = await hasValidImageSignature(file.path, file.mimetype);
  } catch {
    valid = false;
  }

  if (!valid) {
    await unlink(file.path).catch(() => {});
    throw new AppError('The selected file is not a valid supported image.', 400);
  }
}

async function validateCertificateAttachment(file) {
  let valid = false;
  try {
    valid = file.mimetype === 'application/pdf'
      ? await hasValidPdfSignature(file.path)
      : await hasValidImageSignature(file.path, file.mimetype);
  } catch {
    valid = false;
  }

  if (!valid) {
    await unlink(file.path).catch(() => {});
    throw new AppError('The selected certificate is not a valid supported file.', 400);
  }
}

export async function uploadProjectImage(req, res) {
  if (!req.file) throw new AppError('Please choose a project image to upload.', 400);
  await validateUploadedImage(req.file);

  const project = await Project.findById(req.params.id).lean();
  if (!project) {
    await unlink(req.file.path).catch(() => {});
    throw new AppError('Project not found.', 404);
  }

  const imageUrl = publicMediaUrl(req, 'projects', req.file.filename);
  try {
    const existingImages = Array.isArray(project.images) ? project.images : [];
    const images = [...new Set([
      ...existingImages,
      project.imageUrl,
      imageUrl,
    ].filter(Boolean))];
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { imageUrl, thumbnail: imageUrl, images } },
      { new: true, runValidators: true },
    ).lean();
    const previousFile = localMediaPath(project.imageUrl, 'projects', projectImagesDirectory);
    if (previousFile && previousFile !== req.file.path && !images.includes(project.imageUrl)) {
      await unlink(previousFile).catch(() => {});
    }
    return res.json({ success: true, data: updatedProject });
  } catch (error) {
    await unlink(req.file.path).catch(() => {});
    throw error;
  }
}

export async function uploadProjectImages(req, res) {
  const files = req.files || [];
  if (!files.length) throw new AppError('Please choose at least one project image to upload.', 400);

  const project = await Project.findById(req.params.id).lean();
  if (!project) {
    await Promise.all(files.map((file) => unlink(file.path).catch(() => {})));
    throw new AppError('Project not found.', 404);
  }

  try {
    for (const file of files) await validateUploadedImage(file);

    const imageUrls = files.map((file) => publicMediaUrl(req, 'projects', file.filename));
    const existingImages = Array.isArray(project.images) ? project.images : [];
    const images = [...new Set([
      ...existingImages,
      project.imageUrl,
      project.thumbnail,
      ...imageUrls,
    ].filter(Boolean))];
    const thumbnail = project.thumbnail || project.imageUrl || imageUrls[0];
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { imageUrl: project.imageUrl || thumbnail, thumbnail, images } },
      { new: true, runValidators: true },
    ).lean();

    return res.json({ success: true, data: updatedProject });
  } catch (error) {
    await Promise.all(files.map((file) => unlink(file.path).catch(() => {})));
    throw error;
  }
}

export async function uploadProfilePhoto(req, res) {
  if (!req.file) throw new AppError('Please choose a profile photo to upload.', 400);
  await validateUploadedImage(req.file);

  const previousContent = await PortfolioContent.findOne({ key: 'main' }).lean();
  const profilePhotoUrl = publicMediaUrl(req, 'profile', req.file.filename);
  try {
    const content = await PortfolioContent.findOneAndUpdate(
      { key: 'main' },
      { $set: { profilePhotoUrl }, $setOnInsert: { key: 'main' } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean();
    const previousFile = localMediaPath(previousContent?.profilePhotoUrl, 'profile', profilePhotosDirectory);
    if (previousFile && previousFile !== req.file.path) await unlink(previousFile).catch(() => {});
    return res.json({ success: true, data: content });
  } catch (error) {
    await unlink(req.file.path).catch(() => {});
    throw error;
  }
}

export async function uploadCertificationAttachment(req, res) {
  if (!req.file) throw new AppError('Please choose a certificate file to upload.', 400);
  await validateCertificateAttachment(req.file);

  const certification = await Certification.findById(req.params.id).lean();
  if (!certification) {
    await unlink(req.file.path).catch(() => {});
    throw new AppError('Certification not found.', 404);
  }

  const credentialUrl = publicMediaUrl(req, 'certifications', req.file.filename);
  try {
    const updatedCertification = await Certification.findByIdAndUpdate(
      req.params.id,
      { $set: { credentialUrl } },
      { new: true, runValidators: true },
    ).lean();
    const previousFile = localMediaPath(certification.credentialUrl, 'certifications', certificationAttachmentsDirectory);
    if (previousFile && previousFile !== req.file.path) await unlink(previousFile).catch(() => {});
    return res.json({ success: true, data: updatedCertification });
  } catch (error) {
    await unlink(req.file.path).catch(() => {});
    throw error;
  }
}
