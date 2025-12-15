import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsSection } from "../components/StatsSection";

describe("<StatsSection />", () => {
  it("debe renderizar el título de la sección de estadísticas", () => {
    render(<StatsSection />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /números que nos respaldan/i,
      })
    ).toBeInTheDocument();
  });

  it("debe mostrar correctamente todas las tarjetas de estadísticas", () => {
    render(<StatsSection />);

    // Verificamos algunos números y etiquetas clave
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("Productos únicos")).toBeInTheDocument();

    expect(screen.getByText("1000+")).toBeInTheDocument();
    expect(screen.getByText("Clientes satisfechos")).toBeInTheDocument();

    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("Soporte al cliente")).toBeInTheDocument();
  });
});
