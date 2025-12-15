import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MVVSection } from "../components/MVVSection";

describe("<MVVSection />", () => {
  it("debe renderizar las tarjetas de Misión y Visión con su contenido", () => {
    render(<MVVSection />);

    // Verificamos los títulos
    expect(
      screen.getByRole("heading", { name: /misión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /visión/i })
    ).toBeInTheDocument();

    // Verificamos parte del texto del contenido para asegurar que se pintan
    expect(
      screen.getByText(/brindar a nuestros clientes productos de moda/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/convertirnos en una marca reconocida/i)
    ).toBeInTheDocument();
  });

  it("debe renderizar la tarjeta de Valores con la lista de valores", () => {
    render(<MVVSection />);

    // Verificamos el título de la sección de valores
    expect(
      screen.getByRole("heading", { name: /valores/i })
    ).toBeInTheDocument();

    // Verificamos que se renderice la lista y algunos de los valores específicos
    // Buscamos los textos en negrita (los nombres de los valores)
    expect(screen.getByText("Calidad:")).toBeInTheDocument();
    expect(screen.getByText("Confianza:")).toBeInTheDocument();
    expect(screen.getByText("Pasión:")).toBeInTheDocument();

    // Verificamos alguna descripción de los valores
    expect(screen.getByText(/amamos lo que hacemos/i)).toBeInTheDocument();
  });

  it("debe renderizar los iconos correctamente", () => {
    const { container } = render(<MVVSection />);

    // Lucide renderiza SVGs. Verificamos que existan 3 iconos (Misión, Visión, Valores)
    // Buscamos elementos con la clase que suelen tener los iconos o simplemente svg
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });
});
