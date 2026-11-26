import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/index.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};

function serializeUser(user) {
  return { id: user._id, email: user.email, role: user.role };
}

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, tv: user.tokenVersion ?? 0 }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email }).select('+passwordHash');
  const validPassword = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !validPassword) throw new AppError('Invalid email or password.', 401);

  const token = issueToken(user);
  res.set('Cache-Control', 'no-store');
  res.cookie(env.COOKIE_NAME, token, cookieOptions);
  res.json({ success: true, data: { user: serializeUser(user), token } });
}

export async function logout(req, res) {
  await AdminUser.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
  res.set('Cache-Control', 'no-store');
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, data: { message: 'Logged out successfully.' } });
}

export function currentUser(req, res) {
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, data: { user: serializeUser(req.user) } });
}
