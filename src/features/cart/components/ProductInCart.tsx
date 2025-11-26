import { useAppContext } from '../../../hooks/useAppContext';
import type { CartItem } from '../../../types';

interface ProductInCartProps {
  item: CartItem;
}

export const ProductInCart = ({ item }: ProductInCartProps) => {
  const { updateCartQuantity, removeProductFromCart } = useAppContext();

  const handleIncrease = () => {
    updateCartQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrease = () => {
    updateCartQuantity(item.productId, item.quantity - 1);
  };

  const handleRemove = () => {
    removeProductFromCart(item.productId);
  };

  const priceWithDiscount =
    item.price * (1 - (item.discountPercentage || 0) / 100);

  const itemTotal = (priceWithDiscount * item.quantity).toFixed(2);

  return (
    <div className="cartProduct-container">
      <img src={item.thumbnail} alt={item.title} />

      <div className="cartProduct-info">
        <h4>{item.title}</h4>
        <p className="description">{item.description}</p>
        <p>Precio unitario: ${item.price.toFixed(2)}</p>
        {item.discountPercentage > 0 && (
          <span className="discount-badge">
            {item.discountPercentage}% de descuento
          </span>
        )}
      </div>

      <div className="cartProduct-controls">
        <div className="quantity-controls">
          <button onClick={handleDecrease} disabled={item.quantity <= 1}>
            -
          </button>
          <span>{item.quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>

        <div className="product-total">
          <h5>Total: ${itemTotal}</h5>
        </div>

        <button onClick={handleRemove} className="remove-btn">
          Eliminar
        </button>
      </div>
    </div>
  );
};
