import { useAppContext } from '../../../hooks/useAppContext';
import { Link } from 'react-router-dom';
//iconos
import { ShoppingCart } from 'lucide-react';
//estilo
import './CartIconStyles.css';

export const CartIcon = () => {
  const { getTotalProductsInCart } = useAppContext();
  const totalItems = getTotalProductsInCart();

  return (
    <Link to="/cart" className="cart-icon-wrapper">
      <ShoppingCart size={24} />
      {totalItems > 0 && <span className="cart-item-count">{totalItems}</span>}
    </Link>
  );
};
