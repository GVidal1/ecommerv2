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

export { blogPosts };
