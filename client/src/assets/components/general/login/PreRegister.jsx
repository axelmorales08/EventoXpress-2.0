import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'
import { authService } from '../../../../services/authService'
import { getErrorMessage } from '../../../../services/api'
import { useAuth } from '../../../../context/useAuth'
import { HOME_BY_ROLE } from '../../../../context/authContext'

// Ids de la tabla genders (ver api/config/seeder.js)
const GENDER_IDS = {
  femenino: 1,
  masculino: 2,
  otro: 3,
  'prefiero-no-decirlo': 4,
}

export default function PreRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    dni: '',
    birthDate: '',
    gender: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveSession } = useAuth()

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage('')
  }

  // Mismas reglas que valida el back, así el usuario ve el error sin esperar la respuesta
  function validate() {
    if (!/^\d{7,8}$/.test(form.dni.trim())) return 'El DNI tiene que tener 7 u 8 números'
    if (!/^\+?\d{6,15}$/.test(form.phone.replace(/[\s-]/g, ''))) return 'El teléfono no es válido'
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden'
    if (new Date(form.birthDate) > new Date()) return 'La fecha de nacimiento no es válida'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setLoading(true)
    try {
      // El país no se guarda porque la tabla users no tiene esa columna
      const data = await authService.register({
        full_name: form.fullName.trim(),
        user_name: form.username.trim(),
        email: form.email.trim(),
        dni: form.dni.trim(),
        birthdate: form.birthDate,
        gender_id: GENDER_IDS[form.gender],
        phone: form.phone.replace(/[\s-]/g, ''),
        password: form.password,
      })

      // El back ya devuelve el token, así que el usuario queda logueado
      const user = saveSession(data)
      navigate(HOME_BY_ROLE[user.type_users_id] || '/')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo completar el registro'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Registrate</h2>
        <p className="register-sub">Registra tu cuenta de EventoXpress y disfruta de tus eventos favoritos.</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-grid">
            <div className="register-field">
              <label className="register-label">Nombre completo</label>
              <input className="register-input" type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Tu nombre completo" />
            </div>

            <div className="register-field">
              <label className="register-label">Nombre de usuario</label>
              <input className="register-input" type="text" name="username" value={form.username} onChange={handleChange} required placeholder="Tu nombre de usuario" />
            </div>

            <div className="register-field">
              <label className="register-label">Correo electrónico</label>
              <input className="register-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="tu@correo.com" />
            </div>

            <div className="register-field">
              <label className="register-label">DNI</label>
              <input className="register-input" type="text" name="dni" value={form.dni} onChange={handleChange} required placeholder="Tu DNI" />
            </div>

            <div className="register-field">
              <label className="register-label">Fecha de nacimiento</label>
              <input className="register-input" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
            </div>

            <div className="register-field">
              <label className="register-label">Género</label>
              <select className="register-input" name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Selecciona</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
              </select>
            </div>

            <div className="register-field">
              <label className="register-label">Teléfono</label>
              <input className="register-input" type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="Tu teléfono" />
            </div>

            <div className="register-field">
              <label className="register-label">País</label>
              <select className="register-input" name="country" value={form.country} onChange={handleChange} required>
                <option value="">Selecciona un país</option>
                <option value="argentina">Argentina</option>
                <option value="peru">Perú</option>
                <option value="paraguay">Paraguay</option>
                <option value="bolivia">Bolivia</option>
              </select>
            </div>

            <div className="register-field">
              <label className="register-label">Ingrese una contraseña</label>
              <input className="register-input" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Contraseña" />
            </div>

            <div className="register-field">
              <label className="register-label">Repetir contraseña</label>
              <input className="register-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Repetir contraseña" />
            </div>
          </div>

          {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}

          <button type="submit" className="btn btn-primary register-submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>

          <p className="register-small">
            ¿ya estas registrado?{' '}
            <span className="register-link" onClick={() => navigate('/login/client')}>Iniciá sesión</span>
          </p>
        </form>
      </div>
    </div>
  )
}
