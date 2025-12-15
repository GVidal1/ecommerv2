import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContactPage } from "../ContactPage"; // Ajusta la ruta si es necesario

// Mockeamos los componentes hijos para aislar la prueba de la página
vi.mock("../components/ContactHero", () => ({
  ContactHero: () => <div data-testid="contact-hero">Hero Mock</div>,
}));

vi.mock("../components/ContactInfo", () => ({
  ContactInfo: () => <div data-testid="contact-info">Info Mock</div>,
}));

vi.mock("../components/ContactForm", () => ({
  ContactForm: () => <div data-testid="contact-form">Form Mock</div>,
}));

describe("<ContactPage />", () => {
  it("debe estructurar la página con sus 3 secciones principales", () => {
    render(<ContactPage />);

    expect(screen.getByTestId("contact-hero")).toBeInTheDocument();
    expect(screen.getByTestId("contact-info")).toBeInTheDocument();
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });
});
