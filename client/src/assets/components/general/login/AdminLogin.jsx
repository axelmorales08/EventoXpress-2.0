import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'
import { authService } from '../../../../services/authService'
import { getErrorMessage } from '../../../../services/api'
import { useAuth } from '../../../../context/useAuth'
import { HOME_BY_ROLE } from '../../../../context/authContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [preToken, setPreToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveSession } = useAuth()

  // Paso 1: usuario + clave. El back manda un código al mail del admin.
  async function handleFirstStepSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)
    try {
      const data = await authService.adminLogin(username.trim(), password)
      setPreToken(data.pre_token)
      setToken('')
      setStep(2)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo iniciar sesión'))
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: el código recibido por mail
  async function handleSecondStepSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)
    try {
      const data = await authService.adminVerify(preToken, token.trim())
      const user = saveSession(data)
      navigate(HOME_BY_ROLE[user.type_users_id] || '/')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'El token no es válido'))
    } finally {
      setLoading(false)
    }
  }

  if (step === 2) {
    return (
      <div className="organizer-login-page">
        <div className="organizer-login-card">
          <h2 className="organizer-login-title">Paso 2: ingrese token</h2>
          <p className="organizer-login-sub">Este es el ingreso la primera vez que inicie la cuenta.</p>

          <form className="organizer-login-form" onSubmit={handleSecondStepSubmit}>
            <label className="organizer-form-label">Token</label>
            <input
              className="organizer-form-input"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              placeholder="Ingrese su token"
              aria-label="Token"
            />

            {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}

            <div className="organizer-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  setStep(1)
                  setErrorMessage('')
                }}
              >
                Atras
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verificando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="organizer-login-page">
      <div className="organizer-login-card">
        <h2 className="organizer-login-title">Iniciar sesión</h2>
        <p className="organizer-login-sub">Ingresa con la clave y el nombre del user.</p>

        <form className="organizer-login-form" onSubmit={handleFirstStepSubmit}>
          <label className="organizer-form-label">Usuario</label>
          <input
            className="organizer-form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Usuario"
            aria-label="Usuario"
          />

          <label className="organizer-form-label">Clave</label>
          <input
            className="organizer-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Clave"
            aria-label="Clave"
          />

          {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}

          <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
