import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { FeaturedSection } from "../components/FeaturedSection"; // Ajusta ruta

describe("<FeaturedSection />", () => {
  it("debe renderizar correctamente usando el patrón de componentes compuestos", () => {
    render(
      <MemoryRouter>
        <FeaturedSection>
          <FeaturedSection.Header>
            <FeaturedSection.Title>Título de Prueba</FeaturedSection.Title>
            <FeaturedSection.Link to="/test-link">Ver más</FeaturedSection.Link>
          </FeaturedSection.Header>

          <FeaturedSection.Grid>
            <div data-testid="test-item">Item 1</div>
            <div data-testid="test-item">Item 2</div>
          </FeaturedSection.Grid>
        </FeaturedSection>
      </MemoryRouter>
    );

    // 1. Verificar Título
    expect(
      screen.getByRole("heading", { level: 2, name: "Título de Prueba" })
    ).toBeInTheDocument();

    // 2. Verificar Link
    const link = screen.getByRole("link", { name: "Ver más" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test-link");

    // 3. Verificar Grid
    const items = screen.getAllByTestId("test-item");
    expect(items).toHaveLength(2);
  });
});
