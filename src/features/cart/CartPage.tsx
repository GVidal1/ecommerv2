import { useAppContext } from '../../hooks/useAppContext';
import { Link } from 'react-router-dom';
import { ProductInCart } from './components/ProductInCart';

import './CartPageStyle.css';

const CartPage = () => {
  const { cart, getTotalProductsInCart, getCartTotal, clearCart } =
    useAppContext();

  const totalItems = getTotalProductsInCart();
  const totalPrice = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos productos para comenzar a comprar</p>
          <Link to="/products" className="btn-primary">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <p>Total de productos: {totalItems}</p>
        </div>

        <div className="cart-products">
          {cart.map((item) => (
            <ProductInCart key={item.id} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <div className="total-section">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button
              className="btn-checkout"
              onClick={() => alert('¡Función de pago no implementada!')}>
              Proceder al Pago
            </button>
            <button className="btn-clear-cart" onClick={clearCart}>
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
