import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              className={isActive('/')}
              onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={isActive('/products')}
              onClick={() => setIsMenuOpen(false)}>
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className={isActive('/blog')}
              onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActive('/about')}
              onClick={() => setIsMenuOpen(false)}>
              Nosotros
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={isActive('/contact')}
              onClick={() => setIsMenuOpen(false)}>
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
