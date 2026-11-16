import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './OrganizerLogin.css'
import { authService } from '../../../../services/authService'
import { getErrorMessage } from '../../../../services/api'
import { useAuth } from '../../../../context/useAuth'
import { HOME_BY_ROLE } from '../../../../context/authContext'

export default function OrganizerLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  // Si viene desde "Recuperar código" ya trae el mail y arranca en el paso del código
  const [email, setEmail] = useState(location.state?.email || '')
  const [step, setStep] = useState(location.state?.step === 'code' ? 'code' : 'email')
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveSession } = useAuth()

  // Paso 1: el back verifica que el mail sea de un organizador y le manda el código
  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setLoading(true)
    try {
      await authService.organizerRequestCode(email.trim())
      setCode('')
      setStep('code')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo enviar el código'))
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: se valida el código y se inicia la sesión
  const handleCodeSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setInfoMessage('')

    if (code.length !== 6) {
      setErrorMessage('El código tiene que tener 6 dígitos.')
      return
    }

    setLoading(true)
    try {
      const data = await authService.organizerVerifyCode(email.trim(), code)
      const user = saveSession(data)
      navigate(HOME_BY_ROLE[user.type_users_id] || '/')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo verificar el código'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setErrorMessage('')
    setInfoMessage('')
    try {
      await authService.organizerRequestCode(email.trim())
      setInfoMessage('Te enviamos un nuevo código.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo reenviar el código'))
    }
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
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  if (errorMessage) setErrorMessage('')
                }}
                required
                maxLength={6}
                placeholder="XXX-XXX"
                aria-label="Código de verificación de 6 dígitos"
              />

              {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
              {infoMessage && <p className="organizer-form-note">{infoMessage}</p>}
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
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => {
                // En el paso del código, "Atras" vuelve a pedir el mail
                if (step === 'code') {
                  setStep('email')
                  setErrorMessage('')
                  setInfoMessage('')
                } else {
                  navigate('/login')
                }
              }}
            >
              Atras
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : step === 'email' ? 'Confirmar' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
