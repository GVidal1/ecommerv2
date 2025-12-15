import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContactHero } from "../components/ContactHero";

describe("<ContactHero />", () => {
  it("debe renderizar el título y la descripción", () => {
    render(<ContactHero />);

    expect(
      screen.getByRole("heading", { level: 1, name: /contáctanos/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/estamos aquí para ayudarte/i)).toBeInTheDocument();
  });
});
