import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, type Mock } from "vitest";
import HomePage from "../HomePage"; // Ajusta la ruta si es necesario
import { useAppContext } from "../../../hooks/useAppContext";

// 1. Mockeamos el hook correctamente
vi.mock("../../../hooks/useAppContext", () => ({
  useAppContext: vi.fn(),
}));

// 2. Mockeamos ProductCard para que no renderice cosas complejas
vi.mock("../../layout/components/common/ProductCard", () => {
  const MockProductCard = ({ product, children }: any) => (
    <div data-testid="product-card">
      <h3>{product.title}</h3>
      {children}
    </div>
  );
  MockProductCard.Image = () => <div>Img</div>;
  MockProductCard.Info = ({ children }: any) => <div>{children}</div>;
  MockProductCard.Title = () => <div>TitleComp</div>;
  MockProductCard.Rating = () => <div>Rating</div>;
  MockProductCard.Price = () => <div>Price</div>;

  return { ProductCard: MockProductCard };
});

describe("<HomePage />", () => {
  const mockProducts = [
    { id: 1, title: "Reloj Hombre", category: "mens-watches", price: 100 },
    { id: 2, title: "Reloj Mujer", category: "womens-watches", price: 120 },
    { id: 3, title: "Zapato Hombre", category: "mens-shoes", price: 80 },
    { id: 4, title: "Zapato Mujer", category: "womens-shoes", price: 90 },
    { id: 5, title: "Camiseta", category: "shirts", price: 20 },
  ];

  it("debe renderizar las secciones de Relojes y Zapatos filtrados", () => {
    // IMPORTANTE: Aquí usamos el mock correctamente
    (useAppContext as Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
      // Agrega cualquier otra cosa que tu contexto devuelva normalmente
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Último en Relojes/i)).toBeInTheDocument();
    expect(screen.getByText("Reloj Hombre")).toBeInTheDocument();
    expect(screen.getByText("Reloj Mujer")).toBeInTheDocument();

    expect(screen.getByText(/Nuevos Zapatos/i)).toBeInTheDocument();
    expect(screen.getByText("Zapato Hombre")).toBeInTheDocument();
    expect(screen.getByText("Zapato Mujer")).toBeInTheDocument();
  });

  it("debe renderizar correctamente aunque no haya productos", () => {
    (useAppContext as Mock).mockReturnValue({
      products: [],
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Último en Relojes/i)).toBeInTheDocument();
    expect(screen.queryByTestId("product-card")).not.toBeInTheDocument();
  });
});
