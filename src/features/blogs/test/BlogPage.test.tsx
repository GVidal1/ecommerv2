import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BlogPage } from "../BlogPage";

// CORRECCIÓN IMPORTANTE: Ajustamos la ruta para llegar a src/constants
// Desde src/features/blogs/test/ necesitamos subir 3 niveles: ../../../
vi.mock("../../../constants/blogsconstant", () => ({
  blogPosts: [
    {
      id: 1,
      category: "moda",
      title: "Noticia de Moda",
      image: "img-moda.jpg",
      imageAlt: "Foto moda",
      tag: "Tendencia",
      excerpt: "Resumen de moda...",
      link: "https://moda.com",
    },
    {
      id: 2,
      category: "hombres",
      title: "Noticia de Hombres",
      image: "img-hombres.jpg",
      imageAlt: "Foto hombres",
      tag: "Estilo",
      excerpt: "Resumen hombres...",
      link: "https://hombres.com",
    },
    {
      id: 3,
      category: "relojes",
      title: "Noticia de Relojes",
      image: "img-relojes.jpg",
      imageAlt: "Foto relojes",
      tag: "Accesorios",
      excerpt: "Resumen relojes...",
      link: "https://relojes.com",
    },
  ],
}));

describe("<BlogPage />", () => {
  it("debe renderizar el título de la página y la descripción", () => {
    render(<BlogPage />);
    expect(screen.getByText(/Blog y Novedades/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Descubre las últimas tendencias/i)
    ).toBeInTheDocument();
  });

  it('debe mostrar TODOS los posts al cargar la página (filtro por defecto: "Todo")', () => {
    render(<BlogPage />);
    // Ahora sí encontrará estos textos porque el Mock funcionará
    expect(screen.getByText("Noticia de Moda")).toBeInTheDocument();
    expect(screen.getByText("Noticia de Hombres")).toBeInTheDocument();
    expect(screen.getByText("Noticia de Relojes")).toBeInTheDocument();

    const btnTodo = screen.getByRole("button", { name: /Todo/i });
    expect(btnTodo).toHaveClass("is-active");
  });

  it('debe filtrar y mostrar solo posts de "Moda" al hacer clic en el filtro', () => {
    render(<BlogPage />);
    const btnModa = screen.getByRole("button", { name: /Moda/i });
    fireEvent.click(btnModa);

    expect(screen.getByText("Noticia de Moda")).toBeInTheDocument();
    expect(screen.queryByText("Noticia de Hombres")).not.toBeInTheDocument();
    expect(screen.queryByText("Noticia de Relojes")).not.toBeInTheDocument();
    expect(btnModa).toHaveClass("is-active");
  });

  it('debe filtrar y mostrar solo posts de "Hombres"', () => {
    render(<BlogPage />);
    fireEvent.click(screen.getByRole("button", { name: /Hombres/i }));

    expect(screen.queryByText("Noticia de Moda")).not.toBeInTheDocument();
    expect(screen.getByText("Noticia de Hombres")).toBeInTheDocument();
  });

  it('debe filtrar y mostrar solo posts de "Relojes"', () => {
    render(<BlogPage />);
    fireEvent.click(screen.getByRole("button", { name: /Relojes/i }));

    expect(screen.queryByText("Noticia de Moda")).not.toBeInTheDocument();
    expect(screen.getByText("Noticia de Relojes")).toBeInTheDocument();
  });

  it('debe volver a mostrar todos los posts al hacer clic en "Todo" después de filtrar', () => {
    render(<BlogPage />);

    // Filtramos y luego volvemos a Todo
    fireEvent.click(screen.getByRole("button", { name: /Relojes/i }));
    expect(screen.queryByText("Noticia de Moda")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Todo/i }));

    expect(screen.getByText("Noticia de Moda")).toBeInTheDocument();
    expect(screen.getByText("Noticia de Hombres")).toBeInTheDocument();
  });

  it('los enlaces de "Ver más" deben abrirse en una nueva pestaña (target="_blank")', () => {
    render(<BlogPage />);
    const links = screen.getAllByRole("link", { name: /ver más/i });

    // Como el mock define que el primero es el de moda con link "https://moda.com":
    expect(links[0]).toHaveAttribute("href", "https://moda.com");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });
});
