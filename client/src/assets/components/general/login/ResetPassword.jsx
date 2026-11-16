import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './OrganizerLogin.css'
import { authService } from '../../../../services/authService'
import { getErrorMessage } from '../../../../services/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  // El link que llega por mail es /reset-password?token=...
  const [searchParams] = useSearchParams()
  const resetToken = searchParams.get('token')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage('')

    if (!resetToken) {
      setErrorMessage('El link no es válido. Pedí uno nuevo desde "¿olvidaste tu contraseña?".')
      return
    }

    if (newPassword.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    setErrorMessage('')
    setLoading(true)
    try {
      const data = await authService.resetPassword(resetToken, newPassword)
      setSuccessMessage(`${data.message}. Ya podés iniciar sesión.`)
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo cambiar la contraseña'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="organizer-login-page">
      <div className="organizer-login-card">
        <h2 className="organizer-login-title">Recuperar contraseña</h2>
        <p className="organizer-login-sub">
          Escribí la nueva contraseña y repitela para confirmarla.
        </p>

        <form className="organizer-login-form" onSubmit={handleSubmit}>
          <label className="organizer-form-label">Nueva contraseña</label>
          <input
            className="organizer-form-input"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            placeholder="Nueva contraseña"
            aria-label="Nueva contraseña"
          />

          <label className="organizer-form-label">Repita la contraseña</label>
          <input
            className="organizer-form-input"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            placeholder="Repita la contraseña"
            aria-label="Repita la contraseña"
          />

          <p className="organizer-form-note">
            Para mayor seguridad, tu contraseña debe incluir un mínimo de 8 caracteres,
            combinando letras mayúsculas y minúsculas, al menos un número y un carácter
            especial o símbolo.
          </p>

          {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
          {successMessage && <p className="organizer-form-note">{successMessage}</p>}

          <div className="organizer-actions">
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/login/client')}>
              Iniciar sesión
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
