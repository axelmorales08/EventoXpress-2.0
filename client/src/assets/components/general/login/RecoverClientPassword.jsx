import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'
import { authService } from '../../../../services/authService'
import { getErrorMessage } from '../../../../services/api'

export default function RecoverClientPassword() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const isEmailMethod = method === 'email'
  const currentValue = isEmailMethod ? email : phone

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)
    try {
      const data = await authService.recoverPassword(
        isEmailMethod ? { email: email.trim() } : { phone: phone.trim() }
      )
      setSuccessMessage(data.message)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo enviar la recuperación'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="organizer-login-page">
      <div className="organizer-login-card">
        <h2 className="organizer-login-title">Recuperar contraseña</h2>
        <p className="organizer-login-sub">
          Escribí la dirección de correo electrónico que usaste para registrarte. Te enviaremos un correo con tu nueva contraseña.
        </p>

        <form className="organizer-login-form" onSubmit={handleSubmit}>
          <label className="organizer-form-label">
            {isEmailMethod ? 'Correo electrónico' : 'Teléfono'}
          </label>
          <input
            className="organizer-form-input"
            type={isEmailMethod ? 'email' : 'tel'}
            value={currentValue}
            onChange={(e) => {
              if (isEmailMethod) setEmail(e.target.value)
              else setPhone(e.target.value)
            }}
            required
            placeholder={isEmailMethod ? 'tu@correo.com' : 'Tu teléfono'}
            aria-label={isEmailMethod ? 'Correo electrónico' : 'Teléfono'}
          />

          <button
            type="button"
            className="organizer-form-link-button"
            onClick={() => {
              setMethod(isEmailMethod ? 'phone' : 'email')
              setErrorMessage('')
              setSuccessMessage('')
            }}
          >
            {isEmailMethod ? 'Recuperar contraseña con teléfono' : 'Recuperar contraseña con correo'}
          </button>

          {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
          {successMessage && <p className="organizer-form-note">{successMessage}</p>}

          <div className="organizer-actions">
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/login/client')}>
              Atras
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : isEmailMethod ? 'Enviar email' : 'Enviar un SMS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
