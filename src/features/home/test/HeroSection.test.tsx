import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
// Ajusta la ruta según tu estructura de carpetas
import { HeroSection } from "../components/HeroSection";

describe("<HeroSection />", () => {
  it("debe renderizar el título principal y el eslogan", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /StylePoint/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Encuentra tu estilo único en StylePoint")
    ).toBeInTheDocument();
  });

  it("debe renderizar la imagen principal con el texto alternativo correcto", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/assets/HEROIMAGE.png");
    expect(image).toHaveAttribute(
      "alt",
      "StylePoint - Encuentra tu estilo único"
    );
  });

  it('debe contener un enlace que redirija a "/products"', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products");
    expect(screen.getByText("Ver productos")).toBeInTheDocument();
  });
});
