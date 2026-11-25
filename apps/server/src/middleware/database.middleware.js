import { getDatabaseStatus } from '../config/database.js';
import { AppError } from '../utils/app-error.js';

export function requireDatabase(req, res, next) {
  if (!getDatabaseStatus().connected) {
    return next(new AppError('Database service is temporarily unavailable.', 503));
  }
  return next();
}
