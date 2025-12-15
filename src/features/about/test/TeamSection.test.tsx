import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TeamSection } from "../components/TeamSection";

describe("<TeamSection />", () => {
  it("debe renderizar el título de la sección de equipo", () => {
    render(<TeamSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /nuestro equipo/i })
    ).toBeInTheDocument();
  });

  it('debe mostrar a los miembros del equipo "Gabriel" y "Raúl"', () => {
    render(<TeamSection />);

    // Verificamos nombres
    expect(screen.getByText("Gabriel Vidal")).toBeInTheDocument();
    expect(screen.getByText("Raúl Fernández")).toBeInTheDocument();

    // Verificamos roles
    expect(screen.getByText("Fundador & CEO")).toBeInTheDocument();
    expect(screen.getByText("Co-Fundador & CTO")).toBeInTheDocument();
  });
});
