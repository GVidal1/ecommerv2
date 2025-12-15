import { render, screen, fireEvent, act } from "@testing-library/react"; // Importamos act
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContactForm } from "../components/ContactForm";

describe("<ContactForm />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("debe renderizar todos los campos del formulario", () => {
    render(<ContactForm />);
    expect(
      screen.getByPlaceholderText(/tu nombre completo/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/cuéntanos en qué podemos ayudarte/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enviar mensaje/i })
    ).toBeInTheDocument();
  });

  it("debe mostrar errores de validación si se intenta enviar vacío", () => {
    render(<ContactForm />);
    const submitBtn = screen.getByRole("button", { name: /enviar mensaje/i });
    fireEvent.click(submitBtn);

    const requiredErrors = screen.getAllByText(/este campo es obligatorio/i);
    expect(requiredErrors.length).toBeGreaterThan(0);
    expect(
      screen.getByText(/debes aceptar la política de privacidad/i)
    ).toBeInTheDocument();
  });

  it("debe validar formato de email incorrecto", () => {
    render(<ContactForm />);
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    fireEvent.change(emailInput, { target: { value: "correo-malo" } });
    fireEvent.blur(emailInput);
    expect(
      screen.getByText(/por favor, ingresa un email válido/i)
    ).toBeInTheDocument();
  });

  it("debe enviar el formulario exitosamente cuando todo es válido", async () => {
    render(<ContactForm />);

    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText(/tu nombre completo/i), {
      target: { value: "Juan Perez" },
    });
    fireEvent.change(screen.getByPlaceholderText(/tu@email.com/i), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "consulta" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/cuéntanos en qué podemos ayudarte/i),
      {
        target: { value: "Hola, quiero consultar sobre un producto." },
      }
    );
    fireEvent.click(screen.getByRole("checkbox"));

    // Enviar
    const submitBtn = screen.getByRole("button", { name: /enviar mensaje/i });
    fireEvent.click(submitBtn);

    // Verificar estado de carga
    expect(screen.getByText(/enviando.../i)).toBeInTheDocument();

    // AQUÍ ESTÁ LA SOLUCIÓN:
    // Envolvemos el avance del tiempo en act() para procesar los estados pendientes
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Ahora verificamos el mensaje de éxito
    expect(screen.getByText(/¡mensaje enviado!/i)).toBeInTheDocument();
  });
});
