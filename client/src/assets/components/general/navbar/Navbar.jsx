import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css';
import { useAuth } from '../../../../context/useAuth'
import { ROLES, ROLE_NAMES } from '../../../../context/authContext'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()
  const { isAuthenticated, user, role, logout } = useAuth()

  // Navega y cierra el menú
  const go = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    logout()
    go('/')
  }

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">EventoXpress</Link>
        </div>

        <div className="navbar-menu-wrap">
          <button
            className="navbar-menu"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {menuOpen && (
            <div className="navbar-dropdown">
              {isAuthenticated && (
                <div className="dropdown-option" style={{ cursor: 'default', color: '#9c9c9c', fontWeight: 500, fontSize: '0.8rem' }}>
                  {user?.full_name} · {ROLE_NAMES[role]}
                </div>
              )}

              <button type="button" className="dropdown-option" onClick={() => go('/eventos?tipo=1')}>Presencial</button>
              <button type="button" className="dropdown-option" onClick={() => go('/eventos?tipo=2')}>Streaming</button>
              <button type="button" className="dropdown-option" onClick={() => go('/eventos')}>Todos los eventos</button>

              {isAuthenticated ? (
                <>
                  <button type="button" className="dropdown-option" onClick={() => go('/perfil')}>Mi perfil</button>
                  {(role === ROLES.ORGANIZADOR || role === ROLES.ADMIN) && (
                    <button type="button" className="dropdown-option" onClick={() => go('/organizador')}>Panel de eventos</button>
                  )}
                  {role === ROLES.ADMIN && (
                    <button type="button" className="dropdown-option" onClick={() => go('/admin/usuarios')}>Usuarios</button>
                  )}
                  <button type="button" className="dropdown-option" onClick={handleLogout}>Cerrar sesión</button>
                </>
              ) : (
                <>
                  <button type="button" className="dropdown-option" onClick={() => go('/login')}>Iniciar sesión</button>
                  <button type="button" className="dropdown-option" onClick={() => go('/register')}>Registrarse</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
