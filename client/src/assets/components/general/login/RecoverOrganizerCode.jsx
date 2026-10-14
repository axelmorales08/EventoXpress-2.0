import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'

export default function RecoverOrganizerCode() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    console.log('recover organizer code', { email })
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
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@correo.com"
            aria-label="Correo electrónico"
          />

          <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}>
            Iniciar sesión
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
