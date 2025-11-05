import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types';
import type { ReactNode } from 'react';

// Contexto Internoo
// Esto nos permite pasar el producto a todos los sub-componentes
// sin tener que pasarlo como prop en cada uno.

interface IProductContext {
  product: Product;
}
const ProductContext = createContext<IProductContext | undefined>(undefined);

// Hook para consumir el contexto interno
const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      'Este componente debe ser usado dentro de <ProductCard>...</ProductCard>'
    );
  }
  return context;
};

// Sub-componentes
// Cada uno consume el contexto para obtener los datos del producto.

const Image = () => {
  const { product } = useProduct();
  return (
    <div className="img-carousel">
      <img
        height="150px"
        width="auto"
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
      />
    </div>
  );
};

const Info = ({ children }: { children: ReactNode }) => {
  return <div className="product-info">{children}</div>;
};

const Title = () => {
  const { product } = useProduct();
  return <h2 className="product-name">{product.title}</h2>;
};

const Rating = () => {
  const { product } = useProduct();
  return <p className="product-rating">{product.rating} ⭐</p>;
};

const Price = () => {
  const { product } = useProduct();
  return <p className="product-price">${product.price}</p>;
};

//  para los botones de agreagar a carrito (De ser necesario)
const Buttons = ({ children }: { children: ReactNode }) => {
  // e.stopPropagation() para que al hacer click en los botones
  // no se active el onClick de la tarjeta (que navega a otra página).
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="card-btns" onClick={handleClick}>
      {children}
    </div>
  );
};

//Componente Principal

interface ProductCardProps {
  product: Product;
  children: ReactNode; // los sub-componentes (Image, Info, etc.)
}

export const ProductCard = ({ product, children }: ProductCardProps) => {
  const navigate = useNavigate();

  // El click parar navegar al detalle
  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    // Proveemos el PRODUCT al contexto
    <ProductContext.Provider value={{ product }}>
      <div className="card" onClick={handleCardClick}>
        <div className="card-flex-container">{children}</div>
      </div>
    </ProductContext.Provider>
  );
};

//Adjuntar sub-componentes
ProductCard.Image = Image;
ProductCard.Info = Info;
ProductCard.Title = Title;
ProductCard.Rating = Rating;
ProductCard.Price = Price;
ProductCard.Buttons = Buttons;
