import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { RegisterPage } from "../components/RegisterPage"; // Ajusta la ruta si es necesario

// Mock del contexto (necesario si el componente usa useAppContext)
vi.mock("../../../hooks/useAppContext", () => ({
  useAppContext: vi.fn(() => ({})),
}));

describe("<RegisterPage />", () => {
  it("debe renderizar el componente de registro", () => {
    // 1. Creamos las funciones mock
    const mockOnClose = vi.fn();
    const mockOnSwitchToLogin = vi.fn();
    const mockOnRegisterSuccess = vi.fn();

    render(
      <MemoryRouter>
        {/* 2. Pasamos las props obligatorias al componente */}
        <RegisterPage
          onClose={mockOnClose}
          onSwitchToLogin={mockOnSwitchToLogin}
          onRegisterSuccess={mockOnRegisterSuccess}
        />
      </MemoryRouter>
    );

    // 3. Verificamos que se renderice (Ajusta el texto "Registrarse" a lo que diga tu botón real)
    // Usamos getByRole para ser más específicos
    const registerButton = screen.getByRole("button", {
      name: /registrarse|crear cuenta/i,
    });
    expect(registerButton).toBeInTheDocument();
  });
});
