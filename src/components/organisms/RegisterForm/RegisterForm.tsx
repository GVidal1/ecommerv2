import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../hooks/useAppContext";
import { FormField } from "../../molecules/FormField/FormField";
import { Button } from "../../atoms/Button/Button";
import "./RegisterForm.css";

interface FormErrors {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { addUser, users, loginUser } = useAppContext();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [isLoading, setIsLoading] = useState(false);

  const validateNombre = (nombre: string): boolean => {
    if (!nombre) {
      setErrors((prev) => ({ ...prev, nombre: "El nombre es requerido" }));
      return false;
    }
    if (nombre.length < 3) {
      setErrors((prev) => ({
        ...prev,
        nombre: "El nombre debe tener al menos 3 caracteres",
      }));
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      setErrors((prev) => ({
        ...prev,
        nombre: "El nombre solo puede contener letras",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, nombre: "" }));
    return true;
  };

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
    if (users.some((u) => u.email === email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Este correo electrónico ya está registrado",
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
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña debe tener al menos 6 caracteres",
      }));
      return false;
    }
    if (!/(?=.*\d)(?=.*[a-zA-Z])/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña debe contener al menos una letra y un número",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Debe confirmar la contraseña",
      }));
      return false;
    }
    if (confirmPassword !== formData.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validar en tiempo real
    if (field === "nombre") validateNombre(value);
    if (field === "email") validateEmail(value);
    if (field === "password") {
      validatePassword(value);
      if (formData.confirmPassword)
        validateConfirmPassword(formData.confirmPassword);
    }
    if (field === "confirmPassword") validateConfirmPassword(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isNombreValid = validateNombre(formData.nombre);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = validateConfirmPassword(
      formData.confirmPassword
    );

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
      const success = addUser({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        rol: "user",
      });

      if (success) {
        setMessage("¡Cuenta creada con éxito! Redirigiendo...");
        setMessageType("success");

        // Iniciar sesión automáticamente
        loginUser(formData.email, formData.password);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage("Error al crear la cuenta. El email ya está registrado.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error de registro:", error);
      setMessage("Error al crear la cuenta. Por favor, intente nuevamente.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form" noValidate>
      <FormField
        label="Nombre completo"
        name="nombre"
        type="text"
        placeholder="Ej: Juan Pérez"
        autoComplete="name"
        value={formData.nombre}
        onChange={(e) => handleChange("nombre", e.target.value)}
        error={errors.nombre}
      />

      <FormField
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="ejemplo@email.com"
        autoComplete="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
      />

      <FormField
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
      />

      <FormField
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Crear cuenta
      </Button>

      {message && (
        <p className={`register-message ${messageType}`}>{message}</p>
      )}
    </form>
  );
}
