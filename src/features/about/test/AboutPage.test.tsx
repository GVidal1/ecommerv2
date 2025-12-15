import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
// Ajusta la ruta a donde esté tu AboutPage.tsx
// Si el test está en src/features/about/test/ y la página en src/features/about/
import { AboutPage } from "../AboutPage";

describe("<AboutPage />", () => {
  it("debe renderizar todas las secciones principales (Texto real)", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    // 1. Verificamos AboutHero (Busca el título real)
    expect(screen.getByText(/Conoce a StylePoint/i)).toBeInTheDocument();

    // 2. Verificamos AboutContent (Busca el título real)
    expect(screen.getByText(/Nuestra Historia/i)).toBeInTheDocument();

    // 3. Verificamos MVVSection (Busca 'Misión' o 'Visión')
    expect(screen.getByText(/Misión/i)).toBeInTheDocument();

    // 4. Verificamos StatsSection (Busca alguna estadística)
    expect(screen.getByText(/Números que nos respaldan/i)).toBeInTheDocument();

    // 5. Verificamos TeamSection (Busca a los fundadores)
    expect(screen.getByText(/Gabriel Vidal/i)).toBeInTheDocument();
    expect(screen.getByText(/Raúl Fernández/i)).toBeInTheDocument();

    // 6. Verificamos CTASection (Busca el botón o texto final)
    expect(
      screen.getByText(/¿Listo para encontrar tu estilo?/i)
    ).toBeInTheDocument();
  });
});
