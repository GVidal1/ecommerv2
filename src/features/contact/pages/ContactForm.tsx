import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacy: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  privacy?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    privacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case "name":
        if (!value) return "Este campo es obligatorio";
        break;
      case "email":
        if (!value) return "Este campo es obligatorio";
        if (
          typeof value === "string" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          return "Por favor, ingresa un email válido";
        }
        break;
      case "subject":
        if (!value) return "Este campo es obligatorio";
        break;
      case "message":
        if (!value) return "Este campo es obligatorio";
        if (typeof value === "string" && value.length < 10) {
          return "El mensaje debe tener al menos 10 caracteres";
        }
        break;
      case "privacy":
        if (!value) return "Debes aceptar la política de privacidad";
        break;
    }
    return "";
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error on input
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    const error = validateField(name, fieldValue);

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          privacy: false,
        });
        setSubmitStatus("idle");
      }, 2000);
    }, 2000);
  };

  return (
    <div className="contact-form-section">
      <div className="form-container">
        <h2>Envíanos un mensaje</h2>
        <form
          id="contact-form"
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.name ? "error" : ""}
                placeholder="Tu nombre completo"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email ? "error" : ""}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+569 12345678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.subject ? "error" : ""}
              >
                <option value="">Selecciona un asunto</option>
                <option value="consulta">Consulta general</option>
                <option value="soporte">Soporte técnico</option>
                <option value="ventas">Información de ventas</option>
                <option value="devolucion">Devolución/Reembolso</option>
                <option value="otro">Otro</option>
              </select>
              {errors.subject && (
                <span className="error-message">{errors.subject}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje *</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.message ? "error" : ""}
              placeholder="Cuéntanos en qué podemos ayudarte..."
            />
            {errors.message && (
              <span className="error-message">{errors.message}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="privacy"
                name="privacy"
                checked={formData.privacy}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="checkmark"></span>
              Acepto la{" "}
              <a href="#" className="privacy-link">
                política de privacidad
              </a>{" "}
              y el tratamiento de mis datos personales.
            </label>
            {errors.privacy && (
              <span className="error-message">{errors.privacy}</span>
            )}
          </div>

          <button
            className="btn-enviar"
            type="submit"
            disabled={isSubmitting || submitStatus === "success"}
          >
            <span className="btn-text">
              {isSubmitting
                ? "Enviando..."
                : submitStatus === "success"
                ? "¡Mensaje enviado!"
                : "Enviar mensaje"}
            </span>
            <span className="btn-icon">
              <span className="material-symbols-outlined">
                {isSubmitting
                  ? "hourglass_empty"
                  : submitStatus === "success"
                  ? "check"
                  : "send"}
              </span>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
