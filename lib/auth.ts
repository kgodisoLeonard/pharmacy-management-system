import type { User, UserRole, Session } from './types'
import { users, addAuditLog } from './db'

// Session storage (in production, use secure cookies or JWT)
let currentSession: Session | null = null

// Role-based permissions
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    'dashboard',
    'admin',
    'patients',
    'prescriptions',
    'dispensing',
    'inventory',
    'cupboard',
    'audit',
    'reports',
    'settings',
  ],
  doctor: [
    'dashboard',
    'patients',
    'prescriptions',
    'settings',
  ],
  pharmacist: [
    'dashboard',
    'patients',
    'prescriptions',
    'dispensing',
    'inventory',
    'cupboard',
    'audit',
    'settings',
  ],
  assistant: [
    'dashboard',
    'patients',
    'prescriptions',
    'dispensing',
    'inventory',
    'settings',
  ],
  stock_taker: [
    'dashboard',
    'inventory',
    'audit',
    'settings',
  ],
}

// Role display names
export const roleDisplayNames: Record<UserRole, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  pharmacist: 'Pharmacist',
  assistant: 'Pharmacy Assistant',
  stock_taker: 'Stock Taker',
}

export function login(username: string, password: string): { success: boolean; user?: Omit<User, 'password'>; error?: string } {
  const user = users.find(u => u.username === username && u.password === password)
  
  if (!user) {
    return { success: false, error: 'Invalid username or password' }
  }
  
  if (!user.isActive) {
    return { success: false, error: 'Account is deactivated. Contact administrator.' }
  }
  
  // Update last login
  user.lastLogin = new Date()
  
  // Create session
  const { password: _, ...userWithoutPassword } = user
  currentSession = {
    userId: user.id,
    user: userWithoutPassword,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
  }
  
  // Log the login
  addAuditLog(user.id, 'LOGIN', 'user', user.id, `User ${user.username} logged in`)
  
  return { success: true, user: userWithoutPassword }
}

export function logout(): void {
  if (currentSession) {
    addAuditLog(currentSession.userId, 'LOGOUT', 'user', currentSession.userId, `User logged out`)
  }
  currentSession = null
}

export function getSession(): Session | null {
  if (!currentSession) return null
  
  // Check if session expired
  if (new Date() > currentSession.expiresAt) {
    currentSession = null
    return null
  }
  
  return currentSession
}

export function setSession(session: Session | null): void {
  currentSession = session
}

export function hasPermission(permission: string): boolean {
  const session = getSession()
  if (!session) return false
  
  const permissions = rolePermissions[session.user.role]
  return permissions.includes(permission)
}

export function canAccessPage(page: string): boolean {
  return hasPermission(page)
}

// Face ID simulation - randomly succeeds or fails
export function simulateFaceId(): { success: boolean; reason?: string } {
  const random = Math.random()
  
  if (random < 0.7) {
    return { success: true }
  } else if (random < 0.85) {
    return { success: false, reason: 'Face not recognized. Please try again or use password.' }
  } else {
    return { success: false, reason: 'Camera unavailable. Please use password.' }
  }
}

// Cupboard access authentication
export function authenticateCupboardAccess(
  userId: string,
  method: 'face_id' | 'password',
  password?: string
): { success: boolean; error?: string } {
  const user = users.find(u => u.id === userId)
  
  if (!user) {
    return { success: false, error: 'User not found' }
  }
  
  // Check if user has cupboard access permission
  if (!hasPermission('cupboard')) {
    addAuditLog(userId, 'CUPBOARD_ACCESS_DENIED', 'cupboard', '', 'User does not have cupboard access permission')
    return { success: false, error: 'You do not have permission to access the medication cupboard.' }
  }
  
  if (method === 'face_id') {
    const faceIdResult = simulateFaceId()
    if (!faceIdResult.success) {
      return { success: false, error: faceIdResult.reason }
    }
  } else if (method === 'password') {
    if (password !== user.password) {
      addAuditLog(userId, 'CUPBOARD_ACCESS_FAILED', 'cupboard', '', 'Invalid password attempt')
      return { success: false, error: 'Invalid password' }
    }
  }
  
  addAuditLog(userId, 'CUPBOARD_ACCESS_GRANTED', 'cupboard', '', `Access granted via ${method}`)
  return { success: true }
}
