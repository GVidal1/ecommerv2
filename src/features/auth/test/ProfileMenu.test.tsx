import { render, screen, fireEvent } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterAll,
  beforeAll,
} from "vitest";
import { ProfileMenu } from "../components/ProfileMenu";
import * as authUtils from "../utils/authUtils";

// Mocks de componentes hijos
vi.mock("../components/LoginPage", () => ({
  LoginPage: ({ onClose }: any) => (
    <div data-testid="login-modal">
      Modal Login <button onClick={onClose}>Cerrar</button>
    </div>
  ),
}));

vi.mock("../components/RegisterPage", () => ({
  RegisterPage: ({ onClose }: any) => (
    <div data-testid="register-modal">
      Modal Register <button onClick={onClose}>Cerrar</button>
    </div>
  ),
}));

describe("<ProfileMenu />", () => {
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("debe mostrar opciones de 'Iniciar sesión' cuando NO hay usuario", () => {
    vi.spyOn(authUtils, "getCurrentUser").mockReturnValue(null);

    render(<ProfileMenu />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
  });

  it("debe mostrar usuario y 'Cerrar sesión' cuando SÍ hay usuario", () => {
    // CORRECCIÓN: id ahora es un número (sin comillas)
    const mockUser = {
      id: 1,
      email: "test@test.com",
      nombre: "Juan",
      rol: "user" as const,
    };
    vi.spyOn(authUtils, "getCurrentUser").mockReturnValue(mockUser);

    render(<ProfileMenu />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText(/Cerrar sesión/i)).toBeInTheDocument();
  });

  it("debe recargar la página al hacer logout", () => {
    // CORRECCIÓN: id ahora es un número (sin comillas)
    const mockUser = {
      id: 1,
      email: "test@test.com",
      nombre: "Juan",
      rol: "user" as const,
    };
    vi.spyOn(authUtils, "getCurrentUser").mockReturnValue(mockUser);

    render(<ProfileMenu />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText(/Cerrar sesión/i));

    expect(window.location.reload).toHaveBeenCalled();
  });
});
