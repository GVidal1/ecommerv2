import { useAppContext } from '../../../hooks/useAppContext';
import type { CartItem } from '../../../types';

interface ProductInCartProps {
  item: CartItem;
}

export const ProductInCart = ({ item }: ProductInCartProps) => {
  const { updateCartQuantity, removeProductFromCart } = useAppContext();

  const handleIncrease = () => {
    updateCartQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    updateCartQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    removeProductFromCart(item.id);
  };

  const itemTotal = (
    item.price *
    item.quantity *
    (1 - item.discountPercentage / 100)
  ).toFixed(2);

  return (
    <div className="cartProduct-container">
      <img src={item.thumbnail} alt={item.title} />

      <div className="cartProduct-info">
        <h4>{item.title}</h4>
        <p>{item.description}</p>
        <p>Precio unitario: ${item.price}</p>
      </div>

      <div className="cartProduct-controls">
        <div className="quantity-controls">
          <button onClick={handleDecrease}>-</button>
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
