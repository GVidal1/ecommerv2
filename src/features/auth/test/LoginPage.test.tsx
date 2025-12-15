import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, type Mock } from "vitest";
import { LoginPage } from "../components/LoginPage";
import { useAppContext } from "../../../hooks/useAppContext";

vi.mock("../../../hooks/useAppContext", () => ({
  useAppContext: vi.fn(),
}));

describe("<LoginPage />", () => {
  const mockLogin = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnSwitchToRegister = vi.fn();
  const mockOnLoginSuccess = vi.fn();

  it("debe renderizar el formulario de login", () => {
    (useAppContext as Mock).mockReturnValue({ login: mockLogin });

    render(
      <MemoryRouter>
        <LoginPage
          onClose={mockOnClose}
          onSwitchToRegister={mockOnSwitchToRegister}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </MemoryRouter>
    );

    // 1. El email lo seguimos buscando por placeholder porque dice "ejemplo@email.com"
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();

    // 2. CORRECCIÓN: La contraseña la buscamos por su LABEL ("Contraseña")
    // Esto es mejor porque el placeholder son solo puntitos "••••••••"
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });
});
