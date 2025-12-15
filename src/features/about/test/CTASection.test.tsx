import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { CTASection } from "../components/CTASection";

describe("<CTASection />", () => {
  it("debe renderizar el título de llamada a la acción", () => {
    render(
      <MemoryRouter>
        <CTASection />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /¿listo para encontrar tu estilo?/i,
      })
    ).toBeInTheDocument();
  });

  it('debe contener un enlace que dirija a "/products"', () => {
    render(
      <MemoryRouter>
        <CTASection />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /ver productos/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/products");
  });
});
