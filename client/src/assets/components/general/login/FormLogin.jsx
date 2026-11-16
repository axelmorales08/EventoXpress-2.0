import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PreLogin.css'
import { authService } from '../../../../services/authService'
import { getErrorMessage } from '../../../../services/api'
import { useAuth } from '../../../../context/useAuth'
import { HOME_BY_ROLE } from '../../../../context/authContext'

export default function FormLogin() {
  const navigate = useNavigate()
  const [loginMethod, setLoginMethod] = useState('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveSession } = useAuth()

  const isEmailLogin = loginMethod === 'email'
  const identifierValue = isEmailLogin ? email : phone

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const credentials = isEmailLogin
        ? { email: email.trim(), password }
        : { phone: phone.trim(), password }

      const data = await authService.login(credentials)
      const user = saveSession(data)
      navigate(HOME_BY_ROLE[user.type_users_id] || '/')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo iniciar sesión'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prelogin-wrap">
      <div className="prelogin-card">
        <h2 className="prelogin-title">Iniciar sesión</h2>
        <p className="prelogin-sub">Ingresa a tu cuenta de eventoXpress y disfruta de tus eventos favoritos.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-label">{isEmailLogin ? 'Correo electrónico' : 'Teléfono'}</label>
          <input
            className="form-input"
            type={isEmailLogin ? 'email' : 'tel'}
            value={identifierValue}
            onChange={(e) => (isEmailLogin ? setEmail(e.target.value) : setPhone(e.target.value))}
            required
            placeholder={isEmailLogin ? 'tu@correo.com' : 'Tu teléfono'}
            aria-label={isEmailLogin ? 'Correo electrónico' : 'Teléfono'}
          />

          <label className="form-label">Contraseña</label>

          <input
            className="form-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
            aria-label="Contraseña"
          />

          <p
            className="form-small"
            onClick={() => {
              setLoginMethod(isEmailLogin ? 'phone' : 'email')
              setErrorMessage('')
            }}
            style={{ cursor: 'pointer' }}
          >
            {isEmailLogin ? '¿querés iniciar sesión con teléfono?' : '¿querés iniciar sesión con correo?'}
          </p>

          <p className="form-link" onClick={() => navigate('/login/client/recover')}>
            ¿olvidaste tu contraseña?
          </p>

          {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <p className="form-small">¿no tenés cuenta? <span className="form-link" onClick={() => navigate('/register')}>Registrate</span></p>

          <p className="form-small"> <span className="form-link" onClick={() => navigate('/login/organizer')}>Soy organizador</span></p>

          <div style={{ marginTop: 12 }}>
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/login')}>Atras</button>
          </div>
        </form>
      </div>
    </div>
  )
}

