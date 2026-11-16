import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../../context/useAuth'

// Si no hay sesión manda al login; si el rol no tiene permiso manda al inicio
export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />

  return children
}
