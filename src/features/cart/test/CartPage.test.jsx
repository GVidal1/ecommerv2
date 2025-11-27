import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useAppContext } from '../../../hooks/useAppContext';
import CartPage from '../CartPage';

vi.mock('../../../hooks/useAppContext', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  ShoppingCart: () => <span data-testid="icon-cart">Icon</span>,
}));

const mockCartItems = [
  {
    id: 1,
    productId: 101,
    title: 'Laptop Gamer',
    description: 'Una laptop potente',
    price: 1500.0,
    thumbnail: 'img-url.jpg',
    quantity: 1,
    discountPercentage: 10,
  },
  {
    id: 2,
    productId: 102,
    title: 'Mouse Inalámbrico',
    description: 'Mouse ergonómico',
    price: 50.0,
    thumbnail: 'img-url-2.jpg',
    quantity: 2,
    discountPercentage: 0,
  },
];

describe('Integration Test - CartPage', () => {
  const mockClearCart = vi.fn();
  const mockUpdateCartQuantity = vi.fn();
  const mockRemoveProductFromCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Debe mostrar mensaje de carrito vacío cuando no hay items', () => {
    useAppContext.mockReturnValue({
      cart: [],
      getTotalProductsInCart: () => 0,
      getCartTotal: () => 0,
      clearCart: mockClearCart,
    });

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver Productos/i)).toBeInTheDocument();
  });

  test('Debe renderizar lista de productos y resumen cuando hay items', () => {
    useAppContext.mockReturnValue({
      cart: mockCartItems,
      getTotalProductsInCart: () => 3,
      getCartTotal: () => 1450.0,
      updateCartQuantity: mockUpdateCartQuantity,
      removeProductFromCart: mockRemoveProductFromCart,
      clearCart: mockClearCart,
    });

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Carrito de Compras/i)).toBeInTheDocument();

    expect(screen.getByText('Laptop Gamer')).toBeInTheDocument();
    expect(screen.getByText('Mouse Inalámbrico')).toBeInTheDocument();

    expect(screen.getByText(/Total: \$1450.00/i)).toBeInTheDocument();
  });

  test('Debe llamar a updateCartQuantity al hacer click en botones + y -', () => {
    useAppContext.mockReturnValue({
      cart: [mockCartItems[0]],
      getTotalProductsInCart: () => 1,
      getCartTotal: () => 1350,
      updateCartQuantity: mockUpdateCartQuantity,
      removeProductFromCart: mockRemoveProductFromCart,
    });

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    const increaseBtn = screen.getByText('+');
    fireEvent.click(increaseBtn);

    expect(mockUpdateCartQuantity).toHaveBeenCalledWith(101, 2);
  });

  test('Debe llamar a clearCart al hacer click en "Vaciar Carrito"', () => {
    useAppContext.mockReturnValue({
      cart: mockCartItems,
      getTotalProductsInCart: () => 3,
      getCartTotal: () => 100,
      clearCart: mockClearCart,
      updateCartQuantity: mockUpdateCartQuantity,
      removeProductFromCart: mockRemoveProductFromCart,
    });

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    const clearBtn = screen.getByText(/Vaciar Carrito/i);
    fireEvent.click(clearBtn);

    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });
});
