'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, Session } from './types'
import { login as authLogin, logout as authLogout, getSession, setSession, roleDisplayNames, rolePermissions } from './auth'

interface AuthContextType {
  user: Omit<User, 'password'> | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasPermission: (permission: string) => boolean
  roleDisplayName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_KEY = 'pharmacy_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY)
    if (savedSession) {
      try {
        const session: Session = JSON.parse(savedSession)
        // Check if session is still valid
        if (new Date(session.expiresAt) > new Date()) {
          setUser(session.user)
          setSession(session)
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const result = authLogin(username, password)
    
    if (result.success && result.user) {
      setUser(result.user)
      // Save session to localStorage
      const session = getSession()
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      }
      return { success: true }
    }
    
    return { success: false, error: result.error }
  }

  const logout = () => {
    authLogout()
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    const permissions = rolePermissions[user.role]
    if (!permissions) return false
    return permissions.includes(permission)
  }

  const roleDisplayName = user ? roleDisplayNames[user.role] : ''

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout, 
        hasPermission,
        roleDisplayName
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
