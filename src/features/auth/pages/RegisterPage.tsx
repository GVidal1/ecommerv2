import { Link } from "react-router-dom";
import { RegisterForm } from "../../../components/organisms/RegisterForm/RegisterForm";
import "../styles/AuthPages.css";

export function RegisterPage() {
  return (
    <div className="auth-page-container">
      <div className="auth-page-box">
        <h1>STYLEPOINT</h1>
        <p>Crea tu cuenta</p>
        <RegisterForm />
        <div className="register-login-link">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
