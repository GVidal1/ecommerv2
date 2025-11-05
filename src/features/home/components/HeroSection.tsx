import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="border-home">
      <img
        src="../../../assets/HEROIMAGE.png"
        alt="StylePoint - Encuentra tu estilo único"
        className="picture-home"
      />

      <div className="hero-content">
        <h1>StylePoint</h1>
        <p>Encuentra tu estilo único en StylePoint</p>

        <Link to="/products">
          <button className="btn-ver-productos">Ver productos</button>
        </Link>
      </div>
    </section>
  );
};
