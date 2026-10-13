import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PreLogin.css'

export default function OrganizerLogin() {
  const navigate = useNavigate()

  return (
    <div className="prelogin-wrap">
      <div className="prelogin-card">
        <h2 className="prelogin-title">Login - Organizador</h2>
        <p>Componente de login de organizador (placeholder).</p>
        <div style={{marginTop:16}}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Volver</button>
        </div>
      </div>
    </div>
  )
}
