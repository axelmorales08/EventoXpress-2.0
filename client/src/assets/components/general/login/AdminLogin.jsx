import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')

  function handleFirstStepSubmit(e) {
    e.preventDefault()
    console.log('admin login step 1', { username, password })
    setStep(2)
  }

  function handleSecondStepSubmit(e) {
    e.preventDefault()
    console.log('admin login step 2', { token })
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

            <div className="organizer-actions">
              <button type="button" className="btn btn-cancel" onClick={() => setStep(1)}>
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

          <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}>
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
