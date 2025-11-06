import { useAppContext } from '../../../hooks/useAppContext';
//iconos
import { ShoppingCart } from 'lucide-react';
import './CartIconStyles.css';

export const CartIcon = () => {
  const { getTotalProductsInCart } = useAppContext();
  const totalItems = getTotalProductsInCart();

  return (
    <div className="cart-icon-wrapper">
      <ShoppingCart size={24} />
      {totalItems > 0 && <span className="cart-item-count">{totalItems}</span>}
    </div>
  );
};
