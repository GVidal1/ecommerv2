import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AboutContent } from "../components/AboutContent";

describe("<AboutContent />", () => {
  it('debe renderizar el título "Nuestra Historia" y el contenido de texto', () => {
    render(<AboutContent />);

    // Verificamos el título principal
    expect(
      screen.getByRole("heading", { level: 2, name: /nuestra historia/i })
    ).toBeInTheDocument();

    // Verificamos fragmentos del texto para asegurar que se renderiza la descripción
    expect(
      screen.getByText(/somos una tienda dedicada a la moda/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/stylepoint, no solo vendemos productos/i)
    ).toBeInTheDocument();
  });

  it('debe renderizar la sección de la imagen con el texto "Nuestra tienda"', () => {
    render(<AboutContent />);

    // Verificamos el texto que acompaña al icono
    expect(screen.getByText("Nuestra tienda")).toBeInTheDocument();
  });
});
