import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProtectedRoute } from "../components/ProtectedRoute";
import * as authUtils from "../utils/authUtils";

describe("<ProtectedRoute />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige al home si NO está autenticado", () => {
    vi.spyOn(authUtils, "isAuthenticated").mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={["/secreto"]}>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route
            path="/secreto"
            element={
              <ProtectedRoute>
                <h1>Secreto</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Secreto")).not.toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("muestra el contenido si ESTÁ autenticado", () => {
    vi.spyOn(authUtils, "isAuthenticated").mockReturnValue(true);
    vi.spyOn(authUtils, "isAdmin").mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={["/secreto"]}>
        <ProtectedRoute>
          <h1>Secreto</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Secreto")).toBeInTheDocument();
  });
});
