import { useState } from 'react';
import { Link } from 'react-router-dom'
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
              <button type="button" className="dropdown-option">Presencial</button>
              <button type="button" className="dropdown-option">Streaming</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
