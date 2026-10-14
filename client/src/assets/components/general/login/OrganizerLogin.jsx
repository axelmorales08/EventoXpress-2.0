import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'

export default function OrganizerLogin() {
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    console.log('organizer login', { codigo, password })
  }

  return (
    <div className="organizer-login-page">
      <div className="organizer-login-card">
        <h2 className="organizer-login-title">Iniciar sesión como organizador</h2>
        <p className="organizer-login-sub">Ingresa a tu cuenta de EventoXpress y disfruta de tus eventos favoritos.</p>

        <form className="organizer-login-form" onSubmit={handleSubmit}>
          <label className="organizer-form-label">Escribe el código de iniciar sesión del e-mail oficial</label>
          <input
            className="organizer-form-input"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            placeholder="123-456"
            aria-label="Código de iniciar sesión del e-mail oficial"
          />

          <label className="organizer-form-label">Contraseña</label>
          <input
            className="organizer-form-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"
            aria-label="Contraseña"
          />

          <p className="organizer-form-link" onClick={() => navigate('/login/organizer/recover')}>
            Recuperar código / reestablecer código
          </p>

          <p className="organizer-form-small">Solicitud Gmail</p>

          <p className="organizer-form-small" style={{ marginTop: 8 }}>
            <span className="organizer-form-link" onClick={() => navigate('/login/client')}>Quiero iniciar como cliente</span>
          </p>

          <div className="organizer-actions">
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/login')}>
              Atras
            </button>
            <button type="submit" className="btn btn-primary">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
