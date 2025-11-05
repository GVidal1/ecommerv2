import { useState, type MouseEvent } from "react";
import "../styles/Blogs.css";

type Category = "all" | "moda" | "hombres" | "relojes";

interface BlogPost {
  id: number;
  category: Category;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: "moda",
    tag: "NOTICIA 1",
    title: "Nuevas tendencias de moda en mujeres",
    excerpt:
      "De la pasarela a la calle: prendas, accesorios y looks que marcan cada temporada.",
    image: "assets/moda.webp",
    imageAlt: "Tendencias de moda en mujeres",
    link: "https://www.vogue.es/moda/tendencias",
  },
  {
    id: 2,
    category: "hombres",
    tag: "NOTICIA 2",
    title: "Nuevas tendencias de moda",
    excerpt: "Así vestirán los hombres que más saben de moda esta temporada.",
    image: "assets/hombres.jpg",
    imageAlt: "Tendencias de moda para hombres primavera/verano 2025",
    link: "https://www.revistagq.com/articulo/tendencias-primavera-verano-2025-hombre-como-vestir",
  },
  {
    id: 3,
    category: "relojes",
    tag: "NOTICIA 3",
    title: "Nuevas tendencias de relojes",
    excerpt: "Lo último desde Watches and Wonders 2025.",
    image: "assets/reloj.jpg",
    imageAlt: "Tendencias de relojes Watches and Wonders 2025",
    link: "https://www.chrono24.cl/magazine/estas-son-las-tendencias-de-watches-and-wonders-2025-p_152256/",
  },
];

export function Blogs() {
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
