'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '@/types/auth'
import { account } from '@/lib/appwrite'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionUser = await account.get()
        const normalizedUser: User = {
          id: sessionUser.$id,
          email: sessionUser.email,
          name: sessionUser.name || sessionUser.email,
          role: 'admin'
        }
        setUser(normalizedUser)
      } catch (_) {
        setUser(null)
      } finally {
    setLoading(false)
      }
    }

    initSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password)
      const sessionUser = await account.get()
      const normalizedUser: User = {
        id: sessionUser.$id,
        email: sessionUser.email,
        name: sessionUser.name || sessionUser.email,
        role: 'admin'
      }
      setUser(normalizedUser)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    try {
      account.deleteSession('current')
    } catch (_) {
      // ignore
    } finally {
    setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
