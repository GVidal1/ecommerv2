import { blogPosts } from "../../constants/blogsconstant";
import { useState, type MouseEvent } from "react";
type Category = "all" | "moda" | "hombres" | "relojes";
import "./styles/BlogPage.css";

export function BlogPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");

  const handleFilterClick = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const button = target.closest("button.chip");

    if (!button) return;

    const filter = button.getAttribute("data-filter") as Category;
    setActiveFilter(filter);
  };

  const filteredPosts =
    activeFilter === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeFilter);

  return (
    <div className="blogs-container">
      {/* Hero Section */}
      <div className="blogs-hero">
        <div className="blogs-hero-content">
          <h1>Blog y Novedades</h1>
          <p>
            Descubre las últimas tendencias, consejos de estilo y noticias del
            mundo de la moda. Mantente al día con nuestros artículos exclusivos.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Filters */}
        <nav
          className="blogs-filters"
          aria-label="Filtros de categoría"
          onClick={handleFilterClick}
        >
          <button
            className={`chip ${activeFilter === "all" ? "is-active" : ""}`}
            type="button"
            aria-pressed={activeFilter === "all"}
            data-filter="all"
          >
            Todo
          </button>
          <button
            className={`chip ${activeFilter === "moda" ? "is-active" : ""}`}
            type="button"
            aria-pressed={activeFilter === "moda"}
            data-filter="moda"
          >
            Moda
          </button>
          <button
            className={`chip ${activeFilter === "hombres" ? "is-active" : ""}`}
            type="button"
            aria-pressed={activeFilter === "hombres"}
            data-filter="hombres"
          >
            Hombres
          </button>
          <button
            className={`chip ${activeFilter === "relojes" ? "is-active" : ""}`}
            type="button"
            aria-pressed={activeFilter === "relojes"}
            data-filter="relojes"
          >
            Relojes
          </button>
        </nav>

        {/* Blog Grid */}
        <section className="blogs-grid" aria-label="Listado de artículos">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="blog-card"
              data-category={post.category}
            >
              <div className="blog-media">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="blog-image"
                  loading="lazy"
                />
              </div>
              <div className="blog-content">
                <h3 className="blog-tag">{post.tag}</h3>
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <a
                  className="add-btn blog-action"
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver más
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
