import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/index.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

function getToken(req) {
  const cookieToken = req.cookies?.[env.COOKIE_NAME];
  if (cookieToken) return cookieToken;

  const authorization = req.get('authorization');
  if (authorization?.startsWith('Bearer ')) return authorization.slice(7);

  return null;
}

export async function authenticate(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) throw new AppError('Authentication required.', 401);

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await AdminUser.findById(payload.sub).select('_id email role tokenVersion');
    if (!user || typeof payload.tv !== 'number' || payload.tv !== (user.tokenVersion ?? 0)) throw new AppError('Authentication required.', 401);

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Authentication required.', 401));
    }
    return next(error);
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    return next();
  };
}
