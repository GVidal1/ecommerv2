import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactInfo } from "../components/ContactInfo";

describe("<ContactInfo />", () => {
  it("debe renderizar todas las tarjetas de información", () => {
    render(<ContactInfo />);

    // Verificamos los títulos de las tarjetas
    expect(
      screen.getByRole("heading", { name: /ubicación/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /teléfono/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /horarios/i })
    ).toBeInTheDocument();
  });

  it("debe mostrar la información de contacto específica", () => {
    render(<ContactInfo />);

    // Verificamos contenido clave
    expect(screen.getByText(/Santiago, Chile/i)).toBeInTheDocument();
    expect(screen.getByText(/info@stylepoint.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Lunes - Viernes/i)).toBeInTheDocument();
  });
});
