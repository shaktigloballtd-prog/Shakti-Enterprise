import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { Request } from 'express';
import { UserAccount, StaffRole } from '../app/models/shakti.models';

export interface ServerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: StaffRole;
  assignedModules: string[];
  passwordSalt: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isOtpVerified?: boolean;
  otpCode?: string;
  otpExpires?: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  verificationToken?: string;
  verificationTokenExpires?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  lastVerificationSentAt?: string;
  failedLoginAttempts: number;
  lockoutUntil?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface ServerSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export function generate6DigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getDefaultModulesForRole(role: StaffRole): string[] {
  switch (role) {
    case 'admin':
      return ['dashboard', 'storefront', 'products', 'orders', 'dropship', 'affiliate', 'erp', 'pos', 'free-tools', 'market', 'studio', 'calendar', 'agents', 'analytics', 'manager', 'security'];
    case 'inventory_manager':
      return ['products', 'orders', 'pos', 'market', 'analytics'];
    case 'accountant':
      return ['erp', 'orders', 'dropship', 'affiliate', 'free-tools', 'analytics'];
    case 'social_marketer':
      return ['studio', 'calendar', 'market', 'agents', 'analytics'];
    case 'dropship_coordinator':
      return ['dropship', 'orders', 'products', 'affiliate'];
    case 'store_manager':
      return ['orders', 'pos', 'products', 'dropship', 'analytics'];
    default:
      return ['products', 'orders'];
  }
}

export function hashPassword(password: string, salt: string): string {
  return pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const actualHash = hashPassword(password, salt);
    const actualBuf = Buffer.from(actualHash, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');
    if (actualBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(actualBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function sanitizeUser(u: ServerUser): UserAccount {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    assignedModules: u.assignedModules || getDefaultModulesForRole(u.role),
    isEmailVerified: u.isEmailVerified,
    isOtpVerified: u.isOtpVerified,
    testOtpCode: u.otpCode,
    status: u.status || 'ACTIVE',
    createdAt: u.createdAt,
    lastLogin: u.lastLogin,
    failedLoginAttempts: u.failedLoginAttempts,
    lockoutUntil: u.lockoutUntil,
    verificationToken: u.verificationToken,
    verificationTokenExpires: u.verificationTokenExpires,
  };
}

export function createInitialAdminUser(): ServerUser {
  const salt = randomBytes(16).toString('hex');
  // Default master credential for primary owner Kamal Das
  const hash = hashPassword('Saarthi@2026', salt);
  return {
    id: 'user-admin-1',
    email: 'kamaldas743273@gmail.com',
    name: 'Kamal Das',
    phone: '+91 98301 23456',
    role: 'admin',
    assignedModules: getDefaultModulesForRole('admin'),
    passwordSalt: salt,
    passwordHash: hash,
    isEmailVerified: true,
    isOtpVerified: true,
    status: 'ACTIVE',
    failedLoginAttempts: 0,
    createdAt: '2026-10-20T08:00:00.000Z',
    lastLogin: '2026-10-25T10:00:00.000Z',
  };
}

export function getSessionUser(
  req: Request,
  users: ServerUser[],
  sessions: ServerSession[],
): ServerUser | null {
  const authHeader = req.headers.authorization;
  const token =
    (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null) ||
    (req.headers['x-session-token'] as string) ||
    (req.query['token'] as string);

  if (!token) return null;
  const session = sessions.find((s) => s.token === token);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    // Session expired
    return null;
  }

  const user = users.find((u) => u.id === session.userId);
  return user || null;
}
