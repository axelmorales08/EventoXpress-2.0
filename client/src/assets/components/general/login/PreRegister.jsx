import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

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

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('register client', form)
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

          <button type="submit" className="btn btn-primary register-submit">Registrarme</button>

          <p className="register-small">
            ¿ya estas registrado?{' '}
            <span className="register-link" onClick={() => navigate('/login/client')}>Iniciá sesión</span>
          </p>
        </form>
      </div>
    </div>
  )
}
