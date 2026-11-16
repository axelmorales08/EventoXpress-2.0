import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'
import { authService } from '../../../../services/authService'
import { getErrorMessage } from '../../../../services/api'

export default function RecoverOrganizerCode() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Pide un código nuevo y lleva al paso de ingresar el código
  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)
    try {
      await authService.organizerRequestCode(email.trim())
      navigate('/login/organizer', { state: { email: email.trim(), step: 'code' } })
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo enviar el código'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="organizer-login-page">
      <div className="organizer-login-card">
        <h2 className="organizer-login-title">Recuperar código</h2>
        <p className="organizer-login-sub">Ingresá correo de confirmación</p>

        <form className="organizer-login-form" onSubmit={handleSubmit}>
          <label className="organizer-form-label">Correo electrónico</label>
          <input
            className="organizer-form-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errorMessage) setErrorMessage('')
            }}
            required
            placeholder="tu@correo.com"
            aria-label="Correo electrónico"
          />

          {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}

          <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }} disabled={loading}>
            {loading ? 'Enviando...' : 'Iniciar sesión'}
          </button>

          <p className="organizer-form-small">
            ¿No tenés cuenta? Solicita ser usuario organizador para obtener los beneficios de funciones.
          </p>

          <p className="organizer-form-small" style={{ marginTop: 8 }}>
            <span className="organizer-form-link" onClick={() => navigate('/login/client')}>Quiero iniciar como cliente</span>
          </p>
        </form>
      </div>
    </div>
  )
}
