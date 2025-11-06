import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import type { Product } from '../../../types';
import './AddToCardBtnStyles.css';

interface IAddToCartContext {
  quantity: number;
  handleAdd: (e: React.MouseEvent) => void;
  handleIncrease: (e: React.MouseEvent) => void;
  handleDecrease: (e: React.MouseEvent) => void;
}

const AddToCartContext = createContext<IAddToCartContext | undefined>(
  undefined
);

const useAddToCart = () => {
  const context = useContext(AddToCartContext);
  if (!context) {
    throw new Error(
      'Este componente debe ser usado dentro de <AddToCart>...</AddToCart>'
    );
  }
  return context;
};

interface AddToCartProps {
  product: Product;
  children: ReactNode;
}

export const AddToCart = ({ product, children }: AddToCartProps) => {
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

  const value = {
    quantity,
    handleAdd,
    handleIncrease,
    handleDecrease,
  };

  return (
    <AddToCartContext.Provider value={value}>
      {children}
    </AddToCartContext.Provider>
  );
};

const AddButton = () => {
  const { quantity, handleAdd } = useAddToCart();

  if (quantity > 0) return null;

  return (
    <button className="add-btn" onClick={handleAdd}>
      Agregar al Carrito
    </button>
  );
};

const Controls = () => {
  const { quantity, handleIncrease, handleDecrease } = useAddToCart();

  if (quantity === 0) return null;

  return (
    <div className="quantity-controls">
      <button onClick={handleDecrease}>−</button>
      <span>{quantity}</span>
      <button onClick={handleIncrease}>+</button>
    </div>
  );
};

AddToCart.AddButton = AddButton;
AddToCart.Controls = Controls;
