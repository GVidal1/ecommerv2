import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AboutHero } from "../components/AboutHero";
describe("<AboutHero />", () => {
  it("debe renderizar el título principal H1", () => {
    render(<AboutHero />);

    expect(
      screen.getByRole("heading", { level: 1, name: /conoce a stylepoint/i })
    ).toBeInTheDocument();
  });

  it("debe renderizar el párrafo de descripción del hero", () => {
    render(<AboutHero />);

    expect(
      screen.getByText(/somos más que una tienda de moda/i)
    ).toBeInTheDocument();
  });
});
