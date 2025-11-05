import { useAppContext } from '../../../hooks/useAppContext';
import type { Product } from '../../../types';

interface AddToCartBtnProps {
  product: Product;
}

export const AddToCartBtn = ({ product }: AddToCartBtnProps) => {
  const { cart, addProductToCart, updateCartQuantity } = useAppContext();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addProductToCart(product);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, quantity + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, quantity - 1);
  };

  return (
    <>
      {quantity === 0 ? (
        // Botón "Agregar"
        <button className="add-btn" onClick={handleAdd}>
          Agregar al Carrito
        </button>
      ) : (
        // Controles de Cantidad
        <div className="quantity-controls">
          <button onClick={handleDecrease}>−</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
      )}
    </>
  );
};
