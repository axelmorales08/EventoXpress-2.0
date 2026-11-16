import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { authService } from '../services/authService'
import { TOKEN_KEY, USER_KEY } from '../services/api'

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(readStoredUser)

  // Guarda la sesión que devuelve el back ({ token, user } o { token, admin })
  const saveSession = useCallback((data) => {
    const sessionUser = data.user || data.admin
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser))
    setToken(data.token)
    setUser(sessionUser)
    return sessionUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  // Al abrir la página se verifica que el token guardado siga siendo válido
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    authService.verify().catch(() => logout())
  }, [logout])

  // El interceptor de axios avisa cuando el back rechaza el token
  useEffect(() => {
    window.addEventListener('eventoxpress-logout', logout)
    return () => window.removeEventListener('eventoxpress-logout', logout)
  }, [logout])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    role: user?.type_users_id ?? null,
    saveSession,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
