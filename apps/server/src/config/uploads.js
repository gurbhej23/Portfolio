import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(configDirectory, '..', '..');

export const uploadsDirectory = path.join(serverRoot, 'uploads');
export const resumeUploadsDirectory = path.join(uploadsDirectory, 'resumes');
export const projectImagesDirectory = path.join(uploadsDirectory, 'projects');
export const profilePhotosDirectory = path.join(uploadsDirectory, 'profile');
export const certificationAttachmentsDirectory = path.join(uploadsDirectory, 'certifications');

fs.mkdirSync(resumeUploadsDirectory, { recursive: true });
fs.mkdirSync(projectImagesDirectory, { recursive: true });
fs.mkdirSync(profilePhotosDirectory, { recursive: true });
fs.mkdirSync(certificationAttachmentsDirectory, { recursive: true });
