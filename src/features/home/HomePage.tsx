import { useAppContext } from '../../hooks/useAppContext';
import { HeroSection } from './components/HeroSection';
import { FeaturedSection } from './components/FeaturedSection';
import { ProductCard } from '../../layout/components/common/ProductCard';
import './Home.css';

const HomePage = () => {
  const { products } = useAppContext();

  const watchesProducts = () => {
    return products
      .filter(
        (product) =>
          product.category === 'mens-watches' ||
          product.category === 'womens-watches'
      )
      .slice(0, 3);
  };

  const shoesProducts = () => {
    return products
      .filter(
        (product) =>
          product.category === 'mens-shoes' ||
          product.category === 'womens-shoes'
      )
      .slice(0, 3);
  };

  return (
    <div className="home-container">
      <HeroSection />

      <div className="container">
        <FeaturedSection>
          <FeaturedSection.Header>
            <FeaturedSection.Title>Último en Relojes</FeaturedSection.Title>
            <FeaturedSection.Link to="/products">Ver más</FeaturedSection.Link>
          </FeaturedSection.Header>
          <FeaturedSection.Grid>
            {watchesProducts().map((product) => (
              <ProductCard key={product.id} product={product}>
                <ProductCard.Image />
                <ProductCard.Info>
                  <ProductCard.Title />
                  <ProductCard.Rating />
                  <ProductCard.Price />
                </ProductCard.Info>
              </ProductCard>
            ))}
          </FeaturedSection.Grid>
        </FeaturedSection>

        <FeaturedSection>
          <FeaturedSection.Header>
            <FeaturedSection.Title>Nuevos Zapatos</FeaturedSection.Title>
            <FeaturedSection.Link to="/products">Ver más</FeaturedSection.Link>
          </FeaturedSection.Header>
          <FeaturedSection.Grid>
            {shoesProducts().map((product) => (
              <ProductCard key={product.id} product={product}>
                <ProductCard.Image />
                <ProductCard.Info>
                  <ProductCard.Title />
                  <ProductCard.Rating />
                  <ProductCard.Price />
                </ProductCard.Info>
              </ProductCard>
            ))}
          </FeaturedSection.Grid>
        </FeaturedSection>
      </div>
    </div>
  );
};

export default HomePage;
