import { useState } from "react";
import { X } from "lucide-react";
import { initializeUsers } from "../utils/authUtils";
import "../styles/auth.css";

interface LoginPageProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (user: {
    email: string;
    nombre: string;
    rol: "admin" | "user";
  }) => void;
}

export const LoginPage = ({
  onClose,
  onSwitchToRegister,
  onLoginSuccess,
}: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("El correo electrónico es requerido");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Ingrese un correo electrónico válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("La contraseña es requerida");
      return false;
    }
    if (value.length < 3) {
      setPasswordError("La contraseña debe tener al menos 3 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);
    setMessage("");

    try {
      const users = initializeUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        setMessage("¡Bienvenido! Redirigiendo...");
        setMessageType("success");

        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: user.email,
            nombre: user.nombre || user.email,
            rol: user.rol || "user",
          })
        );

        setTimeout(() => {
          onLoginSuccess({
            email: user.email,
            nombre: user.nombre || user.email,
            rol: user.rol || "user",
          });
          onClose();
        }, 800);
      } else {
        setMessage("Usuario o contraseña incorrectos");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Error en login", err);
      setMessage("Ocurrió un error. Intenta nuevamente");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-login" onClick={onClose}>
      <div className="login-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <h1>STYLEPOINT</h1>
        <p>Inicia sesión en tu cuenta</p>

        <form id="loginForm" onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${emailError ? "error" : ""}`}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              placeholder="ejemplo@email.com"
              autoComplete="email"
            />
            {emailError && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                    fill="currentColor"
                  />
                </svg>
                {emailError}
              </div>
            )}
          </div>

          <div className={`form-group ${passwordError ? "error" : ""}`}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {passwordError && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                    fill="currentColor"
                  />
                </svg>
                {passwordError}
              </div>
            )}
          </div>

          <button
            type="submit"
            id="submitBtn"
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            Iniciar sesión
          </button>
        </form>

        {message && (
          <p id="loginMessage" className={messageType}>
            {message}
          </p>
        )}

        <div className="register-link">
          <p>
            ¿No tienes cuenta?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister();
              }}
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
