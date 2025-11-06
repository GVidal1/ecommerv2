import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import './ProductDetailPageStyle.css';

const ProductDetailPage = () => {
  // Obtener Datos de la Url ID
  // De todos los parámetros que vienen en la URL, dame el que se llama id
  const { id } = useParams<{ id: string }>();
  const { products, addProductToCart, isLoading } = useAppContext();

  // estados para el producto (cantidad y agregado)
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // el id anterior a numero y busca el producto correspondiente en los products.
  const product = products.find((p) => p.id === Number(id));

  //Manejadores de evento
  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrease = () => {
    setQuantity((q) => Math.min(10, q + 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addProductToCart(product, quantity);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  if (isLoading) {
    return <div className="container">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="container">
        <h2>Producto no encontrado</h2>
        <Link to="/products">Volver a productos</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-details">
        {/* Columna de Imagen */}
        <div className="product-img">
          <img src={product.images[0]} alt={product.title} />
        </div>

        {/* Columna de Información */}
        <div className="product-details-info">
          <h2 className="pd-title">{product.title}</h2>
          <div className="pd-rating">{product.rating} ⭐</div>
          <p className="pd-description">{product.description}</p>

          <div className="pd-price">
            <span className="price-amount">${product.price}</span>
            {product.discountPercentage && (
              <span className="price-discount">
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Controles de Cantidad */}
          <div className="pd-quantity">
            <label className="quantity-label">Cantidad:</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn quantity-minus"
                type="button"
                onClick={handleDecrease}>
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn quantity-plus"
                type="button"
                onClick={handleIncrease}>
                +
              </button>
            </div>
          </div>

          {/* Btn de Agregar al Carrito*/}
          <button
            className="add-to-cart-btn"
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded}
            style={isAdded ? { backgroundColor: '#27ae60' } : {}}>
            {isAdded ? (
              <>
                <span className="cart-icon">✅</span> Agregado!
              </>
            ) : (
              <>
                <span className="cart-icon">🛒</span>
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
