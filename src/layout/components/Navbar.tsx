import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../hooks/useAppContext";
import "./Navbar.css";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAppContext();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          STYLEPOINT
        </Link>

        <button
          className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link
              to="/"
              className={isActive("/")}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={isActive("/products")}
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className={isActive("/blog")}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActive("/about")}
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={isActive("/contact")}
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </li>

          {currentUser ? (
            <>
              <li>
                <span className="navbar-user">👤 {currentUser.nombre}</span>
              </li>
              {currentUser.rol === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    className={`navbar-admin ${isActive("/admin")}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button className="navbar-logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className={`navbar-login ${isActive("/login")}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
