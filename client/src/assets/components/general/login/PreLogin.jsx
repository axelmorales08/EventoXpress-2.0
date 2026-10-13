import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PreLogin.css'

export default function PreLogin() {
	const navigate = useNavigate()

	return (
		<div className="prelogin-wrap">
			<div className="prelogin-card">
				<h2 className="prelogin-title">Loguearme</h2>
				<p className="prelogin-sub">¿quiero asistir a eventos o organizarlos?</p>

				<div className="prelogin-buttons">
					<button
						className="btn btn-primary"
						onClick={() => navigate('/login/client')}
					>
						Iniciar como cliente
					</button>

					<button
						className="btn btn-secondary"
						onClick={() => navigate('/login/organizer')}
					>
						Iniciar como organizador
					</button>

					<button
						className="btn btn-cancel"
						onClick={() => navigate('/')}
					>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	)
}

