import { useState, type FormEvent, type ChangeEvent } from "react";
import { useAppContext } from "../../../hooks/useAppContext";
import "../styles/Login.css";

export function Login() {
  const { loginUser, currentUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "El correo electrónico es requerido",
      }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Ingrese un correo electrónico válido",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña es requerida",
      }));
      return false;
    }
    if (password.length < 3) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña debe tener al menos 3 caracteres",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const success = loginUser(email, password);

      if (success) {
        setMessage("¡Bienvenido! Redirigiendo...");
        setMessageType("success");

        setTimeout(() => {
          // Aquí integrarías con React Router
          // const userRole = currentUser?.rol || 'user';
          // navigate(userRole === 'admin' ? '/admin' : '/');
          console.log("Redirigiendo al dashboard...");
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
    <div className="container-login">
      <div className="login-box">
        <h1>STYLEPOINT</h1>
        <p>Inicia sesión en tu cuenta</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="ejemplo@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                    fill="currentColor"
                  />
                </svg>
                {errors.email}
              </div>
            )}
          </div>

          <div className={`form-group ${errors.password ? "error" : ""}`}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                    fill="currentColor"
                  />
                </svg>
                {errors.password}
              </div>
            )}
          </div>

          <div className="options">
            <label className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordarme
            </label>
            <a href="#/forgot-password">¿Olvidaste tu contraseña?</a>
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
            ¿No tienes cuenta? <a href="#/register">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}
