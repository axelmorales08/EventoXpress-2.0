import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'

export default function OrganizerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email')
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleEmailSubmit = (event) => {
    event.preventDefault()

    const allowedOrganizerEmails = ['organizador@eventoxpress.com', 'admin@eventoxpress.com']

    if (!allowedOrganizerEmails.includes(email.trim().toLowerCase())) {
      setErrorMessage('El mail ingresado no es parte de organizadores.')
      return
    }

    setErrorMessage('')
    setStep('code')
  }

  const handleCodeSubmit = (event) => {
    event.preventDefault()
  }

  const handleResendCode = () => {
    console.log('Reenviar código para:', email)
  }

  return (
    <div className="organizer-login-page">
      <div className="organizer-login-card">
        <h2 className="organizer-login-title">
          {step === 'email' ? 'Verificar correo' : 'Ingrese el código'}
        </h2>

        <p className="organizer-login-sub">
          {step === 'email'
            ? 'Ingresar correo de tu cuenta de Organizador'
            : 'Te enviamos un código de 6 dígitos a tu correo.'}
        </p>

        <form
          className="organizer-login-form"
          onSubmit={step === 'email' ? handleEmailSubmit : handleCodeSubmit}
        >
          {step === 'email' ? (
            <>
              <label className="organizer-form-label">Correo electrónico</label>
              <input
                className="organizer-form-input"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                required
                placeholder="correo@ejemplo.com"
                aria-label="Correo electrónico"
              />

           {errorMessage && <p className="organizer-form-error">{errorMessage}</p>} 
            </>
          ) : (
            <>
              <label className="organizer-form-label">Código de 6 dígitos</label>
              <input
                className="organizer-form-input"
                type="text"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                }
                required
                maxLength={6}
                placeholder="XXX-XXX"
                aria-label="Código de verificación de 6 dígitos"
              />
            </>
          )}

          {step === 'email' ? (
            <button
              type="button"
              className="organizer-form-link-button"
              onClick={() => navigate('/login/client')}
            >
              Iniciar como cliente
            </button>
          ) : (
            <button
              type="button"
              className="organizer-form-link-button"
              onClick={handleResendCode}
            >
              Reenviar código
            </button>
          )}

          <div className="organizer-actions">
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/login')}>
              Atras
            </button>
            <button type="submit" className="btn btn-primary">
              {step === 'email' ? 'Confirmar' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
