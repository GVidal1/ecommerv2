import { useAppContext } from '../../hooks/useAppContext';
import { ProductCard } from '../../layout/components/common/ProductCard';
import { AddToCart } from './components/AddToCartBtn';
// import './ProductsPage.css';

const ProductsPage = () => {
  const { products } = useAppContext();

  return (
    <section className="container">
      <h2>Products Page</h2>
      <div className="card-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}>
            <ProductCard.Image />

            <ProductCard.Info>
              <ProductCard.Title />
              <ProductCard.Rating />
              <ProductCard.Price />
            </ProductCard.Info>

            <ProductCard.Buttons>
              <AddToCart product={product}>
                <AddToCart.AddButton />
                <AddToCart.Controls />
              </AddToCart>
            </ProductCard.Buttons>
          </ProductCard>
        ))}
      </div>
    </section>
  );
};

export default ProductsPage;
