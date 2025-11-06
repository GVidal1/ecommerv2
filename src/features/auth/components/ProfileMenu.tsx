import { useState, useEffect, useRef } from "react";
import { User, LogOut, Shield } from "lucide-react";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { getCurrentUser } from "../utils/authUtils";
import "../styles/profileMenu.css";

interface CurrentUser {
  email: string;
  nombre: string;
  rol: "admin" | "user";
}

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsOpen(false);
    window.location.reload();
  };

  const handleLoginSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleRegisterSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    setShowRegister(false);
  };

  return (
    <>
      <div ref={menuRef} className="profile-menu">
        <button
          className="profile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <User size={24} />
        </button>

        {isOpen && (
          <div className="profile-menu-content show">
            {currentUser ? (
              <>
                <div className="profile-menu-header">
                  <p className="user-name">{currentUser.nombre}</p>
                  <p className="user-email">{currentUser.email}</p>
                </div>
                <div className="profile-menu-divider" />
                {currentUser.rol === "admin" && (
                  <a href="/admin" className="profile-menu-item">
                    <Shield size={20} />
                    Panel de Admin
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="profile-menu-item logout-btn"
                >
                  <LogOut size={20} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsOpen(false);
                  }}
                  className="profile-menu-item"
                >
                  <User size={20} />
                  Iniciar sesión
                </button>
                <button
                  onClick={() => {
                    setShowRegister(true);
                    setIsOpen(false);
                  }}
                  className="profile-menu-item"
                >
                  <User size={20} />
                  Registrarse
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showRegister && (
        <RegisterPage
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
};
