import { useState } from "react";
import { X } from "lucide-react";
import "../styles/auth.css";

interface RegisterPageProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: (user: {
    email: string;
    nombre: string;
    rol: "admin" | "user";
  }) => void;
}

export const RegisterPage = ({
  onClose,
  onSwitchToLogin,
  onRegisterSuccess,
}: RegisterPageProps) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateNombre = (value: string) => {
    if (!value) {
      setNombreError("El nombre es requerido");
      return false;
    }
    if (value.length < 3) {
      setNombreError("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
      setNombreError("El nombre solo puede contener letras");
      return false;
    }
    setNombreError("");
    return true;
  };

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

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: { email: string }) => u.email === value)) {
      setEmailError("Este correo electrónico ya está registrado");
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
    if (value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (!/(?=.*\d)(?=.*[a-zA-Z])/.test(value)) {
      setPasswordError(
        "La contraseña debe contener al menos una letra y un número"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError("Debe confirmar la contraseña");
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNombreValid = validateNombre(nombre);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      !isNombreValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const newUser = {
        email,
        password,
        nombre,
        rol: "user" as const,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: newUser.email,
          nombre: newUser.nombre,
          rol: newUser.rol,
        })
      );

      setMessage("¡Cuenta creada con éxito! Redirigiendo...");
      setMessageType("success");

      setTimeout(() => {
        onRegisterSuccess({
          email: newUser.email,
          nombre: newUser.nombre,
          rol: newUser.rol,
        });
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al crear cuenta:", err);
      setMessage("Error al crear la cuenta. Por favor, intente nuevamente.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-login container-register" onClick={onClose}>
      <div
        className="login-box register-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <h1>STYLEPOINT</h1>
        <p>Crea tu cuenta</p>

        <form id="registerForm" onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${nombreError ? "error" : ""}`}>
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                validateNombre(e.target.value);
              }}
              placeholder="Ej: Juan Pérez"
              autoComplete="name"
            />
            {nombreError && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                    fill="currentColor"
                  />
                </svg>
                {nombreError}
              </div>
            )}
          </div>

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
                if (confirmPassword) validateConfirmPassword(confirmPassword);
              }}
              placeholder="••••••••"
              autoComplete="new-password"
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

          <div className={`form-group ${confirmPasswordError ? "error" : ""}`}>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateConfirmPassword(e.target.value);
              }}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {confirmPasswordError && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                    fill="currentColor"
                  />
                </svg>
                {confirmPasswordError}
              </div>
            )}
          </div>

          <button
            type="submit"
            id="submitBtn"
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            Crear cuenta
          </button>
        </form>

        {message && (
          <p id="registerMessage" className={messageType}>
            {message}
          </p>
        )}

        <div className="login-link">
          <p>
            ¿Ya tienes cuenta?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
